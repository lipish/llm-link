use crate::service::{Service, convert_response_to_ollama};
use crate::client::{Message, Role};
use axum::{
    extract::{Query, State},
    http::{HeaderName, HeaderMap, StatusCode},
    response::{IntoResponse, Json},
};
use axum::response::sse::{Sse, Event};
use std::convert::Infallible;
use futures::StreamExt;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::sync::Arc;
use crate::config::Config;
use tracing::{info, debug, warn, error};

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct OllamaGenerateRequest {
    pub model: String,
    pub prompt: String,
    pub options: Option<Value>,
    pub system: Option<String>,
    pub template: Option<String>,
    pub context: Option<Vec<i32>>,
    pub stream: Option<bool>,
}

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct OllamaChatRequest {
    pub model: String,
    pub messages: Vec<Value>,
    pub stream: Option<bool>,
    pub options: Option<Value>,
}

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct OllamaTagsParams {
    pub name: Option<String>,
}

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct OllamaShowRequest {
    #[serde(alias = "model")]
    pub name: String,
}

#[derive(Debug, Serialize)]
#[allow(unused)]
pub struct OllamaModelResponse {
    pub models: Vec<Value>,
}

#[derive(Clone)]
pub struct AppState {
    pub llm_service: Arc<Service>,
    pub config: Arc<Config>,
}

// Ollama API Handlers
pub async fn ollama_generate(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(request): Json<OllamaGenerateRequest>,
) -> Result<axum::response::Response, StatusCode> {
    // API Key 校验（仅对 Ollama 路由生效）
    enforce_api_key_for_ollama(&headers, &state)?;

    // Validate model if provided
    if !request.model.is_empty() {
        match state.llm_service.validate_model(&request.model).await {
            Ok(false) => return Err(StatusCode::BAD_REQUEST),
            Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
            Ok(true) => {} // Model is valid, continue
        }
    }

    let messages = vec![
        Message {
            role: Role::System,
            content: request.system.unwrap_or_default(),
        },
        Message {
            role: Role::User,
            content: request.prompt,
        },
    ];

    let model = if request.model.is_empty() { None } else { Some(request.model.as_str()) };

    if request.stream.unwrap_or(false) {
        match state.llm_service.chat_stream_with_model(model, messages).await {
            Ok(rx) => {
                let stream = rx.map(|data| Ok::<Event, Infallible>(Event::default().data(data)));
                Ok(Sse::new(stream).into_response())
            }
            Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
        }
    } else {
        match state.llm_service.chat_with_model(model, messages).await {
            Ok(response) => {
                let ollama_response = convert_response_to_ollama(response);
                Ok(Json(ollama_response).into_response())
            }
            Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
        }
    }
}

pub async fn ollama_chat(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(request): Json<OllamaChatRequest>,
) -> Result<axum::response::Response, StatusCode> {
    info!("💬 Ollama chat request received");
    debug!("Headers: {:?}", headers);
    debug!("Request: model='{}', messages_count={}, stream={:?}",
           request.model, request.messages.len(), request.stream);

    enforce_api_key_for_ollama(&headers, &state)?;
    info!("✅ API key validation passed");

    // Validate model if provided
    if !request.model.is_empty() {
        info!("🔍 Validating model: {}", request.model);
        match state.llm_service.validate_model(&request.model).await {
            Ok(false) => {
                warn!("❌ Invalid model requested: {}", request.model);
                return Err(StatusCode::BAD_REQUEST);
            },
            Err(e) => {
                error!("❌ Model validation error: {:?}", e);
                return Err(StatusCode::INTERNAL_SERVER_ERROR);
            },
            Ok(true) => {
                info!("✅ Model validation passed: {}", request.model);
            }
        }
    } else {
        info!("📝 Using default model (no model specified)");
    }

    match crate::service::convert_openai_messages(request.messages) {
        Ok(messages) => {
            let model = if request.model.is_empty() { None } else { Some(request.model.as_str()) };
            info!("🚀 Processing chat request with model: {:?}", model);

            if request.stream.unwrap_or(false) {
                info!("📡 Starting streaming response");
                match state.llm_service.chat_stream_with_model(model, messages.clone()).await {
                    Ok(rx) => {
                        info!("✅ Streaming response started successfully");
                        let stream = rx.map(|data| Ok::<Event, Infallible>(Event::default().data(data)));
                        Ok(Sse::new(stream).into_response())
                    }
                    Err(e) => {
                        warn!("⚠️ Streaming not supported by backend, falling back to non-streaming: {:?}", e);
                        // Fallback to non-streaming response for backends that don't support streaming
                        match state.llm_service.chat_with_model(model, messages).await {
                            Ok(response) => {
                                info!("✅ Fallback non-streaming chat completed successfully");
                                let ollama_response = convert_response_to_ollama(response);
                                Ok(Json(ollama_response).into_response())
                            }
                            Err(e) => {
                                error!("❌ Fallback chat request failed: {:?}", e);
                                Err(StatusCode::INTERNAL_SERVER_ERROR)
                            },
                        }
                    },
                }
            } else {
                info!("📝 Processing non-streaming chat request");
                match state.llm_service.chat_with_model(model, messages).await {
                    Ok(response) => {
                        info!("✅ Chat request completed successfully");
                        debug!("Response: {:?}", response);
                        let ollama_response = convert_response_to_ollama(response);
                        Ok(Json(ollama_response).into_response())
                    }
                    Err(e) => {
                        error!("❌ Chat request failed: {:?}", e);
                        Err(StatusCode::INTERNAL_SERVER_ERROR)
                    },
                }
            }
        }
        Err(e) => {
            error!("❌ Failed to convert messages: {:?}", e);
            Err(StatusCode::BAD_REQUEST)
        },
    }
}

pub async fn ollama_tags(
    headers: HeaderMap,
    State(state): State<AppState>,
    Query(params): Query<OllamaTagsParams>,
) -> Result<Json<OllamaModelResponse>, StatusCode> {
    info!("📋 Ollama tags request received");
    debug!("Headers: {:?}", headers);
    debug!("Query params: {:?}", params);

    enforce_api_key_for_ollama(&headers, &state)?;
    info!("✅ API key validation passed");

    match state.llm_service.models().await {
        Ok(models) => {
            info!("📦 Successfully retrieved {} models", models.len());
            debug!("Models: {:?}", models);
            Ok(Json(OllamaModelResponse { models }))
        },
        Err(e) => {
            error!("❌ Failed to retrieve models: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        },
    }
}

pub async fn ollama_show(
    headers: HeaderMap,
    State(state): State<AppState>,
    Json(request): Json<OllamaShowRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    info!("🔍 Ollama show request received for model: {}", request.name);
    debug!("Headers: {:?}", headers);
    debug!("Request body: {:?}", request);

    enforce_api_key_for_ollama(&headers, &state)?;
    info!("✅ API key validation passed");

    match state.llm_service.models().await {
        Ok(models) => {
            info!("🔎 Available models: {:?}", models.iter().map(|m| m["name"].as_str().unwrap_or("unknown")).collect::<Vec<_>>());
            if let Some(model) = models.iter().find(|m| m["name"].as_str() == Some(&request.name)) {
                info!("✅ Found model: {}", request.name);
                debug!("Model details: {:?}", model);
                Ok(Json(model.clone()))
            } else {
                warn!("❌ Model not found: {}", request.name);
                warn!("🔎 Available model names: {:?}", models.iter().map(|m| m["name"].as_str().unwrap_or("unknown")).collect::<Vec<_>>());
                Err(StatusCode::NOT_FOUND)
            }
        }
        Err(e) => {
            error!("❌ Failed to retrieve models: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}

// 简单的 API Key 校验：读取配置中的 header 名与 key
fn enforce_api_key_for_ollama(headers: &HeaderMap, state: &AppState) -> Result<(), StatusCode> {
    debug!("🔐 Checking API key authentication");

    if let Some(cfg) = &state.config.apis.ollama {
        if cfg.enabled {
            if let Some(expected_key) = cfg.api_key.as_ref() {
                let header_name = cfg.api_key_header.as_deref().unwrap_or("authorization").to_ascii_lowercase();
                debug!("🔍 Looking for API key in header: {}", header_name);

                let value_opt = if header_name == "authorization" {
                    headers.get(axum::http::header::AUTHORIZATION)
                } else {
                    match HeaderName::from_bytes(header_name.as_bytes()) {
                        Ok(name) => headers.get(name),
                        Err(_) => None,
                    }
                };

                let ok = if let Some(val) = value_opt {
                    debug!("🔑 API key header found, validating...");
                    if header_name == "authorization" {
                        match val.to_str() {
                            Ok(s) => {
                                let valid = s == format!("Bearer {}", expected_key) || s == expected_key;
                                debug!("🔐 Authorization header validation: {}", if valid { "✅ PASS" } else { "❌ FAIL" });
                                valid
                            },
                            Err(_) => {
                                debug!("❌ Failed to parse authorization header");
                                false
                            }
                        }
                    } else {
                        match val.to_str() {
                            Ok(s) => {
                                let valid = s == expected_key;
                                debug!("🔐 Custom header validation: {}", if valid { "✅ PASS" } else { "❌ FAIL" });
                                valid
                            },
                            Err(_) => {
                                debug!("❌ Failed to parse custom header");
                                false
                            }
                        }
                    }
                } else {
                    warn!("❌ API key header '{}' not found in request", header_name);
                    false
                };

                if !ok {
                    warn!("🚫 API key authentication failed");
                    return Err(StatusCode::UNAUTHORIZED);
                }

                info!("✅ API key authentication successful");
            } else {
                debug!("🔓 No API key configured, skipping authentication");
            }
        } else {
            debug!("🔓 Ollama API disabled, skipping authentication");
        }
    } else {
        debug!("🔓 No Ollama configuration found, skipping authentication");
    }
    Ok(())
}

// OpenAI API Handlers
#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct OpenAIChatRequest {
    pub model: String,
    pub messages: Vec<Value>,
    pub temperature: Option<f32>,
    pub max_tokens: Option<u32>,
    pub stream: Option<bool>,
}

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct OpenAIModelsParams {
    pub model: Option<String>,
}

pub async fn openai_chat(
    State(state): State<AppState>,
    Json(request): Json<OpenAIChatRequest>,
) -> Result<axum::response::Response, StatusCode> {
    // Validate model if provided
    if !request.model.is_empty() {
        match state.llm_service.validate_model(&request.model).await {
            Ok(false) => return Err(StatusCode::BAD_REQUEST),
            Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
            Ok(true) => {} // Model is valid, continue
        }
    }

    match crate::service::convert_openai_messages(request.messages) {
        Ok(messages) => {
            let model = if request.model.is_empty() { None } else { Some(request.model.as_str()) };

            if request.stream.unwrap_or(false) {
                match state.llm_service.chat_stream_with_model(model, messages).await {
                    Ok(rx) => {
                        let stream = rx.map(|data| Ok::<Event, Infallible>(Event::default().data(data)));
                        Ok(Sse::new(stream).into_response())
                    }
                    Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
                }
            } else {
                match state.llm_service.chat_with_model(model, messages).await {
                    Ok(response) => {
                        let openai_response = crate::service::convert_response_to_openai(response);
                        Ok(Json(openai_response).into_response())
                    }
                    Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
                }
            }
        }
        Err(_) => Err(StatusCode::BAD_REQUEST),
    }
}

pub async fn openai_models(
    State(state): State<AppState>,
    Query(_params): Query<OpenAIModelsParams>,
) -> Result<impl IntoResponse, StatusCode> {
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

// Anthropic API Handlers
#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct AnthropicMessageRequest {
    pub model: String,
    pub max_tokens: u32,
    pub messages: Vec<Value>,
    pub system: Option<String>,
    pub temperature: Option<f32>,
    pub stream: Option<bool>,
}

#[derive(Debug, Deserialize)]
#[allow(unused)]
pub struct AnthropicMessagesParams {
    pub model_id: Option<String>,
}

pub async fn anthropic_messages(
    State(state): State<AppState>,
    Json(request): Json<AnthropicMessageRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    // Validate model if provided
    if !request.model.is_empty() {
        match state.llm_service.validate_model(&request.model).await {
            Ok(false) => return Err(StatusCode::BAD_REQUEST),
            Err(_) => return Err(StatusCode::INTERNAL_SERVER_ERROR),
            Ok(true) => {} // Model is valid, continue
        }
    }

    let mut messages = match crate::service::convert_anthropic_messages(request.messages) {
        Ok(msgs) => msgs,
        Err(_) => return Err(StatusCode::BAD_REQUEST),
    };

    // Add system message if provided
    if let Some(system) = request.system {
        messages.insert(0, Message {
            role: Role::System,
            content: system,
        });
    }

    let model = if request.model.is_empty() { None } else { Some(request.model.as_str()) };

    match state.llm_service.chat_with_model(model, messages).await {
        Ok(response) => {
            let anthropic_response = crate::service::convert_response_to_anthropic(response);
            Ok(Json(anthropic_response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn anthropic_models(
    State(state): State<AppState>,
    Query(_params): Query<AnthropicMessagesParams>,
) -> Result<impl IntoResponse, StatusCode> {
    match state.llm_service.models().await {
        Ok(models) => {
            let anthropic_models: Vec<Value> = models.into_iter().map(|model| {
                json!({
                    "id": model["id"],
                    "display_name": model["id"],
                    "type": "model",
                    "created_at": chrono::Utc::now().to_rfc3339(),
                    "version": "1.0"
                })
            }).collect();

            let response = json!({
                "models": anthropic_models
            });
            Ok(Json(response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

// Health check handler
pub async fn health_check() -> impl IntoResponse {
    info!("🔍 Health check request received");
    Json(json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

// Simple test endpoint for debugging
pub async fn debug_test() -> impl IntoResponse {
    info!("🧪 Debug test endpoint accessed");
    Json(json!({
        "message": "LLM Link is running",
        "timestamp": chrono::Utc::now().to_rfc3339(),
        "endpoints": [
            "GET /health",
            "GET /debug",
            "GET /api/tags",
            "POST /api/chat",
            "POST /api/generate",
            "GET /api/show",
            "GET /api/version",
            "GET /api/ps"
        ]
    }))
}

// Ollama process status handler - shows running models (simulated)
pub async fn ollama_ps(
    headers: HeaderMap,
    State(state): State<AppState>,
) -> Result<impl IntoResponse, StatusCode> {
    info!("📊 Ollama ps request received");
    debug!("Headers: {:?}", headers);

    enforce_api_key_for_ollama(&headers, &state)?;
    info!("✅ API key validation passed");

    // Simulate a running model - return default model as "running"
    // This might help Zed.dev recognize that there's an active model
    match state.llm_service.models().await {
        Ok(models) => {
            if let Some(first_model) = models.first() {
                let model_name = first_model["name"].as_str().unwrap_or("glm-4.6");
                info!("🎯 Simulating running model: {}", model_name);

                let running_models = vec![json!({
                    "name": model_name,
                    "model": model_name,
                    "size": 0,
                    "digest": "",
                    "details": {
                        "parent_model": "",
                        "format": "gguf",
                        "family": model_name.split('-').next().unwrap_or("unknown"),
                        "parameter_size": "unknown",
                        "quantization_level": "unknown"
                    },
                    "expires_at": null,
                    "size_vram": 0,
                    "status": "running",
                    "process_id": "12345"
                })];

                Ok(Json(json!({
                    "models": running_models
                })))
            } else {
                // No models available, return empty list
                warn!("⚠️ No models available to show as running");
                Ok(Json(json!({
                    "models": []
                })))
            }
        }
        Err(e) => {
            error!("❌ Failed to retrieve models for ps: {:?}", e);
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        }
    }
}