use crate::config::LlmBackendConfig;
use anyhow::{anyhow, Result};
use tokio_stream::wrappers::UnboundedReceiverStream;
use llm_connector::{LlmClient, ChatRequest, Message as LlmMessage, StreamFormat, StreamingConfig, StreamingFormat};
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

    /// Send a streaming chat request to the LLM with specified format
    pub async fn chat_stream_with_format(&self, model: &str, messages: Vec<Message>, format: StreamFormat) -> Result<UnboundedReceiverStream<String>> {
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
            stream: Some(true),
            ..Default::default()
        };

        let config = StreamingConfig {
            format: StreamingFormat::Ollama,  // 🎯 恢复 Ollama 格式用于 Ollama API
            stream_format: format,
            include_usage: true,
            include_reasoning: false,
        };

        // 🎉 使用新的 chat_stream_universal 方法！
        let stream = self.llm_client.chat_stream_universal(&request, &config).await
            .map_err(|e| anyhow!("LLM connector universal streaming error: {}", e))?;

        let (tx, rx) = tokio::sync::mpsc::unbounded_channel();

        tokio::spawn(async move {
            let mut stream = stream;
            while let Some(chunk) = stream.next().await {
                match chunk {
                    Ok(stream_chunk) => {
                        // 🎉 v0.3.13: 使用新的格式转换方法
                        let formatted_data = match format {
                            StreamFormat::SSE => stream_chunk.to_sse(),
                            StreamFormat::NDJSON => stream_chunk.to_ndjson(),
                            StreamFormat::Json => stream_chunk.to_json(),
                        };

                        let _ = tx.send(formatted_data);

                        // 检查是否完成（从 data 中检查 done 字段）
                        if let Some(done) = stream_chunk.data.get("done") {
                            if done.as_bool().unwrap_or(false) {
                                break;
                            }
                        }
                    }
                    Err(_) => break,
                }
            }
        });

        Ok(UnboundedReceiverStream::new(rx))
    }

    /// Send a streaming chat request to the LLM for OpenAI API (uses OpenAI format)
    pub async fn chat_stream_openai(&self, model: &str, messages: Vec<Message>, format: StreamFormat) -> Result<UnboundedReceiverStream<String>> {
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
            stream: Some(true),
            ..Default::default()
        };

        let config = StreamingConfig {
            format: StreamingFormat::OpenAI,  // 🎯 明确使用 OpenAI 格式
            stream_format: format,
            include_usage: true,
            include_reasoning: false,
        };

        // 🎉 使用新的 chat_stream_universal 方法！
        let stream = self.llm_client.chat_stream_universal(&request, &config).await
            .map_err(|e| anyhow!("LLM connector universal streaming error: {}", e))?;

        let (tx, rx) = tokio::sync::mpsc::unbounded_channel();

        tokio::spawn(async move {
            let mut stream = stream;
            while let Some(chunk) = stream.next().await {
                match chunk {
                    Ok(stream_chunk) => {
                        // 🎉 v0.3.13: 使用新的格式转换方法
                        let formatted_data = match format {
                            StreamFormat::SSE => stream_chunk.to_sse(),
                            StreamFormat::NDJSON => stream_chunk.to_ndjson(),
                            StreamFormat::Json => stream_chunk.to_json(),
                        };

                        let _ = tx.send(formatted_data);

                        // 检查是否完成（从 data 中检查 done 字段）
                        if let Some(done) = stream_chunk.data.get("done") {
                            if done.as_bool().unwrap_or(false) {
                                break;
                            }
                        }
                    }
                    Err(_) => break,
                }
            }
        });

        Ok(UnboundedReceiverStream::new(rx))
    }

    /// Send a streaming chat request to the LLM (backward compatibility - returns JSON format)
    pub async fn chat_stream(&self, model: &str, messages: Vec<Message>) -> Result<UnboundedReceiverStream<String>> {
        // 默认使用 JSON 格式以保持向后兼容性
        self.chat_stream_with_format(model, messages, StreamFormat::Json).await

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
                    }
                ])
            }
            LlmBackendConfig::OpenAI { .. } => {
                Ok(vec![Model {
                    id: "gpt-3.5-turbo".to_string(),
                }])
            }
            LlmBackendConfig::Anthropic { model, .. } => {
                Ok(vec![Model {
                    id: model.clone(),
                }])
            }
            LlmBackendConfig::Aliyun { model, .. } => {
                Ok(vec![Model {
                    id: model.clone(),
                }])
            }
            LlmBackendConfig::Zhipu { .. } => {
                let models = vec![
                    "glm-4", "glm-4.6", "glm-4-plus", "glm-4-flash", "glm-4-air", "glm-4-long"
                ];
                Ok(models.into_iter().map(|name| Model {
                    id: name.to_string(),
                }).collect())
            }
        }
    }
}
