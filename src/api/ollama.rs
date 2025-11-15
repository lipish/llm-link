use axum::{
    extract::State,
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
pub struct OllamaChatRequest {
    #[allow(dead_code)]
    pub model: String,
    #[allow(dead_code)]
    pub messages: Vec<Value>,
    #[allow(dead_code)]
    pub stream: Option<bool>,
    #[allow(dead_code)]
    pub options: Option<Value>,
}

#[derive(Debug, Deserialize)]
pub struct OllamaTagsParams {
    // Ollama tags endpoint parameters (if any)
}

// Chat handler is now implemented in main.rs as an inline closure
// This is a workaround for Axum's strict type system

/// Ollama Chat API - Internal implementation
async fn chat_impl(
    headers: HeaderMap,
    state: AppState,
    request: OllamaChatRequest,
) -> Result<Response, StatusCode> {

    // Ollama API 通常不需要认证，但可以配置
    {
        let config = state.config.read().await;
        if let Some(cfg) = &config.apis.ollama {
            if let Some(_expected_key) = cfg.api_key.as_ref() {
                // 如果配置了 API key，则进行验证
                // 这里可以添加 Ollama API key 验证逻辑
            }
        }
    }

    // 验证模型
    if !request.model.is_empty() {
        let llm_service = state.llm_service.read().await;
        match llm_service.validate_model(&request.model).await {
            Ok(false) => return Err(StatusCode::BAD_REQUEST),
            Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
            Ok(true) => {}
        }
    }

    // 转换消息格式
    match convert::openai_messages_to_llm(request.messages) {
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
#[allow(dead_code)]
async fn handle_streaming_request(
    headers: HeaderMap,
    state: AppState,
    model: Option<&str>,
    messages: Vec<llm_connector::types::Message>,
) -> Result<Response, StatusCode> {
    // 🎯 检测客户端类型（Zed.dev 或标准）
    let config = state.config.read().await;
    let client_adapter = detect_ollama_client(&headers, &config);
    let (stream_format, _) = FormatDetector::determine_format(&headers);
    drop(config); // 释放读锁
    
    // 使用检测到的格式或客户端偏好
    let final_format = if headers.get("accept").map_or(true, |v| v.to_str().unwrap_or("").contains("*/*")) {
        client_adapter.preferred_format()
    } else {
        stream_format
    };
    
    let content_type = FormatDetector::get_content_type(final_format);

    info!("📡 Starting Ollama streaming response - Client: {:?}, Format: {:?} ({})",
          client_adapter, final_format, content_type);

    let llm_service = state.llm_service.read().await;
    let stream_result = llm_service.chat_stream_ollama(model, messages.clone(), final_format).await;
    drop(llm_service); // 显式释放锁

    match stream_result {
        Ok(rx) => {
            info!("✅ Ollama streaming response started successfully");

            // Get config before entering the map closure and clone it for the closure
            let config = state.config.read().await.clone();
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
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

            Ok(response)
        }
        Err(e) => {
            warn!("⚠️ Ollama streaming failed, falling back to non-streaming: {:?}", e);
            handle_non_streaming_request(state, model, messages).await
        }
    }
}

/// Ollama Chat API - Handler for Axum
#[allow(dead_code)]
pub async fn chat(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(request): Json<OllamaChatRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    match chat_impl(headers, state, request).await {
        Ok(_response) => {
            // For now, return a simple success response
            Ok(Json(json!({"status": "ok", "message": "Chat endpoint called"})))
        }
        Err(status) => Err(status),
    }
}

/// 处理非流式请求
#[allow(dead_code)]
async fn handle_non_streaming_request(
    state: AppState,
    model: Option<&str>,
    messages: Vec<llm_connector::types::Message>,
) -> Result<Response, StatusCode> {
    let llm_service = state.llm_service.read().await;
    let chat_result = llm_service.chat(model, messages, None).await;

    match chat_result {
        Ok(response) => {
            let ollama_response = convert::response_to_ollama(response);
            Ok(Json(ollama_response).into_response())
        }
        Err(e) => {
            error!("❌ Ollama chat request failed: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

/// Ollama Models API (Tags)
#[allow(dead_code)]
pub async fn models(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let llm_service = state.llm_service.read().await;
    let models_result = llm_service.list_models().await;

    match models_result {
        Ok(models) => {
            let ollama_models = convert::models_to_ollama(models);

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
                "models": ollama_models,
                "provider": current_provider,
            });
            Ok(Json(response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

/// 检测 Ollama 客户端类型
#[allow(dead_code)]
fn detect_ollama_client(headers: &HeaderMap, config: &crate::settings::Settings) -> ClientAdapter {
    // 1. 检查强制适配器设置
    if let Some(ref adapters) = config.client_adapters {
        if let Some(force_adapter) = &adapters.force_adapter {
            match force_adapter.to_lowercase().as_str() {
                "zed" | "zed.dev" => return ClientAdapter::Zed,
                "standard" => return ClientAdapter::Standard,
                _ => {}
            }
        }
    }

    // 2. 检查显式客户端标识
    if let Some(client) = headers.get("x-client") {
        if let Ok(client_str) = client.to_str() {
            match client_str.to_lowercase().as_str() {
                "zed" | "zed.dev" => return ClientAdapter::Zed,
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
                            return ClientAdapter::Zed;
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
                "zed" | "zed.dev" => return ClientAdapter::Zed,
                "standard" => return ClientAdapter::Standard,
                _ => {}
            }
        }
    }

    // 5. 最终默认
    ClientAdapter::Standard
}

/// Ollama Generate API (占位符)
#[allow(dead_code)]
pub async fn generate(
    State(_state): State<AppState>,
    Json(_request): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // 暂时返回未实现
    Ok(Json(serde_json::json!({
        "error": "Generate API not implemented yet"
    })))
}

/// Ollama Show API - Handler for Axum (with proper signature)
pub async fn show_handler(
    State(_state): State<AppState>,
    Json(request): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    // Extract model name from request
    let model_name = request.get("name")
        .or_else(|| request.get("model"))
        .and_then(|v| v.as_str())
        .unwrap_or("MiniMax-M2");

    // Return model details in Ollama format
    let response = json!({
        "license": "",
        "modelfile": format!("FROM {}", model_name),
        "parameters": "",
        "template": "{{ if .System }}{{ .System }}{{ end }}{{ if .Prompt }}{{ .Prompt }}{{ end }}{{ .Response }}",
        "details": {
            "parent_model": "",
            "format": "gguf",
            "family": model_name.split('-').next().unwrap_or("unknown"),
            "families": [model_name.split('-').next().unwrap_or("unknown")],
            "parameter_size": "7B",
            "quantization_level": "Q4_K_M"
        }
    });
    Ok(Json(response))
}

/// Ollama Show API - 显示模型详细信息
#[allow(dead_code)]
pub async fn show(
    State(state): State<AppState>,
    Json(request): Json<Value>,
) -> Result<Json<Value>, StatusCode> {
    use tracing::info;

    // Extract model name from request - try both "name" and "model" fields
    let model_name = request.get("name")
        .or_else(|| request.get("model"))
        .and_then(|v| v.as_str())
        .unwrap_or("unknown");

    info!("🔍 /api/show request for model: '{}', full request: {}", model_name, request);

    // Check if model exists
    let llm_service = state.llm_service.read().await;
    let validation_result = llm_service.validate_model(model_name).await;

    match validation_result {
        Ok(true) => {
            info!("✅ Model '{}' validated successfully", model_name);
            // Return model details in Ollama format
            let response = json!({
                "license": "",
                "modelfile": format!("FROM {}", model_name),
                "parameters": "",
                "template": "{{ if .System }}{{ .System }}{{ end }}{{ if .Prompt }}{{ .Prompt }}{{ end }}{{ .Response }}",
                "details": {
                    "parent_model": "",
                    "format": "gguf",
                    "family": model_name.split('-').next().unwrap_or("unknown"),
                    "families": [model_name.split('-').next().unwrap_or("unknown")],
                    "parameter_size": "7B",
                    "quantization_level": "Q4_K_M"
                },
                "model_info": {
                    "general.architecture": "llama",
                    "general.file_type": 2,
                    "general.parameter_count": 7000000000u64,
                    "general.quantization_version": 2,
                    "llama.attention.head_count": 32,
                    "llama.attention.head_count_kv": 32,
                    "llama.attention.layer_norm_rms_epsilon": 0.000001,
                    "llama.block_count": 32,
                    "llama.context_length": 4096,
                    "llama.embedding_length": 4096,
                    "llama.feed_forward_length": 11008,
                    "llama.rope.dimension_count": 128,
                    "llama.rope.freq_base": 10000.0,
                    "llama.vocab_size": 32000
                }
            });
            Ok(Json(response))
        }
        Ok(false) => {
            info!("❌ Model '{}' not found in available models", model_name);
            Err(StatusCode::NOT_FOUND)
        },
        Err(e) => {
            info!("⚠️ Error validating model '{}': {:?}", model_name, e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        },
    }
}

/// Ollama PS API - 列出运行中的模型 (占位符)
#[allow(dead_code)]
pub async fn ps(
    State(_state): State<AppState>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // 暂时返回空的运行模型列表
    Ok(Json(serde_json::json!({
        "models": []
    })))
}
