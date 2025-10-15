use crate::config::LlmBackendConfig;
use anyhow::{anyhow, Result};
use tokio_stream::wrappers::UnboundedReceiverStream;
use llm_connector::{LlmClient, ChatRequest, Message as LlmMessage};
use futures_util::StreamExt;

/// Unified LLM client that wraps llm-connector for all providers
pub struct Client {
    backend: LlmBackendConfig,
    llm_client: LlmClient,
}

#[derive(Debug, Clone)]
pub enum Role {
    System,
    User,
    Assistant,
}

#[derive(Debug, Clone)]
pub struct Message {
    pub role: Role,
    pub content: String,
}

#[derive(Debug, Clone)]
pub struct Usage {
    pub prompt_tokens: u32,
    pub completion_tokens: u32,
    pub total_tokens: u32,
}

#[derive(Debug, Clone)]
pub struct Response {
    pub content: String,
    pub model: String,
    pub usage: Usage,
}

#[derive(Debug, Clone)]
pub struct Model {
    pub id: String,
    pub name: String,
    pub size: Option<u64>,
    pub digest: Option<String>,
    pub families: Option<Vec<String>>,
    pub created: Option<i64>,
    pub owned_by: Option<String>,
}

impl Client {
    /// Create a new client from configuration
    pub fn from_config(config: &LlmBackendConfig) -> Result<Self> {
        let llm_client = match config {
            LlmBackendConfig::OpenAI { api_key, base_url, .. } => {
                // Use 30 second timeout for better reliability
                LlmClient::openai_with_timeout(api_key, base_url.as_deref(), 30000)
            }
            LlmBackendConfig::Anthropic { api_key, .. } => {
                // Use 30 second timeout for better reliability
                LlmClient::anthropic_with_timeout(api_key, 30000)
            }
            LlmBackendConfig::Aliyun { api_key, .. } => {
                LlmClient::aliyun(api_key)
            }
            LlmBackendConfig::Zhipu { api_key, .. } => {
                // Use 30 second timeout for better reliability - this should fix the hanging issue
                LlmClient::zhipu_with_timeout(api_key, 30000)
            }
            LlmBackendConfig::Ollama { base_url, .. } => {
                LlmClient::ollama(base_url.as_deref())
            }
        };

        Ok(Self {
            backend: config.clone(),
            llm_client,
        })
    }

    /// Send a chat request to the LLM
    pub async fn chat(&self, model: &str, messages: Vec<Message>) -> Result<Response> {
        // Convert messages to llm-connector format
        let chat_messages: Vec<LlmMessage> = messages.into_iter().map(|msg| {
            match msg.role {
                Role::System => LlmMessage::system(&msg.content),
                Role::User => LlmMessage::user(&msg.content),
                Role::Assistant => LlmMessage::assistant(&msg.content),
            }
        }).collect();

        let request = ChatRequest {
            model: model.to_string(),
            messages: chat_messages,
            ..Default::default()
        };

        let response = self.llm_client.chat(&request).await
            .map_err(|e| anyhow!("LLM connector error: {}", e))?;

        // Extract content and usage information
        let content = response.get_content().unwrap_or("").to_string();
        let (prompt_tokens, completion_tokens, total_tokens) = response.get_usage_safe();

        Ok(Response {
            content,
            model: response.model,
            usage: Usage {
                prompt_tokens,
                completion_tokens,
                total_tokens,
            },
        })
    }

    /// Send a streaming chat request to the LLM
    pub async fn chat_stream(&self, model: &str, messages: Vec<Message>) -> Result<UnboundedReceiverStream<String>> {
        // Convert messages to llm-connector format
        let chat_messages: Vec<LlmMessage> = messages.into_iter().map(|msg| {
            match msg.role {
                Role::System => LlmMessage::system(&msg.content),
                Role::User => LlmMessage::user(&msg.content),
                Role::Assistant => LlmMessage::assistant(&msg.content),
            }
        }).collect();

        let mut request = ChatRequest {
            model: model.to_string(),
            messages: chat_messages,
            ..Default::default()
        };
        request.stream = Some(true);

        // 🎉 使用新的 chat_stream_ollama 方法！
        let stream = self.llm_client.chat_stream_ollama(&request).await
            .map_err(|e| anyhow!("LLM connector Ollama streaming error: {}", e))?;

        // 🎉 v0.3.12: chat_stream_ollama 现在直接返回纯 Ollama 格式！
        let (tx, rx) = tokio::sync::mpsc::unbounded_channel();

        tokio::spawn(async move {
            let mut stream = stream;
            while let Some(chunk) = stream.next().await {
                match chunk {
                    Ok(ollama_chunk) => {
                        // 直接序列化 OllamaStreamChunk 对象
                        if let Ok(json_str) = serde_json::to_string(&ollama_chunk) {
                            let _ = tx.send(json_str);
                        }

                        // 检查是否完成
                        if ollama_chunk.done {
                            break;
                        }
                    }
                    Err(_) => break,
                }
            }
        });

        Ok(UnboundedReceiverStream::new(rx))
    }

    /// List available models
    pub async fn list_models(&self) -> Result<Vec<Model>> {
        // For now, return static model lists based on backend type
        // TODO: Use llm-connector's list_models when available
        match &self.backend {
            LlmBackendConfig::Ollama { .. } => {
                Ok(vec![
                    Model {
                        id: "llama2".to_string(),
                        name: "llama2".to_string(),
                        size: Some(3800000000),
                        digest: Some("sha256:0000000000000000000000000000000000000000000000000000000000000000".to_string()),
                        families: Some(vec!["llama".to_string()]),
                        created: Some(chrono::Utc::now().timestamp()),
                        owned_by: Some("ollama".to_string()),
                    }
                ])
            }
            LlmBackendConfig::OpenAI { .. } => {
                Ok(vec![Model {
                    id: "gpt-3.5-turbo".to_string(),
                    name: "gpt-3.5-turbo".to_string(),
                    size: None,
                    digest: None,
                    families: Some(vec!["openai".to_string()]),
                    created: None,
                    owned_by: Some("openai".to_string()),
                }])
            }
            LlmBackendConfig::Anthropic { model, .. } => {
                Ok(vec![Model {
                    id: model.clone(),
                    name: model.clone(),
                    size: None,
                    digest: None,
                    families: Some(vec!["anthropic".to_string()]),
                    created: None,
                    owned_by: Some("anthropic".to_string()),
                }])
            }
            LlmBackendConfig::Aliyun { model, .. } => {
                Ok(vec![Model {
                    id: model.clone(),
                    name: model.clone(),
                    size: None,
                    digest: None,
                    families: Some(vec!["aliyun".to_string()]),
                    created: None,
                    owned_by: Some("aliyun".to_string()),
                }])
            }
            LlmBackendConfig::Zhipu { .. } => {
                let models = vec![
                    "glm-4", "glm-4.6", "glm-4-plus", "glm-4-flash", "glm-4-air", "glm-4-long"
                ];
                Ok(models.into_iter().map(|name| Model {
                    id: name.to_string(),
                    name: name.to_string(),
                    size: None,
                    digest: None,
                    families: Some(vec!["zhipu".to_string()]),
                    created: None,
                    owned_by: Some("zhipu".to_string()),
                }).collect())
            }
        }
    }
}
