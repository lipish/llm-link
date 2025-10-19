use crate::client::{Client, Response};
use crate::config::LlmBackendConfig;
use anyhow::Result;
use llm_connector::types::{Function, Tool};
use llm_connector::StreamFormat;
use serde_json::Value;
use tokio_stream::wrappers::UnboundedReceiverStream;

pub struct Service {
    client: Client,
    model: String,
}

impl Service {
    pub fn from_config(config: &LlmBackendConfig) -> Result<Self> {
        let client = Client::from_config(config)?;
        let model = match config {
            LlmBackendConfig::OpenAI { model, .. } => model.clone(),
            LlmBackendConfig::Anthropic { model, .. } => model.clone(),
            LlmBackendConfig::Ollama { model, .. } => model.clone(),
            LlmBackendConfig::Aliyun { model, .. } => model.clone(),
            LlmBackendConfig::Zhipu { model, .. } => model.clone(),
        };

        Ok(Self { client, model })
    }

    pub async fn chat_with_model(
        &self,
        model: Option<&str>,
        messages: Vec<llm_connector::types::Message>,
        tools: Option<Vec<Tool>>,
    ) -> Result<Response> {
        let model_to_use = model.unwrap_or(&self.model);
        let response = self.client.chat(model_to_use, messages, tools).await?;
        Ok(response)
    }

    pub async fn chat_stream_with_format(
        &self,
        model: Option<&str>,
        messages: Vec<llm_connector::types::Message>,
        format: StreamFormat,
    ) -> Result<UnboundedReceiverStream<String>> {
        let model_to_use = model.unwrap_or(&self.model);
        let stream = self
            .client
            .chat_stream_with_format(model_to_use, messages, format)
            .await?;
        Ok(stream)
    }

    pub async fn chat_stream_openai(
        &self,
        model: Option<&str>,
        messages: Vec<llm_connector::types::Message>,
        tools: Option<Vec<Tool>>,
        format: StreamFormat,
    ) -> Result<UnboundedReceiverStream<String>> {
        let model_to_use = model.unwrap_or(&self.model);
        let stream = self
            .client
            .chat_stream_openai(model_to_use, messages, tools, format)
            .await?;
        Ok(stream)
    }

    pub async fn models(&self) -> Result<Vec<Value>> {
        // Get available models from the backend
        let models = self.client.list_models().await?;

        // Convert to Ollama native format
        let json_models: Vec<Value> = models
            .into_iter()
            .map(|model| {
                let family = model.id.split('-').next().unwrap_or("unknown");
                serde_json::json!({
                    "name": model.id,
                    "model": model.id,
                    "modified_at": chrono::Utc::now().to_rfc3339(),
                    "size": 1000000, // Provide a reasonable default size
                    "digest": format!("sha256:{}", "0".repeat(64)), // Provide a valid digest format
                    "details": {
                        "parent_model": "",
                        "format": "gguf",
                        "family": family,
                        "families": [family], // This is the critical missing field for Zed.dev
                        "parameter_size": "7B", // Provide a reasonable default
                        "quantization_level": "Q4_K_M" // Provide a reasonable default
                    },
                    "expires_at": null
                })
            })
            .collect();

        Ok(json_models)
    }

    pub async fn validate_model(&self, model: &str) -> Result<bool> {
        let available_models = self.client.list_models().await?;
        Ok(available_models.iter().any(|m| m.id == model))
    }
}

// Helper functions for converting between different API formats
pub fn convert_openai_messages(messages: Vec<Value>) -> Result<Vec<llm_connector::types::Message>> {
    use llm_connector::types::{Message as LlmMessage, Role as LlmRole};

    let mut llm_messages = Vec::new();

    for msg in messages {
        let role = msg["role"]
            .as_str()
            .ok_or_else(|| anyhow::anyhow!("Missing role"))?;

        // Determine the role
        let llm_role = match role {
            "system" => LlmRole::System,
            "user" => LlmRole::User,
            "assistant" => LlmRole::Assistant,
            "tool" => LlmRole::Tool,
            _ => return Err(anyhow::anyhow!("Unsupported role: {}", role)),
        };

        // Handle content (can be string, array, or null)
        let content = if msg["content"].is_null() {
            // Null content is allowed for assistant messages with tool_calls
            String::new()
        } else if let Some(content_str) = msg["content"].as_str() {
            // Simple string content
            content_str.to_string()
        } else if let Some(content_array) = msg["content"].as_array() {
            // Array content (e.g., from Codex with text and images)
            // Extract text parts and concatenate them
            let mut text_parts = Vec::new();
            for part in content_array {
                if let Some(text) = part["text"].as_str() {
                    text_parts.push(text);
                } else if let Some(text) = part.as_str() {
                    // Sometimes the array contains direct strings
                    text_parts.push(text);
                }
            }
            if text_parts.is_empty() {
                return Err(anyhow::anyhow!("Content array has no text parts"));
            }
            text_parts.join("\n")
        } else {
            return Err(anyhow::anyhow!(
                "Content must be string, array, or null, got: {:?}",
                msg["content"]
            ));
        };

        // Extract tool_calls if present (for assistant messages)
        let tool_calls = if role == "assistant" {
            msg.get("tool_calls")
                .and_then(|tc| serde_json::from_value(tc.clone()).ok())
        } else {
            None
        };

        // Extract tool_call_id if present (for tool messages)
        let tool_call_id = if role == "tool" {
            msg.get("tool_call_id")
                .and_then(|id| id.as_str())
                .map(|s| s.to_string())
        } else {
            None
        };

        llm_messages.push(LlmMessage {
            role: llm_role,
            content,
            name: None,
            tool_calls,
            tool_call_id,
            reasoning_content: None,
            reasoning: None,
            thought: None,
            thinking: None,
        });
    }

    Ok(llm_messages)
}

pub fn convert_response_to_openai(response: Response) -> Value {
    let mut message = serde_json::json!({
        "role": "assistant",
        "content": response.content
    });

    // Add tool_calls if present
    if let Some(tool_calls) = response.tool_calls {
        message["tool_calls"] = tool_calls;
    }

    serde_json::json!({
        "id": uuid::Uuid::new_v4().to_string(),
        "object": "chat.completion",
        "created": chrono::Utc::now().timestamp(),
        "model": response.model,
        "choices": [{
            "index": 0,
            "message": message,
            "finish_reason": "stop"
        }],
        "usage": {
            "prompt_tokens": response.usage.prompt_tokens,
            "completion_tokens": response.usage.completion_tokens,
            "total_tokens": response.usage.total_tokens
        }
    })
}

pub fn convert_response_to_ollama(response: Response) -> Value {
    serde_json::json!({
        "model": response.model,
        "created_at": chrono::Utc::now().to_rfc3339(),
        "message": {
            "role": "assistant",
            "content": response.content
        },
        "done": true,
        "total_duration": 0,
        "load_duration": 0,
        "prompt_eval_count": response.usage.prompt_tokens,
        "prompt_eval_duration": 0,
        "eval_count": response.usage.completion_tokens,
        "eval_duration": 0
    })
}

/// Convert OpenAI tools format to llm-connector format
pub fn convert_tools(tools: Vec<Value>) -> Vec<Tool> {
    tools
        .into_iter()
        .filter_map(|tool| {
            let tool_type = tool.get("type")?.as_str()?.to_string();
            let function = tool.get("function")?;

            Some(Tool {
                tool_type,
                function: Function {
                    name: function.get("name")?.as_str()?.to_string(),
                    description: function
                        .get("description")
                        .and_then(|d| d.as_str())
                        .map(String::from),
                    parameters: function.get("parameters")?.clone(),
                },
            })
        })
        .collect()
}
