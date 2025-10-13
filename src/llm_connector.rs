use crate::config::LlmBackendConfig;
use anyhow::{anyhow, Result};
use serde_json::Value;
use std::collections::HashMap;

pub struct LlmClient {
    backend: LlmBackendConfig,
    client: reqwest::Client,
}

#[derive(Debug, Clone)]
pub struct LlmMessage {
    pub role: LlmRole,
    pub content: String,
}

#[derive(Debug, Clone)]
pub enum LlmRole {
    System,
    User,
    Assistant,
}

#[derive(Debug)]
pub struct LlmResponse {
    pub content: String,
    pub model: String,
    pub usage: LlmUsage,
}

#[derive(Debug)]
pub struct LlmUsage {
    pub prompt_tokens: u32,
    pub completion_tokens: u32,
    pub total_tokens: u32,
}

#[derive(Debug)]
pub struct LlmModel {
    pub id: String,
    pub created: Option<i64>,
    pub owned_by: Option<String>,
}

impl LlmClient {
    pub fn from_config(config: &LlmBackendConfig) -> Result<Self> {
        Ok(Self {
            backend: config.clone(),
            client: reqwest::Client::new(),
        })
    }

    pub async fn chat_completion(&self, model: &str, messages: Vec<LlmMessage>) -> Result<LlmResponse> {
        match &self.backend {
            LlmBackendConfig::OpenAI { api_key, base_url, model: _ } => {
                self.openai_chat_completion(api_key, base_url.as_deref(), model, messages).await
            }
            LlmBackendConfig::Anthropic { api_key, model: _ } => {
                self.anthropic_chat_completion(api_key, model, messages).await
            }
            LlmBackendConfig::Ollama { base_url, model: _ } => {
                self.ollama_chat_completion(base_url.as_deref(), model, messages).await
            }
            LlmBackendConfig::Aliyun { api_key, model: _ } => {
                self.aliyun_chat_completion(api_key, model, messages).await
            }
        }
    }

    async fn openai_chat_completion(
        &self,
        api_key: &str,
        base_url: Option<&str>,
        model: &str,
        messages: Vec<LlmMessage>,
    ) -> Result<LlmResponse> {
        let url = format!(
            "{}/chat/completions",
            base_url.unwrap_or("https://api.openai.com/v1")
        );

        let openai_messages: Vec<Value> = messages
            .into_iter()
            .map(|msg| {
                let role = match msg.role {
                    LlmRole::System => "system",
                    LlmRole::User => "user",
                    LlmRole::Assistant => "assistant",
                };
                serde_json::json!({
                    "role": role,
                    "content": msg.content
                })
            })
            .collect();

        let request_body = serde_json::json!({
            "model": model,
            "messages": openai_messages
        });

        let response = self
            .client
            .post(&url)
            .header("Authorization", format!("Bearer {}", api_key))
            .header("Content-Type", "application/json")
            .json(&request_body)
            .send()
            .await?;

        if !response.status().is_success() {
            return Err(anyhow!("OpenAI API error: {}", response.status()));
        }

        let response_json: Value = response.json().await?;
        let content = response_json["choices"][0]["message"]["content"]
            .as_str()
            .ok_or_else(|| anyhow!("Missing content in OpenAI response"))?
            .to_string();

        let usage = response_json["usage"].clone();
        let usage = LlmUsage {
            prompt_tokens: usage["prompt_tokens"].as_u64().unwrap_or(0) as u32,
            completion_tokens: usage["completion_tokens"].as_u64().unwrap_or(0) as u32,
            total_tokens: usage["total_tokens"].as_u64().unwrap_or(0) as u32,
        };

        Ok(LlmResponse {
            content,
            model: response_json["model"].as_str().unwrap_or(model).to_string(),
            usage,
        })
    }

    async fn anthropic_chat_completion(
        &self,
        api_key: &str,
        model: &str,
        mut messages: Vec<LlmMessage>,
    ) -> Result<LlmResponse> {
        let url = "https://api.anthropic.com/v1/messages";

        // Extract system message if present
        let system_message = messages
            .iter()
            .position(|msg| matches!(msg.role, LlmRole::System))
            .map(|i| messages.remove(i).content);

        let anthropic_messages: Vec<Value> = messages
            .into_iter()
            .map(|msg| {
                let role = match msg.role {
                    LlmRole::User => "user",
                    LlmRole::Assistant => "assistant",
                    _ => "user", // Anthropic doesn't support system messages in the main array
                };
                serde_json::json!({
                    "role": role,
                    "content": msg.content
                })
            })
            .collect();

        let mut request_body = serde_json::json!({
            "model": model,
            "max_tokens": 4096,
            "messages": anthropic_messages
        });

        if let Some(system) = system_message {
            request_body["system"] = serde_json::Value::String(system);
        }

        let response = self
            .client
            .post(url)
            .header("x-api-key", api_key)
            .header("anthropic-version", "2023-06-01")
            .header("Content-Type", "application/json")
            .json(&request_body)
            .send()
            .await?;

        if !response.status().is_success() {
            return Err(anyhow!("Anthropic API error: {}", response.status()));
        }

        let response_json: Value = response.json().await?;
        let content = response_json["content"][0]["text"]
            .as_str()
            .ok_or_else(|| anyhow!("Missing content in Anthropic response"))?
            .to_string();

        let usage = response_json["usage"].clone();
        let usage = LlmUsage {
            prompt_tokens: usage["input_tokens"].as_u64().unwrap_or(0) as u32,
            completion_tokens: usage["output_tokens"].as_u64().unwrap_or(0) as u32,
            total_tokens: (usage["input_tokens"].as_u64().unwrap_or(0) + usage["output_tokens"].as_u64().unwrap_or(0)) as u32,
        };

        Ok(LlmResponse {
            content,
            model: response_json["model"].as_str().unwrap_or(model).to_string(),
            usage,
        })
    }

    async fn ollama_chat_completion(
        &self,
        base_url: Option<&str>,
        model: &str,
        messages: Vec<LlmMessage>,
    ) -> Result<LlmResponse> {
        let url = format!(
            "{}/api/chat",
            base_url.unwrap_or("http://localhost:11434")
        );

        let ollama_messages: Vec<Value> = messages
            .into_iter()
            .map(|msg| {
                let role = match msg.role {
                    LlmRole::System => "system",
                    LlmRole::User => "user",
                    LlmRole::Assistant => "assistant",
                };
                serde_json::json!({
                    "role": role,
                    "content": msg.content
                })
            })
            .collect();

        let request_body = serde_json::json!({
            "model": model,
            "messages": ollama_messages,
            "stream": false
        });

        let response = self
            .client
            .post(&url)
            .header("Content-Type", "application/json")
            .json(&request_body)
            .send()
            .await?;

        if !response.status().is_success() {
            return Err(anyhow!("Ollama API error: {}", response.status()));
        }

        let response_json: Value = response.json().await?;
        let content = response_json["message"]["content"]
            .as_str()
            .ok_or_else(|| anyhow!("Missing content in Ollama response"))?
            .to_string();

        // Ollama doesn't provide detailed token usage, so we'll estimate
        let usage = LlmUsage {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
        };

        Ok(LlmResponse {
            content,
            model: response_json["model"].as_str().unwrap_or(model).to_string(),
            usage,
        })
    }

    async fn aliyun_chat_completion(
        &self,
        api_key: &str,
        model: &str,
        messages: Vec<LlmMessage>,
    ) -> Result<LlmResponse> {
        // Aliyun Wanxiang API - uses OpenAI-compatible format with GLM models
        let url = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

        let aliyun_messages: Vec<Value> = messages
            .into_iter()
            .map(|msg| {
                let role = match msg.role {
                    LlmRole::System => "system",
                    LlmRole::User => "user",
                    LlmRole::Assistant => "assistant",
                };
                serde_json::json!({
                    "role": role,
                    "content": msg.content
                })
            })
            .collect();

        let request_body = serde_json::json!({
            "model": model,
            "messages": aliyun_messages
        });

        let response = self
            .client
            .post(url)
            .header("Authorization", format!("Bearer {}", api_key))
            .header("Content-Type", "application/json")
            .json(&request_body)
            .send()
            .await?;

        if !response.status().is_success() {
            return Err(anyhow!("Aliyun Wanxiang API error: {}", response.status()));
        }

        let response_json: Value = response.json().await?;
        let content = response_json["choices"][0]["message"]["content"]
            .as_str()
            .ok_or_else(|| anyhow!("Missing content in Aliyun Wanxiang response"))?
            .to_string();

        let usage = response_json["usage"].clone();
        let usage = LlmUsage {
            prompt_tokens: usage["prompt_tokens"].as_u64().unwrap_or(0) as u32,
            completion_tokens: usage["completion_tokens"].as_u64().unwrap_or(0) as u32,
            total_tokens: usage["total_tokens"].as_u64().unwrap_or(0) as u32,
        };

        Ok(LlmResponse {
            content,
            model: response_json["model"].as_str().unwrap_or(model).to_string(),
            usage,
        })
    }

    pub async fn models(&self) -> Result<Vec<LlmModel>> {
        match &self.backend {
            LlmBackendConfig::OpenAI { api_key, base_url, .. } => {
                self.openai_models(api_key, base_url.as_deref()).await
            }
            LlmBackendConfig::Anthropic { .. } => {
                // Anthropic doesn't have a public models endpoint, return some defaults
                Ok(vec![
                    LlmModel {
                        id: "claude-3-sonnet-20240229".to_string(),
                        created: Some(chrono::Utc::now().timestamp()),
                        owned_by: Some("anthropic".to_string()),
                    },
                    LlmModel {
                        id: "claude-3-haiku-20240307".to_string(),
                        created: Some(chrono::Utc::now().timestamp()),
                        owned_by: Some("anthropic".to_string()),
                    },
                ])
            }
            LlmBackendConfig::Ollama { base_url, .. } => {
                self.ollama_models(base_url.as_deref()).await
            }
            LlmBackendConfig::Aliyun { .. } => {
                // Aliyun Wanxiang GLM models (OpenAI-compatible)
                Ok(vec![
                    LlmModel {
                        id: "glm-4.6".to_string(),
                        created: Some(chrono::Utc::now().timestamp()),
                        owned_by: Some("aliyun-wanxiang".to_string()),
                    },
                    LlmModel {
                        id: "glm-4".to_string(),
                        created: Some(chrono::Utc::now().timestamp()),
                        owned_by: Some("aliyun-wanxiang".to_string()),
                    },
                    LlmModel {
                        id: "glm-4-plus".to_string(),
                        created: Some(chrono::Utc::now().timestamp()),
                        owned_by: Some("aliyun-wanxiang".to_string()),
                    },
                    LlmModel {
                        id: "glm-4-flash".to_string(),
                        created: Some(chrono::Utc::now().timestamp()),
                        owned_by: Some("aliyun-wanxiang".to_string()),
                    },
                    LlmModel {
                        id: "glm-4-air".to_string(),
                        created: Some(chrono::Utc::now().timestamp()),
                        owned_by: Some("aliyun-wanxiang".to_string()),
                    },
                    LlmModel {
                        id: "glm-4-long".to_string(),
                        created: Some(chrono::Utc::now().timestamp()),
                        owned_by: Some("aliyun-wanxiang".to_string()),
                    },
                ])
            }
        }
    }

    async fn openai_models(&self, api_key: &str, base_url: Option<&str>) -> Result<Vec<LlmModel>> {
        let url = format!("{}/models", base_url.unwrap_or("https://api.openai.com/v1"));

        let response = self
            .client
            .get(&url)
            .header("Authorization", format!("Bearer {}", api_key))
            .send()
            .await?;

        if !response.status().is_success() {
            return Err(anyhow!("OpenAI models API error: {}", response.status()));
        }

        let response_json: Value = response.json().await?;
        let models = response_json["data"]
            .as_array()
            .ok_or_else(|| anyhow!("Invalid models response"))?
            .iter()
            .map(|model| LlmModel {
                id: model["id"].as_str().unwrap_or("unknown").to_string(),
                created: model["created"].as_i64(),
                owned_by: model["owned_by"].as_str().map(|s| s.to_string()),
            })
            .collect();

        Ok(models)
    }

    async fn ollama_models(&self, base_url: Option<&str>) -> Result<Vec<LlmModel>> {
        let url = format!("{}/api/tags", base_url.unwrap_or("http://localhost:11434"));

        let response = self.client.get(&url).send().await?;

        if !response.status().is_success() {
            return Err(anyhow!("Ollama models API error: {}", response.status()));
        }

        let response_json: Value = response.json().await?;
        let models = response_json["models"]
            .as_array()
            .ok_or_else(|| anyhow!("Invalid models response"))?
            .iter()
            .map(|model| LlmModel {
                id: model["name"].as_str().unwrap_or("unknown").to_string(),
                created: model["modified_at"].as_str().and_then(|s| {
                    chrono::DateTime::parse_from_rfc3339(s)
                        .ok()
                        .map(|dt| dt.timestamp())
                }),
                owned_by: Some("ollama".to_string()),
            })
            .collect();

        Ok(models)
    }
}