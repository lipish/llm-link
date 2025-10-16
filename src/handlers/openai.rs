use axum::{
    extract::{Query, State},
    http::{HeaderMap, StatusCode},
    response::{IntoResponse, Json},
    response::Response,
    body::Body,
};
use futures::StreamExt;
use serde::Deserialize;
use serde_json::{json, Value};
use std::convert::Infallible;
use tracing::{info, warn, error};

use crate::adapters::{ClientAdapter, FormatDetector};
use crate::handlers::AppState;
use crate::service;

#[derive(Debug, Deserialize)]
pub struct OpenAIChatRequest {
    pub model: String,
    pub messages: Vec<Value>,
    pub stream: Option<bool>,
    #[allow(dead_code)]
    pub max_tokens: Option<u32>,
    #[allow(dead_code)]
    pub temperature: Option<f32>,
}

#[derive(Debug, Deserialize)]
pub struct OpenAIModelsParams {
    // OpenAI models endpoint parameters (if any)
}

/// OpenAI Chat Completions API
pub async fn chat(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(request): Json<OpenAIChatRequest>,
) -> Result<Response, StatusCode> {
    // API Key 校验
    enforce_api_key(&headers, &state)?;
    
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
    // 🎯 OpenAI API 固定使用 OpenAI 适配器
    let client_adapter = ClientAdapter::OpenAI;
    let (_stream_format, _) = FormatDetector::determine_format(&headers);
    
    // 使用客户端偏好格式（SSE）
    let final_format = client_adapter.preferred_format();
    let content_type = FormatDetector::get_content_type(final_format);

    info!("📡 Starting OpenAI streaming response - Format: {:?} ({})", final_format, content_type);

    match state.llm_service.chat_stream_openai(model, messages.clone(), final_format).await {
        Ok(rx) => {
            info!("✅ OpenAI streaming response started successfully");

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
            warn!("⚠️ OpenAI streaming failed, falling back to non-streaming: {:?}", e);
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
            let openai_response = service::convert_response_to_openai(response);
            Ok(Json(openai_response).into_response())
        }
        Err(e) => {
            error!("❌ OpenAI chat request failed: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// OpenAI Models API
pub async fn models(
    headers: HeaderMap,
    State(state): State<AppState>,
    Query(_params): Query<OpenAIModelsParams>,
) -> Result<impl IntoResponse, StatusCode> {
    // API Key 校验
    enforce_api_key(&headers, &state)?;
    
    match state.llm_service.models().await {
        Ok(models) => {
            let response = json!({
                "object": "list",
                "data": models
            });
            Ok(Json(response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

/// OpenAI API Key 认证
fn enforce_api_key(headers: &HeaderMap, state: &AppState) -> Result<(), StatusCode> {
    if let Some(cfg) = &state.config.apis.openai {
        if cfg.enabled {
            if let Some(expected_key) = cfg.api_key.as_ref() {
                let header_name = cfg.api_key_header.as_deref().unwrap_or("authorization").to_ascii_lowercase();
                
                let value_opt = if header_name == "authorization" {
                    headers.get(axum::http::header::AUTHORIZATION)
                } else {
                    match axum::http::HeaderName::from_bytes(header_name.as_bytes()) {
                        Ok(name) => headers.get(name),
                        Err(_) => None,
                    }
                };

                if let Some(value) = value_opt {
                    if let Ok(value_str) = value.to_str() {
                        let token = if value_str.starts_with("Bearer ") {
                            &value_str[7..]
                        } else {
                            value_str
                        };

                        if token == expected_key {
                            info!("✅ OpenAI API key authentication successful");
                            return Ok(());
                        }
                    }
                }

                warn!("🚫 OpenAI API key authentication failed");
                return Err(StatusCode::UNAUTHORIZED);
            }
        }
    }
    Ok(())
}
