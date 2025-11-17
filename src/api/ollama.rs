use axum::{
    extract::State,
    http::{HeaderMap, StatusCode},
    response::{IntoResponse, Json},
    response::Response,
    body::Body,
    routing::{get, post},
    Router,
};
use futures::StreamExt;
use serde::Deserialize;
use serde_json::{json, Value};
use std::convert::Infallible;
use tracing::{info, warn, error};

use crate::adapters::{ClientAdapter, FormatDetector};
use crate::api::{AppState, convert};
use crate::models::ModelsConfig;
use crate::settings;
use crate::provider::minimax::MinimaxClient;

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

/// Build Ollama routes (used by main.rs)
#[allow(dead_code)]
pub fn build_ollama_routes(state: AppState, ollama_config: &settings::OllamaApiSettings) -> Router {
    let state_for_chat = state.clone();
    let state_for_tags = state.clone();

    Router::new()
        .route(&format!("{}/api/tags", ollama_config.path), get(move || {
            let state = state_for_tags.clone();
            async move {
                use axum::Json;

                // Determine current provider name from backend
                let provider_name = {
                    let cfg = state.config.read().await;
                    let name = match &cfg.llm_backend {
                        settings::LlmBackendSettings::OpenAI { .. } => "openai",
                        settings::LlmBackendSettings::Anthropic { .. } => "anthropic",
                        settings::LlmBackendSettings::Zhipu { .. } => "zhipu",
                        settings::LlmBackendSettings::Ollama { .. } => "ollama",
                        settings::LlmBackendSettings::Aliyun { .. } => "aliyun",
                        settings::LlmBackendSettings::Volcengine { .. } => "volcengine",
                        settings::LlmBackendSettings::Tencent { .. } => "tencent",
                        settings::LlmBackendSettings::Longcat { .. } => "longcat",
                        settings::LlmBackendSettings::Moonshot { .. } => "moonshot",
                        settings::LlmBackendSettings::Minimax { .. } => "minimax",
                    };
                    name.to_string()
                };

                // Load models from embedded models.yaml
                let models_config = ModelsConfig::load_with_fallback();
                let provider_models = models_config.get_models_for_provider(&provider_name);

                // Map to Ollama tags format
                let ollama_models: Vec<serde_json::Value> = provider_models
                    .into_iter()
                    .map(|m| {
                        let family = m.id.split('-').next().unwrap_or("model");
                        serde_json::json!({
                            "name": m.id,
                            "model": m.id,
                            "modified_at": "2025-01-01T00:00:00Z",
                            "size": 0,
                            "digest": m.id,
                            "details": {
                                "format": "remote",
                                "family": family,
                                "families": [family],
                                "parameter_size": "",
                                "quantization_level": ""
                            }
                        })
                    })
                    .collect();

                Json(serde_json::json!({
                    "models": ollama_models
                }))
            }
        }))
        .route(&format!("{}/api/chat", ollama_config.path), post(move |axum::extract::State(s): axum::extract::State<AppState>, axum::Json(req): axum::Json<serde_json::Value>| {
            let s = s.clone();
            async move {
                use tracing::info;
                use axum::response::{Response, IntoResponse};

                // Extract model name
                let model = req.get("model")
                    .and_then(|v| v.as_str())
                    .unwrap_or("MiniMax-M2")
                    .to_string();

                // Extract messages
                let messages_value = req.get("messages")
                    .and_then(|v| v.as_array())
                    .cloned()
                    .unwrap_or_default();

                // Extract stream parameter
                let stream = req.get("stream")
                    .and_then(|v| v.as_bool())
                    .unwrap_or(false);

                info!("📨 Chat request: model={}, messages_count={}, stream={}", model, messages_value.len(), stream);

                // Check if this is a MiniMax request and use direct client
                let config = s.config.read().await;
                let (is_minimax, minimax_api_key) = match &config.llm_backend {
                    settings::LlmBackendSettings::Minimax { api_key, .. } => (true, Some(api_key.clone())),
                    _ => (false, None),
                };
                drop(config);

                let response: Response = if is_minimax {
                    handle_minimax_chat(&model, messages_value, stream, minimax_api_key).await
                } else {
                    handle_generic_chat(s, &model, messages_value, stream).await
                };

                response.into_response()
            }
        }))
        .route(&format!("{}/api/show", ollama_config.path), post(show_handler))
        .route(&format!("{}/api/version", ollama_config.path), get(|| async {
            axum::Json(serde_json::json!({
                "version": "0.1.0",
                "build": "llm-link"
            }))
        }))
        .with_state(state_for_chat)
}

async fn handle_minimax_chat(
    model: &str,
    messages_value: Vec<serde_json::Value>,
    stream: bool,
    api_key: Option<String>,
) -> Response {
    use tracing::info;
    use axum::response::Response;
    use axum::body::Body;

    // Use direct MiniMax client for better compatibility
    if let Some(api_key) = api_key {
        let minimax_client = MinimaxClient::new(&api_key);

        if stream {
            handle_minimax_stream(&minimax_client, model, messages_value).await
        } else {
            // Handle non-streaming response
            match minimax_client.chat(model, messages_value).await {
                Ok(response) => {
                    info!("✅ Chat response generated successfully (MiniMax direct)");
                    let ollama_response = convert::response_to_ollama_from_minimax(response);
                    Response::builder()
                        .status(200)
                        .header("content-type", "application/json")
                        .body(Body::from(serde_json::to_string(&ollama_response).unwrap()))
                        .unwrap()
                }
                Err(e) => {
                    info!("❌ MiniMax direct request failed: {:?}", e);
                    Response::builder()
                        .status(500)
                        .header("content-type", "application/json")
                        .body(Body::from(serde_json::json!({"error": "Chat request failed"}).to_string()))
                        .unwrap()
                }
            }
        }
    } else {
        info!("❌ Minimax API key not set in config");
        Response::builder()
            .status(500)
            .header("content-type", "application/json")
            .body(Body::from(serde_json::json!({"error": "API key not configured"}).to_string()))
            .unwrap()
    }
}

async fn handle_minimax_stream(
    minimax_client: &MinimaxClient,
    model: &str,
    messages_value: Vec<serde_json::Value>,
) -> Response {
    use tracing::info;
    use axum::response::Response;
    use axum::body::Body;
    use futures::StreamExt;
    use std::convert::Infallible;

    // Handle streaming response
    match minimax_client.chat_stream(model, messages_value).await {
        Ok(stream) => {
            info!("✅ MiniMax streaming started");

            let model_name = model.to_string();
            let in_think = std::sync::Arc::new(std::sync::Mutex::new(false));
            let in_think_clone = in_think.clone();
            let adapted_stream = stream.map(move |result| {
                let in_think = in_think_clone.clone();
                match result {
                    Ok(chunk) => {
                        let output = minimax_chunk_to_ollama_lines(&chunk, &model_name, &in_think);
                        Ok::<_, Infallible>(output)
                    }
                    Err(_) => Ok(String::new()),
                }
            });

            let body_stream = adapted_stream.map(|data| {
                match data {
                    Ok(s) => Ok::<_, Infallible>(axum::body::Bytes::from(s)),
                    Err(_) => Ok(axum::body::Bytes::new()),
                }
            });
            let body = Body::from_stream(body_stream);

            Response::builder()
                .status(200)
                .header("content-type", "application/x-ndjson")
                .body(body)
                .unwrap()
        }
        Err(e) => {
            info!("❌ MiniMax streaming failed: {:?}", e);
            Response::builder()
                .status(500)
                .header("content-type", "application/json")
                .body(Body::from(serde_json::json!({"error": "Streaming failed"}).to_string()))
                .unwrap()
        }
    }
}

fn minimax_chunk_to_ollama_lines(
    chunk: &str,
    model_name: &str,
    in_think: &std::sync::Arc<std::sync::Mutex<bool>>,
) -> String {
    // Parse each JSON line in the chunk
    let mut output = String::new();

    for line in chunk.lines() {
        if line.is_empty() {
            continue;
        }

        // Parse JSON line; skip on failure
        let Ok(json_data) = serde_json::from_str::<serde_json::Value>(line) else {
            continue;
        };

        // Extract choices[0].delta.content as &str; skip if any step is missing
        let Some(choices) = json_data.get("choices").and_then(|c| c.as_array()) else {
            continue;
        };
        let Some(choice) = choices.first() else {
            continue;
        };
        let Some(delta) = choice.get("delta") else {
            continue;
        };
        let Some(content) = delta.get("content").and_then(|c| c.as_str()) else {
            continue;
        };

        // Track think blocks across chunks
        let mut in_think_block = in_think.lock().unwrap();

        // Check if we're entering a think block
        if content.contains("<think>") {
            *in_think_block = true;
        }

        // Check if we're exiting a think block
        if content.contains("</think>") {
            *in_think_block = false;
            continue;
        }

        // Skip content inside think blocks
        if *in_think_block {
            continue;
        }

        drop(in_think_block);

        // Clean up any remaining <think> tags
        let cleaned = MinimaxClient::clean_think_tags(content);

        if !cleaned.is_empty() {
            let ollama_chunk = serde_json::json!({
                "model": model_name,
                "created_at": chrono::Utc::now().to_rfc3339(),
                "message": {
                    "role": "assistant",
                    "content": cleaned,
                },
                "done": false
            });
            output.push_str(&format!("{}\n", ollama_chunk));
        }
    }

    output
}

async fn handle_generic_chat(
    state: AppState,
    model: &str,
    messages_value: Vec<serde_json::Value>,
    stream: bool,
) -> Response {
    use tracing::info;
    use axum::response::Response;
    use axum::body::Body;

    // Step 1: convert messages; early-return on error to avoid deep nesting
    let messages = match convert::openai_messages_to_llm(messages_value) {
        Ok(messages) => messages,
        Err(e) => {
            info!("❌ Failed to convert messages: {:?}", e);
            return Response::builder()
                .status(400)
                .header("content-type", "application/json")
                .body(Body::from(
                    serde_json::json!({"error": "Invalid messages format"}).to_string(),
                ))
                .unwrap();
        }
    };

    // Step 2: delegate to stream / non-stream helpers, always passing the
    // logical model name down to the service layer. Provider-specific
    // resolution (e.g. Volcengine endpoint IDs) is handled by the
    // normalizer/client via ModelResolver.
    if stream {
        handle_generic_chat_stream(state, Some(model.to_string()), messages).await
    } else {
        handle_generic_chat_nonstream(state, Some(model.to_string()), messages).await
    }
}

async fn handle_generic_chat_stream(
    state: AppState,
    model_arg: Option<String>,
    messages: Vec<llm_connector::types::Message>,
) -> Response {
    use tracing::info;
    use axum::response::Response;
    use axum::body::Body;
    use futures::StreamExt;
    use std::convert::Infallible;

    let llm_service = state.llm_service.read().await;
    let model_ref = model_arg.as_deref();

    match llm_service
        .chat_stream_ollama(model_ref, messages, llm_connector::StreamFormat::NDJSON)
        .await
    {
        Ok(rx) => {
            info!("✅ Chat streaming response started successfully");

            let body_stream = rx.map(|data| Ok::<_, Infallible>(axum::body::Bytes::from(data)));
            let body = Body::from_stream(body_stream);

            Response::builder()
                .status(200)
                .header("content-type", "application/x-ndjson")
                .body(body)
                .unwrap()
        }
        Err(e) => {
            info!("❌ Chat streaming request failed: {:?}", e);
            Response::builder()
                .status(500)
                .header("content-type", "application/json")
                .body(Body::from(
                    serde_json::json!({"error": "Chat request failed"}).to_string(),
                ))
                .unwrap()
        }
    }
}

async fn handle_generic_chat_nonstream(
    state: AppState,
    model_arg: Option<String>,
    messages: Vec<llm_connector::types::Message>,
) -> Response {
    use tracing::info;
    use axum::response::Response;
    use axum::body::Body;

    let llm_service = state.llm_service.read().await;
    let model_ref = model_arg.as_deref();

    match llm_service.chat(model_ref, messages, None).await {
        Ok(response) => {
            info!("✅ Chat response generated successfully");
            let ollama_response = convert::response_to_ollama(response);
            Response::builder()
                .status(200)
                .header("content-type", "application/json")
                .body(Body::from(serde_json::to_string(&ollama_response).unwrap()))
                .unwrap()
        }
        Err(e) => {
            info!("❌ Chat request failed: {:?}", e);
            Response::builder()
                .status(500)
                .header("content-type", "application/json")
                .body(Body::from(
                    serde_json::json!({"error": "Chat request failed"}).to_string(),
                ))
                .unwrap()
        }
    }
}
