use crate::llm_service::{LlmService, convert_llm_response_to_ollama};
use crate::llm_connector::{LlmMessage, LlmRole};
use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::{IntoResponse, Json},
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::sync::Arc;

#[derive(Debug, Deserialize)]
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
pub struct OllamaChatRequest {
    pub model: String,
    pub messages: Vec<Value>,
    pub stream: Option<bool>,
    pub options: Option<Value>,
}

#[derive(Debug, Deserialize)]
pub struct OllamaTagsParams {
    pub name: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct OllamaModelResponse {
    pub models: Vec<Value>,
}

#[derive(Clone)]
pub struct AppState {
    pub llm_service: Arc<LlmService>,
}

// Ollama API Handlers
pub async fn ollama_generate(
    State(state): State<AppState>,
    Json(request): Json<OllamaGenerateRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    let messages = vec![
        LlmMessage {
            role: LlmRole::System,
            content: request.system.unwrap_or_default(),
        },
        LlmMessage {
            role: LlmRole::User,
            content: request.prompt,
        },
    ];

    match state.llm_service.chat_completion(messages).await {
        Ok(response) => {
            let ollama_response = convert_llm_response_to_ollama(response);
            Ok(Json(ollama_response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn ollama_chat(
    State(state): State<AppState>,
    Json(request): Json<OllamaChatRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    match crate::llm_service::convert_openai_messages_to_llm(request.messages) {
        Ok(messages) => {
            match state.llm_service.chat_completion(messages).await {
                Ok(response) => {
                    let ollama_response = convert_llm_response_to_ollama(response);
                    Ok(Json(ollama_response))
                }
                Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
            }
        }
        Err(_) => Err(StatusCode::BAD_REQUEST),
    }
}

pub async fn ollama_tags(
    State(state): State<AppState>,
    Query(_params): Query<OllamaTagsParams>,
) -> Result<Json<OllamaModelResponse>, StatusCode> {
    match state.llm_service.models().await {
        Ok(models) => Ok(Json(OllamaModelResponse { models })),
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

pub async fn ollama_show(
    State(state): State<AppState>,
    axum::extract::Path(name): axum::extract::Path<String>,
) -> Result<impl IntoResponse, StatusCode> {
    match state.llm_service.models().await {
        Ok(models) => {
            if let Some(model) = models.iter().find(|m| m["id"].as_str() == Some(&name)) {
                Ok(Json(model.clone()))
            } else {
                Err(StatusCode::NOT_FOUND)
            }
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

// OpenAI API Handlers
#[derive(Debug, Deserialize)]
pub struct OpenAIChatRequest {
    pub model: String,
    pub messages: Vec<Value>,
    pub temperature: Option<f32>,
    pub max_tokens: Option<u32>,
    pub stream: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct OpenAIModelsParams {
    pub model: Option<String>,
}

pub async fn openai_chat(
    State(state): State<AppState>,
    Json(request): Json<OpenAIChatRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    match crate::llm_service::convert_openai_messages_to_llm(request.messages) {
        Ok(messages) => {
            match state.llm_service.chat_completion(messages).await {
                Ok(response) => {
                    let openai_response = crate::llm_service::convert_llm_response_to_openai(response);
                    Ok(Json(openai_response))
                }
                Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
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
pub struct AnthropicMessageRequest {
    pub model: String,
    pub max_tokens: u32,
    pub messages: Vec<Value>,
    pub system: Option<String>,
    pub temperature: Option<f32>,
    pub stream: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct AnthropicMessagesParams {
    pub model_id: Option<String>,
}

pub async fn anthropic_messages(
    State(state): State<AppState>,
    Json(request): Json<AnthropicMessageRequest>,
) -> Result<impl IntoResponse, StatusCode> {
    let mut messages = match crate::llm_service::convert_anthropic_messages_to_llm(request.messages) {
        Ok(msgs) => msgs,
        Err(_) => return Err(StatusCode::BAD_REQUEST),
    };

    // Add system message if provided
    if let Some(system) = request.system {
        messages.insert(0, LlmMessage {
            role: LlmRole::System,
            content: system,
        });
    }

    match state.llm_service.chat_completion(messages).await {
        Ok(response) => {
            let anthropic_response = crate::llm_service::convert_llm_response_to_anthropic(response);
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
    Json(json!({
        "status": "healthy",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}