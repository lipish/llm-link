use crate::config::LlmBackendConfig;
use anyhow::{anyhow, Result};
use tokio_stream::wrappers::UnboundedReceiverStream;
use llm_connector::{LlmClient, types::{ChatRequest, Message as LlmMessage}, StreamFormat};
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
                if let Some(base_url) = base_url {
                    LlmClient::openai_compatible(api_key, base_url, "openai")?
                } else {
                    LlmClient::openai(api_key)?
                }
            }
            LlmBackendConfig::Anthropic { api_key, .. } => {
                // Use 30 second timeout for better reliability
                LlmClient::anthropic(api_key)?
            }
            LlmBackendConfig::Aliyun { api_key, .. } => {
                LlmClient::aliyun(api_key)?
            }
            LlmBackendConfig::Zhipu { api_key, .. } => {
                // Use Zhipu OpenAI compatible mode for better reliability
                LlmClient::zhipu_openai_compatible(api_key)?
            }
            LlmBackendConfig::Ollama { base_url, .. } => {
                if base_url.is_some() {
                    // For custom Ollama URLs, we might need to use openai_compatible
                    // But for now, let's use the standard ollama method
                    LlmClient::ollama()?
                } else {
                    LlmClient::ollama()?
                }
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

        // 🎉 使用新的 V2 简化流式 API
        let mut stream = self.llm_client.chat_stream(&request).await
            .map_err(|e| anyhow!("LLM connector streaming error: {}", e))?;

        let (tx, rx) = tokio::sync::mpsc::unbounded_channel();

        tokio::spawn(async move {
            while let Some(chunk) = stream.next().await {
                match chunk {
                    Ok(stream_chunk) => {
                        // 获取内容并根据格式进行格式化
                        if let Some(content) = stream_chunk.get_content() {
                            let formatted_data = match format {
                                StreamFormat::SSE => format!("data: {}\n\n", serde_json::json!({"content": content})),
                                StreamFormat::NDJSON => format!("{}\n", serde_json::json!({"content": content})),
                                StreamFormat::Json => serde_json::json!({"content": content}).to_string(),
                            };
                            let _ = tx.send(formatted_data);
                        }

                        // 检查是否完成 - 暂时移除，让流自然结束
                        // if stream_chunk.is_done() {
                        //     break;
                        // }
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

        // 🎉 使用新的 V2 简化流式 API
        let mut stream = self.llm_client.chat_stream(&request).await
            .map_err(|e| anyhow!("LLM connector streaming error: {}", e))?;

        let (tx, rx) = tokio::sync::mpsc::unbounded_channel();

        tokio::spawn(async move {
            while let Some(chunk) = stream.next().await {
                match chunk {
                    Ok(stream_chunk) => {
                        // 获取内容并根据格式进行格式化
                        if let Some(content) = stream_chunk.get_content() {
                            let formatted_data = match format {
                                StreamFormat::SSE => format!("data: {}\n\n", serde_json::json!({"content": content})),
                                StreamFormat::NDJSON => format!("{}\n", serde_json::json!({"content": content})),
                                StreamFormat::Json => serde_json::json!({"content": content}).to_string(),
                            };
                            let _ = tx.send(formatted_data);
                        }

                        // 检查是否完成 - 暂时移除，让流自然结束
                        // if stream_chunk.is_done() {
                        //     break;
                        // }
                    }
                    Err(_) => break,
                }
            }
        });

        Ok(UnboundedReceiverStream::new(rx))
    }



    /// List available models
    pub async fn list_models(&self) -> Result<Vec<Model>> {
        // Try to get models from llm-connector API first (real-time data)
        // If that fails, fall back to minimal built-in list

        // TODO: Implement actual API calls to get real models when llm-connector supports it
        // For now, use minimal built-in fallback based on provider type

        let models = match &self.backend {
            LlmBackendConfig::OpenAI { .. } => {
                // Try API call first (when available)
                // For now, use minimal fallback
                vec![
                    Model { id: "gpt-4o".to_string() },
                    Model { id: "gpt-4".to_string() },
                    Model { id: "gpt-3.5-turbo".to_string() },
                ]
            }
            LlmBackendConfig::Anthropic { .. } => {
                vec![
                    Model { id: "claude-3-5-sonnet-20241022".to_string() },
                    Model { id: "claude-3-haiku-20240307".to_string() },
                ]
            }
            LlmBackendConfig::Zhipu { .. } => {
                vec![
                    Model { id: "glm-4-flash".to_string() },
                    Model { id: "glm-4".to_string() },
                ]
            }
            LlmBackendConfig::Ollama { .. } => {
                // For Ollama, we should use the API to get actual installed models
                // TODO: Use ollama.models() when available
                vec![
                    Model { id: "llama3.2".to_string() },
                    Model { id: "llama2".to_string() },
                ]
            }
            LlmBackendConfig::Aliyun { .. } => {
                vec![
                    Model { id: "qwen-turbo".to_string() },
                    Model { id: "qwen-plus".to_string() },
                ]
            }
        };

        Ok(models)
    }
}
