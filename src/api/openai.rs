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
use crate::api::{AppState, convert};

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
pub struct OpenAIChatRequest {
    #[allow(dead_code)]
    pub model: String,
    #[allow(dead_code)]
    pub messages: Vec<Value>,
    #[allow(dead_code)]
    pub stream: Option<bool>,
    #[allow(dead_code)]
    pub max_tokens: Option<u32>,
    #[allow(dead_code)]
    pub temperature: Option<f32>,
    #[allow(dead_code)]
    pub tools: Option<Vec<Value>>,
    #[allow(dead_code)]
    pub tool_choice: Option<Value>,
}

#[derive(Debug, Deserialize)]
pub struct OpenAIModelsParams {
    // OpenAI models endpoint parameters (if any)
}

/// OpenAI Chat Completions API
#[allow(dead_code)]
pub async fn chat(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(request): Json<OpenAIChatRequest>,
) -> Result<Response, StatusCode> {
    // API Key 校验
    enforce_api_key(&headers, &state).await?;

    info!("📝 Received request - model: {}, stream: {:?}, messages count: {}",
          request.model, request.stream, request.messages.len());

    // 验证模型
    if !request.model.is_empty() {
        let validation_result = {
            let llm_service = state.llm_service.read().await;
            llm_service.validate_model(&request.model).await
        };

        match validation_result {
            Ok(false) => {
                error!("❌ Model validation failed: model '{}' not found", request.model);
                return Err(StatusCode::BAD_REQUEST);
            }
            Err(e) => {
                error!("❌ Model validation error: {:?}", e);
                return Err(StatusCode::INTERNAL_SERVER_ERROR);
            }
            Ok(true) => {
                info!("✅ Model '{}' validated successfully", request.model);
            }
        }
    }

    // 转换消息格式
    match convert::openai_messages_to_llm(request.messages) {
        Ok(messages) => {
            info!("✅ Successfully converted {} messages", messages.len());
            let model = if request.model.is_empty() { None } else { Some(request.model.as_str()) };

            // 转换 tools 格式
            let tools = request.tools.map(|t| convert::openai_tools_to_llm(t));
            if let Some(ref tools_ref) = tools {
                info!("🔧 Request includes {} tools", tools_ref.len());
                // Debug: log the first tool
                if let Some(first_tool) = tools_ref.first() {
                    info!("🔧 First tool: {:?}", serde_json::to_value(first_tool).ok());
                }
            }

            // 直接使用请求指定的模式（流式或非流式）
            // 等待 llm-connector 修复流式 tool_calls 解析问题
            if request.stream.unwrap_or(false) {
                handle_streaming_request(headers, state, model, messages, tools).await
            } else {
                handle_non_streaming_request(state, model, messages, tools).await
            }
        }
        Err(e) => {
            error!("❌ Failed to convert OpenAI messages: {:?}", e);
            Err(StatusCode::BAD_REQUEST)
        }
    }
}

/// 处理流式请求
#[allow(dead_code)]
async fn handle_streaming_request(
    headers: HeaderMap,
    state: AppState,
    model: Option<&str>,
    messages: Vec<llm_connector::types::Message>,
    tools: Option<Vec<llm_connector::types::Tool>>,
) -> Result<Response, StatusCode> {
    // 🎯 检测客户端类型（默认使用 OpenAI 适配器）
    let config = state.config.read().await;
    let client_adapter = detect_openai_client(&headers, &config);
    let (_stream_format, _) = FormatDetector::determine_format(&headers);
    drop(config); // 释放读锁
    
    // 使用客户端偏好格式（SSE）
    let final_format = client_adapter.preferred_format();
    let content_type = FormatDetector::get_content_type(final_format);

    info!("📡 Starting OpenAI streaming response - Format: {:?} ({})", final_format, content_type);

    let llm_service = state.llm_service.read().await;
    let stream_result = llm_service.chat_stream_openai(model, messages.clone(), tools.clone(), final_format).await;
    drop(llm_service); // 显式释放锁

    match stream_result {
        Ok(rx) => {
            info!("✅ OpenAI streaming response started successfully");

            // Get config before entering the map closure and clone it for the closure
            let config = state.config.read().await.clone();
            let adapted_stream = rx.map(move |data| {
                // SSE 格式的数据以 "data: " 开头，需要先提取 JSON 部分
                let json_str = if data.starts_with("data: ") {
                    &data[6..] // 去掉 "data: " 前缀
                } else {
                    &data
                };

                // 跳过空行和 [DONE] 标记
                if json_str.trim().is_empty() || json_str.trim() == "[DONE]" {
                    return data.to_string();
                }

                // 解析并适配响应数据
                if let Ok(mut json_data) = serde_json::from_str::<Value>(json_str) {
                    tracing::debug!("📝 Parsed JSON chunk, applying adaptations...");
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
                    tracing::debug!("⚠️ Failed to parse chunk as JSON: {}", json_str);
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
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            Ok(response)
        }
        Err(e) => {
            warn!("⚠️ OpenAI streaming failed, falling back to non-streaming: {:?}", e);
            handle_non_streaming_request(state, model, messages, tools).await
        }
    }
}

/// 处理非流式请求
#[allow(dead_code)]
async fn handle_non_streaming_request(
    state: AppState,
    model: Option<&str>,
    messages: Vec<llm_connector::types::Message>,
    tools: Option<Vec<llm_connector::types::Tool>>,
) -> Result<Response, StatusCode> {
    let llm_service = state.llm_service.read().await;
    let chat_result = llm_service.chat(model, messages, tools).await;

    match chat_result {
        Ok(response) => {
            let openai_response = convert::response_to_openai(response);
            Ok(Json(openai_response).into_response())
        }
        Err(e) => {
            error!("❌ OpenAI chat request failed: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// OpenAI Models API
#[allow(dead_code)]
pub async fn models(
    headers: HeaderMap,
    State(state): State<AppState>,
    Query(_params): Query<OpenAIModelsParams>,
) -> Result<impl IntoResponse, StatusCode> {
    enforce_api_key(&headers, &state).await?;

    let llm_service = state.llm_service.read().await;
    let models_result = llm_service.list_models().await;

    match models_result {
        Ok(models) => {
            let openai_models: Vec<Value> = models.into_iter().map(|model| {
                json!({
                    "id": model.id,
                    "object": "model",
                    "created": chrono::Utc::now().timestamp(),
                    "owned_by": "system"
                })
            }).collect();

            let config = state.config.read().await;
            let current_provider = match &config.llm_backend {
                crate::settings::LlmBackendSettings::OpenAI { .. } => "openai",
                crate::settings::LlmBackendSettings::Anthropic { .. } => "anthropic",
                crate::settings::LlmBackendSettings::Zhipu { .. } => "zhipu",
                crate::settings::LlmBackendSettings::Ollama { .. } => "ollama",
                crate::settings::LlmBackendSettings::Aliyun { .. } => "aliyun",
                crate::settings::LlmBackendSettings::Volcengine { .. } => "volcengine",
                crate::settings::LlmBackendSettings::Tencent { .. } => "tencent",
                crate::settings::LlmBackendSettings::Longcat { .. } => "longcat",
                crate::settings::LlmBackendSettings::Moonshot { .. } => "moonshot",
                crate::settings::LlmBackendSettings::Minimax { .. } => "minimax",
            };

            let response = json!({
                "object": "list",
                "data": openai_models,
                "provider": current_provider,
            });
            Ok(Json(response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

/// OpenAI API Key 认证
#[allow(dead_code)]
async fn enforce_api_key(headers: &HeaderMap, state: &AppState) -> Result<(), StatusCode> {
    let config = state.config.read().await;
    if let Some(cfg) = &config.apis.openai {
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

/// 检测 OpenAI 客户端类型
#[allow(dead_code)]
fn detect_openai_client(_headers: &HeaderMap, _config: &crate::settings::Settings) -> ClientAdapter {
    // OpenAI API 总是使用 OpenAI 适配器
    ClientAdapter::OpenAI
}
