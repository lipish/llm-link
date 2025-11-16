use super::Client;
use anyhow::{anyhow, Result};
use llm_connector::{types::ChatRequest, StreamFormat};
use tokio_stream::wrappers::UnboundedReceiverStream;

impl Client {
    /// Send a streaming chat request with specified format (Ollama-style response)
    ///
    /// This method returns streaming responses in Ollama API format, which is used by
    /// Ollama-compatible clients like Zed.dev.
    #[allow(dead_code)]
    pub async fn chat_stream_with_format(
        &self,
        model: &str,
        messages: Vec<llm_connector::types::Message>,
        format: StreamFormat,
    ) -> Result<UnboundedReceiverStream<String>> {
        use futures_util::StreamExt;

        // Messages are already in llm-connector format
        let request = ChatRequest {
            model: model.to_string(),
            messages,
            stream: Some(true),
            ..Default::default()
        };

        tracing::info!("🔄 Requesting streaming from LLM connector (Ollama format)...");

        // Use real streaming API
        let mut stream = self.llm_client.chat_stream(&request).await
            .map_err(|e| anyhow!("LLM connector streaming error: {}", e))?;

        let (tx, rx) = tokio::sync::mpsc::unbounded_channel();
        let model_name = model.to_string();

        tokio::spawn(async move {
            tracing::debug!("🔄 Starting to process stream chunks (Ollama format)...");
            let mut chunk_count = 0;

            while let Some(chunk) = stream.next().await {
                tracing::debug!("📥 Received raw chunk from stream");

                match chunk {
                    Ok(stream_chunk) => {
                        tracing::debug!("✅ Chunk OK, checking for content...");

                        // Check for content
                        if let Some(content) = stream_chunk.get_content() {
                            if !content.is_empty() {
                                chunk_count += 1;
                                if chunk_count == 1 {
                                    tracing::info!("📦 Received first streaming chunk ({} chars)", content.len());
                                } else {
                                    tracing::debug!("📦 Received chunk #{} ({} chars)", chunk_count, content.len());
                                }

                                // Build Ollama-format streaming response
                                let response_chunk = serde_json::json!({
                                    "model": &model_name,
                                    "created_at": chrono::Utc::now().to_rfc3339(),
                                    "message": {
                                        "role": "assistant",
                                        "content": content,
                                        "images": null
                                    },
                                    "done": false
                                });

                                let formatted_data = match format {
                                    StreamFormat::SSE => format!("data: {}\n\n", response_chunk),
                                    StreamFormat::NDJSON => format!("{}\n", response_chunk),
                                    StreamFormat::Json => response_chunk.to_string(),
                                };

                                if tx.send(formatted_data).is_err() {
                                    tracing::warn!("⚠️ Failed to send chunk to receiver (client disconnected?)");
                                    break;
                                }
                                tracing::debug!("✅ Sent chunk #{} to client", chunk_count);
                            }
                        } else {
                            tracing::debug!("⚠️ Chunk has no content (likely metadata or finish chunk)");
                        }
                    }
                    Err(e) => {
                        tracing::error!("❌ Stream error: {:?}", e);
                        break;
                    }
                }
            }

            tracing::info!("✅ Stream processing completed. Total chunks: {}", chunk_count);

            // Send final message
            let final_chunk = serde_json::json!({
                "model": model_name,
                "created_at": chrono::Utc::now().to_rfc3339(),
                "message": {
                    "role": "assistant",
                    "content": ""
                },
                "done": true
            });

            let formatted_final = match format {
                StreamFormat::SSE => format!("data: {}\n\n", final_chunk),
                StreamFormat::NDJSON => format!("{}\n", final_chunk),
                StreamFormat::Json => final_chunk.to_string(),
            };
            let _ = tx.send(formatted_final);
            tracing::debug!("🏁 Sent final chunk");
        });

        Ok(UnboundedReceiverStream::new(rx))
    }

    /// Send a streaming chat request for OpenAI API (OpenAI-style response)
    ///
    /// This method returns streaming responses in OpenAI API format, which is used by
    /// OpenAI-compatible clients like Codex CLI.
    ///
    /// Key feature: Automatically corrects finish_reason from "stop" to "tool_calls"
    /// when tool_calls are detected in the stream.
    #[allow(dead_code)]
    pub async fn chat_stream_openai(
        &self,
        model: &str,
        messages: Vec<llm_connector::types::Message>,
        tools: Option<Vec<llm_connector::types::Tool>>,
        format: StreamFormat,
    ) -> Result<UnboundedReceiverStream<String>> {
        use futures_util::StreamExt;

        // Messages are already in llm-connector format
        let request = ChatRequest {
            model: model.to_string(),
            messages,
            stream: Some(true),
            tools,
            ..Default::default()
        };

        tracing::info!("🔄 Requesting streaming from LLM connector...");

        // Use real streaming API
        let mut stream = self.llm_client.chat_stream(&request).await
            .map_err(|e| anyhow!("LLM connector streaming error: {}", e))?;

        let (tx, rx) = tokio::sync::mpsc::unbounded_channel();
        let model_name = model.to_string();

        tokio::spawn(async move {
            tracing::info!("🔄 Starting to process stream chunks (OpenAI format)...");
            let mut chunk_count = 0;
            let mut has_tool_calls = false;  // Track if tool_calls detected

            while let Some(chunk) = stream.next().await {
                tracing::debug!("📥 Received raw chunk from stream");

                match chunk {
                    Ok(stream_chunk) => {
                        tracing::debug!("✅ Chunk OK, checking for content or tool_calls...");

                        // Build delta object
                        let mut delta = serde_json::json!({});
                        let mut has_data = false;

                        // Check for content
                        if let Some(content) = stream_chunk.get_content() {
                            if !content.is_empty() {
                                delta["content"] = serde_json::json!(content);
                                has_data = true;
                                chunk_count += 1;
                                tracing::info!("📦 Received chunk #{}: '{}' ({} chars)", chunk_count, content, content.len());
                            }
                        }

                        // Check for tool_calls (extract from choices[0].delta.tool_calls)
                        if let Some(first_choice) = stream_chunk.choices.get(0) {
                            if let Some(tool_calls) = &first_choice.delta.tool_calls {
                                if let Ok(tool_calls_value) = serde_json::to_value(tool_calls) {
                                    delta["tool_calls"] = tool_calls_value;
                                    has_data = true;
                                    has_tool_calls = true;  // Mark tool_calls detected
                                    chunk_count += 1;
                                    tracing::info!("🔧 Received chunk #{} with tool_calls: {} calls", chunk_count, tool_calls.len());
                                }
                            }
                        }

                        if has_data {
                            // Build OpenAI-standard streaming response format
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

                            // Send all chunks immediately (preserve streaming experience)
                            if tx.send(formatted_data).is_err() {
                                tracing::warn!("⚠️ Failed to send chunk to receiver (client disconnected?)");
                                break;
                            }
                            tracing::debug!("✅ Sent chunk #{} to client", chunk_count);
                        } else {
                            tracing::debug!("⚠️ Chunk has no content or tool_calls (likely metadata or finish chunk)");
                        }
                    }
                    Err(e) => {
                        tracing::error!("❌ Stream error: {:?}", e);
                        break;
                    }
                }
            }

            tracing::info!("✅ Stream processing completed. Total chunks: {}", chunk_count);

            // Send final message at stream end
            // 🎯 Key fix: If tool_calls detected, finish_reason should be "tool_calls" not "stop"
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
}

