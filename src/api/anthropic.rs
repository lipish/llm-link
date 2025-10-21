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
pub struct AnthropicMessagesRequest {
    pub model: String,
    pub messages: Vec<AnthropicMessage>,
    #[serde(default)]
    #[allow(dead_code)]
    pub max_tokens: Option<u32>,
    #[serde(default)]
    #[allow(dead_code)]
    pub temperature: Option<f32>,
    #[serde(default)]
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
pub struct AnthropicContent {
    #[serde(rename = "type")]
    pub type_: String,
    pub text: String,
}

#[derive(Debug, Serialize)]
pub struct AnthropicUsage {
    pub input_tokens: u32,
    pub output_tokens: u32,
}

/// Anthropic Messages API Handler
pub async fn messages(
    State(state): State<AppState>,
    Json(request): Json<AnthropicMessagesRequest>,
) -> Response {
    info!("📨 Anthropic Messages API request: client_model={}, stream={}", request.model, request.stream);
    info!("📋 Request details: messages_count={}, max_tokens={:?}, temperature={:?}",
          request.messages.len(), request.max_tokens, request.temperature);

    // Force streaming for Claude Code compatibility
    // Claude Code expects streaming responses but doesn't always set stream=true
    let force_streaming = true;
    if force_streaming && !request.stream {
        info!("🔄 Forcing streaming mode for Claude Code compatibility");
    }

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

    if request.stream || force_streaming {
        // Streaming response
        match state.llm_service.chat_stream_openai(Some(&request.model), llm_messages, None, llm_connector::StreamFormat::SSE).await {
            Ok(stream) => {
                info!("✅ Starting Anthropic streaming response");
                let anthropic_stream = convert_to_anthropic_stream(stream, request.model.clone());
                Sse::new(anthropic_stream).into_response()
            }
            Err(e) => {
                error!("❌ Streaming error: {}", e);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({
                        "error": {
                            "type": "api_error",
                            "message": e.to_string()
                        }
                    })),
                )
                    .into_response()
            }
        }
    } else {
        // Non-streaming response
        match state.llm_service.chat(Some(&request.model), llm_messages, None).await {
            Ok(response) => {
                info!("✅ Anthropic non-streaming response successful");

                let anthropic_response = AnthropicMessagesResponse {
                    id: uuid::Uuid::new_v4().to_string(),
                    type_: "message".to_string(),
                    role: "assistant".to_string(),
                    content: vec![AnthropicContent {
                        type_: "text".to_string(),
                        text: response.content.clone(),
                    }],
                    model: request.model,
                    stop_reason: Some("end_turn".to_string()),
                    usage: AnthropicUsage {
                        input_tokens: response.usage.prompt_tokens,
                        output_tokens: response.usage.completion_tokens,
                    },
                };

                Json(anthropic_response).into_response()
            }
            Err(e) => {
                error!("❌ Chat error: {}", e);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({
                        "error": {
                            "type": "api_error",
                            "message": e.to_string()
                        }
                    })),
                )
                    .into_response()
            }
        }
    }
}

/// Convert OpenAI stream to Anthropic SSE format
fn convert_to_anthropic_stream(
    stream: tokio_stream::wrappers::UnboundedReceiverStream<String>,
    _model: String,
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
pub async fn models() -> &'static str {
    "Not implemented"
}

