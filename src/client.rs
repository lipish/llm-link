use crate::config::LlmBackendConfig;
use crate::models::ModelsConfig;
use anyhow::{anyhow, Result};
use tokio_stream::wrappers::UnboundedReceiverStream;
use llm_connector::{LlmClient, types::{ChatRequest, Message as LlmMessage}, StreamFormat, Provider};
use serde_json;

/// Unified LLM client that wraps llm-connector for all providers
pub struct Client {
    backend: LlmBackendConfig,
    llm_client: LlmClient,
    models_config: ModelsConfig,
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
    pub tool_calls: Option<serde_json::Value>,  // Store tool_calls from LLM response
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

        // Load models configuration
        let models_config = ModelsConfig::load_with_fallback();

        Ok(Self {
            backend: config.clone(),
            llm_client,
            models_config,
        })
    }

    /// Send a chat request to the LLM
    pub async fn chat(&self, model: &str, messages: Vec<llm_connector::types::Message>, tools: Option<Vec<llm_connector::types::Tool>>) -> Result<Response> {
        // Messages are already in llm-connector format
        let request = ChatRequest {
            model: model.to_string(),
            messages,
            tools,
            ..Default::default()
        };

        let response = self.llm_client.chat(&request).await
            .map_err(|e| anyhow!("LLM connector error: {}", e))?;

        // Debug: log the raw response
        tracing::info!("📦 Raw LLM response choices: {:?}", response.choices.len());
        if let Some(choice) = response.choices.get(0) {
            tracing::info!("📦 Message content: '{}'", choice.message.content);
            tracing::info!("📦 Message reasoning_content: {:?}", choice.message.reasoning_content);
            tracing::info!("📦 Message reasoning: {:?}", choice.message.reasoning);
        }

        // Extract content and usage information
        let (prompt_tokens, completion_tokens, total_tokens) = response.get_usage_safe();

        // Extract content and tool_calls from choices[0].message
        let (content, tool_calls) = if let Some(choice) = response.choices.get(0) {
            let msg = &choice.message;

            // Extract content (could be in content, reasoning_content, reasoning, etc.)
            let content = if !msg.content.is_empty() {
                msg.content.clone()
            } else if let Some(reasoning) = &msg.reasoning_content {
                reasoning.clone()
            } else if let Some(reasoning) = &msg.reasoning {
                reasoning.clone()
            } else {
                String::new()
            };

            // Extract tool_calls if present
            let tool_calls = msg.tool_calls.as_ref()
                .and_then(|tc| serde_json::to_value(tc).ok());

            (content, tool_calls)
        } else {
            (String::new(), None)
        };

        Ok(Response {
            content,
            model: response.model,
            usage: Usage {
                prompt_tokens,
                completion_tokens,
                total_tokens,
            },
            tool_calls,
        })
    }

    /// Send a streaming chat request to the LLM with specified format
    pub async fn chat_stream_with_format(&self, model: &str, messages: Vec<llm_connector::types::Message>, format: StreamFormat) -> Result<UnboundedReceiverStream<String>> {
        // Messages are already in llm-connector format
        // 🎉 直接回退到模拟流式响应，因为智谱AI的流式支持有问题
        tracing::info!("🔄 Using simulated streaming for better compatibility");
        self.fallback_to_simulated_stream(model, messages, format).await
    }

    /// 回退到模拟流式响应
    async fn fallback_to_simulated_stream(&self, model: &str, messages: Vec<LlmMessage>, format: StreamFormat) -> Result<UnboundedReceiverStream<String>> {
        // 使用非流式请求获取完整响应
        let request = ChatRequest {
            model: model.to_string(),
            messages,
            stream: Some(false),
            ..Default::default()
        };

        let response = self.llm_client.chat(&request).await
            .map_err(|e| anyhow!("LLM connector non-streaming error: {}", e))?;

        let content = response.get_content().unwrap_or("").to_string();
        tracing::info!("📝 Fallback response content: '{}'", content);

        let (tx, rx) = tokio::sync::mpsc::unbounded_channel();
        let model_name = model.to_string();

        tokio::spawn(async move {
            // 模拟流式输出：将内容分块发送
            let words: Vec<&str> = content.split_whitespace().collect();
            let chunk_size = 3; // 每次发送3个词

            for chunk in words.chunks(chunk_size) {
                let chunk_content = chunk.join(" ");
                if !chunk_content.is_empty() {
                    let ollama_chunk = serde_json::json!({
                        "model": model_name,
                        "created_at": chrono::Utc::now().to_rfc3339(),
                        "message": {
                            "role": "assistant",
                            "content": chunk_content + " ",
                            "images": null
                        },
                        "done": false
                    });

                    let formatted_data = match format {
                        StreamFormat::SSE => format!("data: {}\n\n", ollama_chunk),
                        StreamFormat::NDJSON => format!("{}\n", ollama_chunk),
                        StreamFormat::Json => ollama_chunk.to_string(),
                    };

                    let _ = tx.send(formatted_data);

                    // 添加小延迟以模拟真实的流式体验
                    tokio::time::sleep(std::time::Duration::from_millis(50)).await;
                }
            }

            // 发送最终消息
            let final_chunk = serde_json::json!({
                "model": model_name,
                "created_at": chrono::Utc::now().to_rfc3339(),
                "message": {
                    "role": "assistant",
                    "content": "",
                    "images": null
                },
                "done": true,
                "total_duration": 0,
                "load_duration": 0,
                "prompt_eval_count": 0,
                "prompt_eval_duration": 0,
                "eval_count": 0,
                "eval_duration": 0
            });

            let formatted_final = match format {
                StreamFormat::SSE => format!("data: {}\n\n", final_chunk),
                StreamFormat::NDJSON => format!("{}\n", final_chunk),
                StreamFormat::Json => final_chunk.to_string(),
            };

            let _ = tx.send(formatted_final);
        });

        Ok(UnboundedReceiverStream::new(rx))
    }

    /// Send a streaming chat request to the LLM for OpenAI API (uses OpenAI format)
    pub async fn chat_stream_openai(&self, model: &str, messages: Vec<llm_connector::types::Message>, tools: Option<Vec<llm_connector::types::Tool>>, format: StreamFormat) -> Result<UnboundedReceiverStream<String>> {
        use futures_util::StreamExt;

        // Messages are already in llm-connector format
        let request = ChatRequest {
            model: model.to_string(),
            messages,
            stream: Some(true),
            tools,
            ..Default::default()
        };

        tracing::info!("🔄 Requesting real streaming from LLM connector...");

        // 使用真实的流式 API
        let mut stream = self.llm_client.chat_stream(&request).await
            .map_err(|e| anyhow!("LLM connector streaming error: {}", e))?;

        let (tx, rx) = tokio::sync::mpsc::unbounded_channel();
        let model_name = model.to_string();

        tokio::spawn(async move {
            tracing::info!("🔄 Starting to process OpenAI stream chunks...");
            let mut chunk_count = 0;
            let mut has_tool_calls = false;  // 标记是否检测到 tool_calls

            while let Some(chunk) = stream.next().await {
                tracing::debug!("📥 Received raw chunk from stream");

                match chunk {
                    Ok(stream_chunk) => {
                        tracing::debug!("✅ Chunk OK, checking for content or tool_calls...");

                        // 构建 delta 对象
                        let mut delta = serde_json::json!({});
                        let mut has_data = false;

                        // 检查是否有 content
                        if let Some(content) = stream_chunk.get_content() {
                            if !content.is_empty() {
                                delta["content"] = serde_json::json!(content);
                                has_data = true;
                                chunk_count += 1;
                                tracing::info!("📦 Received chunk #{}: '{}' ({} chars)", chunk_count, content, content.len());
                            }
                        }

                        // 检查是否有 tool_calls（从 choices[0].delta.tool_calls 提取）
                        if let Some(first_choice) = stream_chunk.choices.get(0) {
                            if let Some(tool_calls) = &first_choice.delta.tool_calls {
                                if let Ok(tool_calls_value) = serde_json::to_value(tool_calls) {
                                    delta["tool_calls"] = tool_calls_value;
                                    has_data = true;
                                    has_tool_calls = true;  // 标记检测到 tool_calls
                                    chunk_count += 1;
                                    tracing::info!("🔧 Received chunk #{} with tool_calls: {} calls", chunk_count, tool_calls.len());
                                }
                            }
                        }

                        if has_data {
                            // 构建符合 OpenAI 标准的流式响应格式
                            let openai_chunk = serde_json::json!({
                                "id": "chatcmpl-123",
                                "object": "chat.completion.chunk",
                                "created": chrono::Utc::now().timestamp(),
                                "model": &model_name,
                                "choices": [{
                                    "index": 0,
                                    "delta": delta,
                                    "finish_reason": null
                                }]
                            });

                            let formatted_data = match format {
                                StreamFormat::SSE => format!("data: {}\n\n", openai_chunk),
                                StreamFormat::NDJSON => format!("{}\n", openai_chunk),
                                StreamFormat::Json => openai_chunk.to_string(),
                            };

                            // 立即发送所有 chunks（保留流式体验）
                            if tx.send(formatted_data).is_err() {
                                tracing::warn!("⚠️ Failed to send chunk to receiver (client disconnected?)");
                                break;
                            }
                            tracing::debug!("✅ Sent chunk #{} to client", chunk_count);
                        } else {
                            tracing::warn!("⚠️ Chunk has no content or tool_calls");
                        }
                    }
                    Err(e) => {
                        tracing::error!("❌ Stream error: {:?}", e);
                        break;
                    }
                }
            }

            tracing::info!("✅ Stream processing completed. Total chunks: {}", chunk_count);

            // 流结束时发送最终消息
            // 🎯 关键修复：如果检测到 tool_calls，finish_reason 应该是 "tool_calls" 而不是 "stop"
            let finish_reason = if has_tool_calls {
                tracing::info!("🎯 Setting finish_reason to 'tool_calls' (detected tool_calls in stream)");
                "tool_calls"
            } else {
                "stop"
            };

            let final_chunk = serde_json::json!({
                "id": "chatcmpl-123",
                "object": "chat.completion.chunk",
                "created": chrono::Utc::now().timestamp(),
                "model": model_name,
                "choices": [{
                    "index": 0,
                    "delta": {},
                    "finish_reason": finish_reason
                }]
            });

            let formatted_final = match format {
                StreamFormat::SSE => format!("data: {}\n\ndata: [DONE]\n\n", final_chunk),
                StreamFormat::NDJSON => format!("{}\n", final_chunk),
                StreamFormat::Json => final_chunk.to_string(),
            };
            let _ = tx.send(formatted_final);
            tracing::info!("🏁 Sent final chunk and [DONE] marker");
        });

        Ok(UnboundedReceiverStream::new(rx))
    }



    /// List available models
    pub async fn list_models(&self) -> Result<Vec<Model>> {
        let provider_name = match &self.backend {
            LlmBackendConfig::OpenAI { .. } => "openai",
            LlmBackendConfig::Anthropic { .. } => "anthropic",
            LlmBackendConfig::Zhipu { .. } => "zhipu",
            LlmBackendConfig::Ollama { .. } => "ollama",
            LlmBackendConfig::Aliyun { .. } => "aliyun",
        };

        // Special handling for Ollama - get actual installed models
        if provider_name == "ollama" {
            if let Some(ollama_client) = self.llm_client.as_ollama() {
                // Try to get actual installed models from Ollama
                match ollama_client.models().await {
                    Ok(ollama_models) => {
                        let models: Vec<Model> = ollama_models.into_iter()
                            .map(|model_name| Model { id: model_name })
                            .collect();

                        if !models.is_empty() {
                            return Ok(models);
                        }
                    }
                    Err(e) => {
                        eprintln!("Warning: Failed to get Ollama models: {}, falling back to config", e);
                    }
                }
            }
        }

        // For other providers or if Ollama API fails, use configuration file
        let model_infos = self.models_config.get_models_for_provider(provider_name);

        // Convert ModelInfo to Model
        let models: Vec<Model> = model_infos.into_iter().map(|info| Model {
            id: info.id,
        }).collect();

        // If no models found in config, fall back to current model from backend config
        if models.is_empty() {
            let fallback_model = match &self.backend {
                LlmBackendConfig::OpenAI { model, .. } => model.clone(),
                LlmBackendConfig::Anthropic { model, .. } => model.clone(),
                LlmBackendConfig::Zhipu { model, .. } => model.clone(),
                LlmBackendConfig::Ollama { model, .. } => model.clone(),
                LlmBackendConfig::Aliyun { model, .. } => model.clone(),
            };

            Ok(vec![Model { id: fallback_model }])
        } else {
            Ok(models)
        }
    }
}
