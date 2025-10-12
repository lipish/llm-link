use crate::config::LlmBackendConfig;
use crate::llm_connector::{LlmClient, LlmMessage, LlmResponse, LlmRole};
use anyhow::Result;
use serde_json::Value;

pub struct LlmService {
    client: LlmClient,
    model: String,
}

impl LlmService {
    pub fn from_config(config: &LlmBackendConfig) -> Result<Self> {
        let client = LlmClient::from_config(config)?;
        let model = match config {
            LlmBackendConfig::OpenAI { model, .. } => model.clone(),
            LlmBackendConfig::Anthropic { model, .. } => model.clone(),
            LlmBackendConfig::Ollama { model, .. } => model.clone(),
            LlmBackendConfig::Aliyun { model, .. } => model.clone(),
        };

        Ok(Self { client, model })
    }

    pub async fn chat_completion(&self, messages: Vec<LlmMessage>) -> Result<LlmResponse> {
        let response = self.client.chat_completion(&self.model, messages).await?;
        Ok(response)
    }

    // TODO: Implement streaming support
    // pub async fn chat_completion_stream(
    //     &self,
    //     messages: Vec<LlmMessage>,
    // ) -> Result<Pin<Box<dyn Stream<Item = Result<String>> + Send>>> {
    //     let stream = self.client.chat_completion_stream(&self.model, messages).await?;
    //     Ok(Box::pin(stream))
    // }

    pub async fn models(&self) -> Result<Vec<Value>> {
        // Get available models from the backend
        let models = self.client.models().await?;

        // Convert to JSON format
        let json_models: Vec<Value> = models.into_iter().map(|model| {
            serde_json::json!({
                "id": model.id,
                "object": "model",
                "created": model.created.unwrap_or_else(|| chrono::Utc::now().timestamp()),
                "owned_by": model.owned_by.unwrap_or_else(|| "llm-link".to_string()),
                "permission": [],
                "root": model.id,
                "parent": null
            })
        }).collect();

        Ok(json_models)
    }
}

// Helper functions for converting between different API formats
pub fn convert_openai_messages_to_llm(messages: Vec<Value>) -> Result<Vec<LlmMessage>> {
    let mut llm_messages = Vec::new();

    for msg in messages {
        let role = msg["role"].as_str().ok_or_else(|| anyhow::anyhow!("Missing role"))?;
        let content = msg["content"].as_str().ok_or_else(|| anyhow::anyhow!("Missing content"))?;

        let llm_role = match role {
            "system" => LlmRole::System,
            "user" => LlmRole::User,
            "assistant" => LlmRole::Assistant,
            _ => return Err(anyhow::anyhow!("Unsupported role: {}", role)),
        };

        llm_messages.push(LlmMessage {
            role: llm_role,
            content: content.to_string(),
        });
    }

    Ok(llm_messages)
}

pub fn convert_anthropic_messages_to_llm(messages: Vec<Value>) -> Result<Vec<LlmMessage>> {
    let mut llm_messages = Vec::new();

    for msg in messages {
        let role = msg["role"].as_str().ok_or_else(|| anyhow::anyhow!("Missing role"))?;
        let content = msg["content"].as_str().ok_or_else(|| anyhow::anyhow!("Missing content"))?;

        let llm_role = match role {
            "user" => LlmRole::User,
            "assistant" => LlmRole::Assistant,
            _ => return Err(anyhow::anyhow!("Unsupported role: {}", role)),
        };

        llm_messages.push(LlmMessage {
            role: llm_role,
            content: content.to_string(),
        });
    }

    Ok(llm_messages)
}

pub fn convert_llm_response_to_openai(response: LlmResponse) -> Value {
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

pub fn convert_llm_response_to_anthropic(response: LlmResponse) -> Value {
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

pub fn convert_llm_response_to_ollama(response: LlmResponse) -> Value {
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