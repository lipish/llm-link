use crate::config::LlmBackendConfig;
use crate::client::{Client, Message, Response, Role};
use anyhow::Result;
use serde_json::Value;
use tokio_stream::wrappers::UnboundedReceiverStream;
use llm_connector::StreamFormat;

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

    pub async fn chat_with_model(&self, model: Option<&str>, messages: Vec<Message>) -> Result<Response> {
        let model_to_use = model.unwrap_or(&self.model);
        let response = self.client.chat(model_to_use, messages).await?;
        Ok(response)
    }

    pub async fn chat_stream_with_model(&self, model: Option<&str>, messages: Vec<Message>) -> Result<UnboundedReceiverStream<String>> {
        let model_to_use = model.unwrap_or(&self.model);
        let stream = self.client.chat_stream(model_to_use, messages).await?;
        Ok(stream)
    }

    pub async fn chat_stream_with_format(&self, model: Option<&str>, messages: Vec<Message>, format: StreamFormat) -> Result<UnboundedReceiverStream<String>> {
        let model_to_use = model.unwrap_or(&self.model);
        let stream = self.client.chat_stream_with_format(model_to_use, messages, format).await?;
        Ok(stream)
    }

    pub async fn models(&self) -> Result<Vec<Value>> {
        // Get available models from the backend
        let models = self.client.list_models().await?;

        // Convert to Ollama native format
        let json_models: Vec<Value> = models.into_iter().map(|model| {
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
        }).collect();

        Ok(json_models)
    }

    pub async fn validate_model(&self, model: &str) -> Result<bool> {
        let available_models = self.client.list_models().await?;
        Ok(available_models.iter().any(|m| m.id == model))
    }
}

// Helper functions for converting between different API formats
pub fn convert_openai_messages(messages: Vec<Value>) -> Result<Vec<Message>> {
    let mut llm_messages = Vec::new();

    for msg in messages {
        let role = msg["role"].as_str().ok_or_else(|| anyhow::anyhow!("Missing role"))?;
        let content = msg["content"].as_str().ok_or_else(|| anyhow::anyhow!("Missing content"))?;

        let llm_role = match role {
            "system" => Role::System,
            "user" => Role::User,
            "assistant" => Role::Assistant,
            _ => return Err(anyhow::anyhow!("Unsupported role: {}", role)),
        };

        llm_messages.push(Message {
            role: llm_role,
            content: content.to_string(),
        });
    }

    Ok(llm_messages)
}

pub fn convert_anthropic_messages(messages: Vec<Value>) -> Result<Vec<Message>> {
    let mut llm_messages = Vec::new();

    for msg in messages {
        let role = msg["role"].as_str().ok_or_else(|| anyhow::anyhow!("Missing role"))?;
        let content = msg["content"].as_str().ok_or_else(|| anyhow::anyhow!("Missing content"))?;

        let llm_role = match role {
            "user" => Role::User,
            "assistant" => Role::Assistant,
            _ => return Err(anyhow::anyhow!("Unsupported role: {}", role)),
        };

        llm_messages.push(Message {
            role: llm_role,
            content: content.to_string(),
        });
    }

    Ok(llm_messages)
}

pub fn convert_response_to_openai(response: Response) -> Value {
    serde_json::json!({
        "id": uuid::Uuid::new_v4().to_string(),
        "object": "chat.completion",
        "created": chrono::Utc::now().timestamp(),
        "model": response.model,
        "choices": [{
            "index": 0,
            "message": {
                "role": "assistant",
                "content": response.content
            },
            "finish_reason": "stop"
        }],
        "usage": {
            "prompt_tokens": response.usage.prompt_tokens,
            "completion_tokens": response.usage.completion_tokens,
            "total_tokens": response.usage.total_tokens
        }
    })
}

pub fn convert_response_to_anthropic(response: Response) -> Value {
    serde_json::json!({
        "id": uuid::Uuid::new_v4().to_string(),
        "type": "message",
        "role": "assistant",
        "content": [{
            "type": "text",
            "text": response.content
        }],
        "model": response.model,
        "stop_reason": "end_turn",
        "stop_sequence": null,
        "usage": {
            "input_tokens": response.usage.prompt_tokens,
            "output_tokens": response.usage.completion_tokens
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