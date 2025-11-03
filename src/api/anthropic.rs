use axum::{
    extract::State,
    http::StatusCode,
    response::{IntoResponse, Response, Sse},
    Json,
};
use futures_util::stream::Stream;
use serde::{Deserialize, Serialize};
use serde_json::json;
use tracing::{error, info};

use crate::api::AppState;
use llm_connector::types::{ImageSource, Message as LlmMessage, MessageBlock, Role as LlmRole};

/// Anthropic Messages API Request
#[derive(Debug, Deserialize)]
#[allow(dead_code)]
pub struct AnthropicMessagesRequest {
    #[allow(dead_code)]
    pub model: String,
    #[allow(dead_code)]
    pub messages: Vec<AnthropicMessage>,
    #[serde(default)]
    #[allow(dead_code)]
    pub max_tokens: Option<u32>,
    #[serde(default)]
    #[allow(dead_code)]
    pub temperature: Option<f32>,
    #[serde(default)]
    #[allow(dead_code)]
    pub stream: bool,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct AnthropicMessage {
    pub role: String,
    #[serde(deserialize_with = "deserialize_content")]
    pub content: Vec<MessageBlock>,
}

/// Anthropic content can be either a string or an array of content blocks
#[derive(Debug, Deserialize)]
#[serde(untagged)]
enum AnthropicContentInput {
    String(String),
    Array(Vec<AnthropicContentBlock>),
}

#[derive(Debug, Deserialize)]
struct AnthropicContentBlock {
    #[serde(rename = "type")]
    type_: String,
    #[serde(default)]
    text: Option<String>,
    #[serde(default)]
    source: Option<AnthropicImageSource>,
}

#[derive(Debug, Deserialize)]
struct AnthropicImageSource {
    #[serde(rename = "type")]
    #[allow(dead_code)]
    type_: String,
    media_type: String,
    data: String,
}

/// Custom deserializer for content field
/// Converts Anthropic format to llm-connector MessageBlock format
fn deserialize_content<'de, D>(deserializer: D) -> Result<Vec<MessageBlock>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let content = AnthropicContentInput::deserialize(deserializer)?;
    match content {
        AnthropicContentInput::String(s) => {
            // Simple string → single text block
            Ok(vec![MessageBlock::Text { text: s }])
        }
        AnthropicContentInput::Array(blocks) => {
            // Array of blocks → convert each block
            let message_blocks: Vec<MessageBlock> = blocks
                .into_iter()
                .filter_map(|block| match block.type_.as_str() {
                    "text" => block.text.map(|text| MessageBlock::Text { text }),
                    "image" => block.source.map(|source| MessageBlock::Image {
                        source: ImageSource::Base64 {
                            media_type: source.media_type,
                            data: source.data,
                        },
                    }),
                    _ => {
                        tracing::warn!("⚠️ Unsupported content block type: {}", block.type_);
                        None
                    }
                })
                .collect();

            if message_blocks.is_empty() {
                Ok(vec![MessageBlock::Text {
                    text: String::new(),
                }])
            } else {
                Ok(message_blocks)
            }
        }
    }
}

/// Anthropic Messages API Response
#[derive(Debug, Serialize)]
#[allow(dead_code)]
pub struct AnthropicMessagesResponse {
    pub id: String,
    #[serde(rename = "type")]
    pub type_: String,
    pub role: String,
    pub content: Vec<AnthropicContent>,
    pub model: String,
    pub stop_reason: Option<String>,
    pub usage: AnthropicUsage,
}

#[derive(Debug, Serialize)]
#[allow(dead_code)]
pub struct AnthropicContent {
    #[serde(rename = "type")]
    pub type_: String,
    pub text: String,
}

#[derive(Debug, Serialize)]
#[allow(dead_code)]
pub struct AnthropicUsage {
    pub input_tokens: u32,
    pub output_tokens: u32,
}

/// Anthropic Messages API Handler
#[allow(dead_code)]
pub async fn messages(
    State(state): State<AppState>,
    headers: axum::http::HeaderMap,
    Json(mut request): Json<AnthropicMessagesRequest>,
) -> Result<Response, StatusCode> {
    info!("📨 Anthropic Messages API request: client_model={}, stream={}", request.model, request.stream);
    info!("📋 Request details: messages_count={}, max_tokens={:?}, temperature={:?}",
          request.messages.len(), request.max_tokens, request.temperature);

    // Check if client expects streaming via Accept header
    // Some clients (like Claude Code) may indicate streaming preference via headers
    let accept_header = headers.get("accept").and_then(|v| v.to_str().ok());
    let expects_sse = accept_header
        .map(|a| a.contains("text/event-stream"))
        .unwrap_or(false);

    if expects_sse && !request.stream {
        info!("🔄 Client expects SSE (Accept: text/event-stream), enabling streaming");
        request.stream = true;
    }

    info!("📋 Final streaming mode: {}", request.stream);

    // Convert Anthropic messages to llm-connector format
    let llm_messages: Vec<LlmMessage> = request
        .messages
        .into_iter()
        .map(|msg| {
            let role = match msg.role.as_str() {
                "user" => LlmRole::User,
                "assistant" => LlmRole::Assistant,
                "system" => LlmRole::System,
                _ => LlmRole::User, // Default to user
            };

            LlmMessage {
                role,
                content: msg.content,
                name: None,
                tool_calls: None,
                tool_call_id: None,
                reasoning_content: None,
                reasoning: None,
                thought: None,
                thinking: None,
            }
        })
        .collect();

    if request.stream {
        // Streaming response
        let llm_service = state.llm_service.read()
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let stream_result = llm_service.chat_stream_openai(Some(&request.model), llm_messages, None, llm_connector::StreamFormat::SSE).await;

        match stream_result {
            Ok(stream) => {
                info!("✅ Starting Anthropic streaming response");
                let anthropic_stream = convert_to_anthropic_stream(stream, &request.model);
                Ok(Sse::new(anthropic_stream).into_response())
            }
            Err(e) => {
                error!("❌ Streaming error: {}", e);
                Err(StatusCode::INTERNAL_SERVER_ERROR)
            }
        }
    } else {
        // Non-streaming response
        let llm_service = state.llm_service.read()
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
        let chat_result = llm_service.chat(Some(&request.model), llm_messages, None).await;

        match chat_result {
            Ok(response) => {
                info!("✅ Anthropic non-streaming response successful");

                let anthropic_response = AnthropicMessagesResponse {
                    id: uuid::Uuid::new_v4().to_string(),
                    type_: "message".to_string(),
                    role: "assistant".to_string(),
                    content: vec![AnthropicContent {
                        type_: "text".to_string(),
                        text: response.content,
                    }],
                    model: request.model,
                    stop_reason: Some("end_turn".to_string()),
                    usage: AnthropicUsage {
                        input_tokens: response.usage.prompt_tokens,
                        output_tokens: response.usage.completion_tokens,
                    },
                };

                Ok(Json(anthropic_response).into_response())
            }
            Err(e) => {
                error!("❌ Chat error: {}", e);
                Err(StatusCode::INTERNAL_SERVER_ERROR)
            }
        }
    }
}

/// Convert OpenAI stream to Anthropic SSE format
#[allow(dead_code)]
fn convert_to_anthropic_stream(
    stream: tokio_stream::wrappers::UnboundedReceiverStream<String>,
    _model: &str,
) -> impl Stream<Item = Result<axum::response::sse::Event, std::convert::Infallible>> {
    use futures_util::StreamExt;

    stream.map(move |data| {
        // Parse the SSE data
        let json_str = if data.starts_with("data: ") {
            &data[6..]
        } else {
            &data
        };

        // Skip empty lines and [DONE] markers
        if json_str.trim().is_empty() || json_str.trim() == "[DONE]" {
            return Ok(axum::response::sse::Event::default().data(""));
        }

        // Try to parse as OpenAI chunk
        if let Ok(chunk) = serde_json::from_str::<serde_json::Value>(json_str) {
            if let Some(content) = chunk["choices"][0]["delta"]["content"].as_str() {
                let event = json!({
                    "type": "content_block_delta",
                    "delta": {
                        "type": "text_delta",
                        "text": content
                    }
                });
                return Ok(axum::response::sse::Event::default()
                    .event("message")
                    .data(event.to_string()));
            }
        }

        // If parsing fails, return empty event
        Ok(axum::response::sse::Event::default().data(""))
    })
}

/// Anthropic Models API (占位符)
///
/// 用于列出可用的 Anthropic 模型
#[allow(dead_code)]
pub async fn models(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let llm_service = state.llm_service.read()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let models_result = llm_service.list_models().await;

    match models_result {
        Ok(models) => {
            let anthropic_models: Vec<serde_json::Value> = models.into_iter().map(|model| {
                json!({
                    "id": model.id,
                    "type": "model",
                    "display_name": model.id,
                    "created_at": chrono::Utc::now().to_rfc3339(),
                })
            }).collect();

            let config = state.config.read()
                .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
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
                "data": anthropic_models,
                "provider": current_provider,
            });
            Ok(Json(response))
        }
        Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}

