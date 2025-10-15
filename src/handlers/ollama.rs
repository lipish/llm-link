use axum::{
    extract::{Query, State},
    http::{HeaderMap, StatusCode},
    response::{IntoResponse, Json},
    response::Response,
    body::Body,
};
use futures::StreamExt;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::convert::Infallible;
use tracing::{info, warn, error};

use crate::adapters::{ClientAdapter, FormatDetector};
use crate::handlers::AppState;
use crate::service;

#[derive(Debug, Deserialize)]
pub struct OllamaChatRequest {
    pub model: String,
    pub messages: Vec<Value>,
    pub stream: Option<bool>,
    pub options: Option<Value>,
}

#[derive(Debug, Deserialize)]
pub struct OllamaTagsParams {
    // Ollama tags endpoint parameters (if any)
}

/// Ollama Chat API
pub async fn chat(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(request): Json<OllamaChatRequest>,
) -> Result<Response, StatusCode> {
    // Ollama API 通常不需要认证，但可以配置
    if let Some(cfg) = &state.config.apis.ollama {
        if let Some(expected_key) = cfg.api_key.as_ref() {
            // 如果配置了 API key，则进行验证
            // 这里可以添加 Ollama API key 验证逻辑
        }
    }
    
    // 验证模型
    if !request.model.is_empty() {
        match state.llm_service.validate_model(&request.model).await {
            Ok(false) => return Err(StatusCode::BAD_REQUEST),
            Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
            Ok(true) => {}
        }
    }

    // 转换消息格式
    match service::convert_openai_messages(request.messages) {
        Ok(messages) => {
            let model = if request.model.is_empty() { None } else { Some(request.model.as_str()) };

            if request.stream.unwrap_or(false) {
                handle_streaming_request(headers, state, model, messages).await
            } else {
                handle_non_streaming_request(state, model, messages).await
            }
        }
        Err(_) => Err(StatusCode::BAD_REQUEST),
    }
}

/// 处理流式请求
async fn handle_streaming_request(
    headers: HeaderMap,
    state: AppState,
    model: Option<&str>,
    messages: Vec<crate::client::Message>,
) -> Result<Response, StatusCode> {
    // 🎯 检测客户端类型（Zed.dev 或标准）
    let client_adapter = detect_ollama_client(&headers, &state.config);
    let (stream_format, _) = FormatDetector::determine_format(&headers);
    
    // 使用检测到的格式或客户端偏好
    let final_format = if headers.get("accept").map_or(true, |v| v.to_str().unwrap_or("").contains("*/*")) {
        client_adapter.preferred_format()
    } else {
        stream_format
    };
    
    let content_type = FormatDetector::get_content_type(final_format);

    info!("📡 Starting Ollama streaming response - Client: {:?}, Format: {:?} ({})",
          client_adapter, final_format, content_type);

    match state.llm_service.chat_stream_with_format(model, messages.clone(), final_format).await {
        Ok(rx) => {
            info!("✅ Ollama streaming response started successfully");

            let config = state.config.clone();
            let adapted_stream = rx.map(move |data| {
                // 解析并适配响应数据
                if let Ok(mut json_data) = serde_json::from_str::<Value>(&data) {
                    client_adapter.apply_response_adaptations(&config, &mut json_data);

                    match final_format {
                        llm_connector::StreamFormat::SSE => {
                            format!("data: {}\n\n", json_data)
                        }
                        llm_connector::StreamFormat::NDJSON => {
                            format!("{}\n", json_data)
                        }
                        llm_connector::StreamFormat::Json => {
                            json_data.to_string()
                        }
                    }
                } else {
                    data.to_string()
                }
            });

            let body_stream = adapted_stream.map(|data| Ok::<_, Infallible>(data));
            let body = Body::from_stream(body_stream);

            let response = Response::builder()
                .status(200)
                .header("content-type", content_type)
                .header("cache-control", "no-cache")
                .body(body)
                .unwrap();

            Ok(response)
        }
        Err(e) => {
            warn!("⚠️ Ollama streaming failed, falling back to non-streaming: {:?}", e);
            handle_non_streaming_request(state, model, messages).await
        }
    }
}

/// 处理非流式请求
async fn handle_non_streaming_request(
    state: AppState,
    model: Option<&str>,
    messages: Vec<crate::client::Message>,
) -> Result<Response, StatusCode> {
    match state.llm_service.chat_with_model(model, messages).await {
        Ok(response) => {
            let ollama_response = service::convert_response_to_ollama(response);
            Ok(Json(ollama_response).into_response())
        }
        Err(e) => {
            error!("❌ Ollama chat request failed: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Ollama Tags API
pub async fn tags(
    _headers: HeaderMap,
    State(state): State<AppState>,
    Query(_params): Query<OllamaTagsParams>,
) -> Result<impl IntoResponse, StatusCode> {
    match state.llm_service.models().await {
        Ok(models) => {
            let response = json!({
                "models": models
            });
            Ok(Json(response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

/// 检测 Ollama 客户端类型
fn detect_ollama_client(headers: &HeaderMap, config: &crate::config::Config) -> ClientAdapter {
    // 1. 检查强制适配器设置
    if let Some(ref adapters) = config.client_adapters {
        if let Some(force_adapter) = &adapters.force_adapter {
            match force_adapter.to_lowercase().as_str() {
                "zed" | "zed.dev" => return ClientAdapter::ZedDev,
                "standard" => return ClientAdapter::Standard,
                _ => {}
            }
        }
    }

    // 2. 检查显式客户端标识
    if let Some(client) = headers.get("x-client") {
        if let Ok(client_str) = client.to_str() {
            match client_str.to_lowercase().as_str() {
                "zed" | "zed.dev" => return ClientAdapter::ZedDev,
                "standard" => return ClientAdapter::Standard,
                _ => {}
            }
        }
    }

    // 3. 检查 User-Agent 自动检测
    if let Some(user_agent) = headers.get("user-agent") {
        if let Ok(ua_str) = user_agent.to_str() {
            // 检测 Zed.dev 编辑器
            if ua_str.starts_with("Zed/") {
                if let Some(ref adapters) = config.client_adapters {
                    if let Some(ref zed_config) = adapters.zed {
                        if zed_config.enabled {
                            return ClientAdapter::ZedDev;
                        }
                    }
                }
            }
        }
    }

    // 4. 使用默认适配器
    if let Some(ref adapters) = config.client_adapters {
        if let Some(default_adapter) = &adapters.default_adapter {
            match default_adapter.to_lowercase().as_str() {
                "zed" | "zed.dev" => return ClientAdapter::ZedDev,
                "standard" => return ClientAdapter::Standard,
                _ => {}
            }
        }
    }

    // 5. 最终默认
    ClientAdapter::Standard
}
