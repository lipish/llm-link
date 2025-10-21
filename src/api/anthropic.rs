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

use crate::api::{convert, AppState};

/// Anthropic Messages API Request
#[derive(Debug, Deserialize)]
pub struct AnthropicMessagesRequest {
    pub model: String,
    pub messages: Vec<AnthropicMessage>,
    #[serde(default)]
    pub max_tokens: Option<u32>,
    #[serde(default)]
    pub temperature: Option<f32>,
    #[serde(default)]
    pub stream: bool,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct AnthropicMessage {
    pub role: String,
    #[serde(deserialize_with = "deserialize_content")]
    pub content: String,
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
    source: Option<serde_json::Value>,
}

/// Custom deserializer for content field
fn deserialize_content<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let content = AnthropicContentInput::deserialize(deserializer)?;
    match content {
        AnthropicContentInput::String(s) => Ok(s),
        AnthropicContentInput::Array(blocks) => {
            // Extract text from all text blocks and concatenate
            let text_parts: Vec<String> = blocks
                .into_iter()
                .filter_map(|block| {
                    if block.type_ == "text" {
                        block.text
                    } else {
                        None
                    }
                })
                .collect();
            Ok(text_parts.join("\n"))
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
    info!("💡 Using configured backend model (ignoring client model name)");
    info!("💡 Note: Ignoring client model name, using configured backend model");

    // Convert Anthropic messages to OpenAI format (JSON)
    let openai_messages_json: Vec<serde_json::Value> = request
        .messages
        .iter()
        .map(|msg| {
            json!({
                "role": msg.role,
                "content": msg.content
            })
        })
        .collect();

    // Convert to llm-connector format
    let llm_messages = match convert::openai_messages_to_llm(openai_messages_json) {
        Ok(msgs) => msgs,
        Err(e) => {
            error!("❌ Failed to convert messages: {}", e);
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({
                    "error": {
                        "type": "invalid_request_error",
                        "message": format!("Invalid messages format: {}", e)
                    }
                })),
            )
                .into_response();
        }
    };

    if request.stream {
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

