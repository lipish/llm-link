use super::Client;
use crate::llm::types::{Response, Usage};
use anyhow::{anyhow, Result};
use llm_connector::types::ChatRequest;

impl Client {
    /// Send a non-streaming chat request to the LLM
    #[allow(dead_code)]
    pub async fn chat(
        &self,
        model: &str,
        messages: Vec<llm_connector::types::Message>,
        tools: Option<Vec<llm_connector::types::Tool>>,
    ) -> Result<Response> {
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
        tracing::info!("📦 Raw LLM response: {:?}", response);
        tracing::info!("📦 Raw LLM response choices: {}", response.choices.len());
        if let Some(choice) = response.choices.get(0) {
            tracing::info!("📦 Message content: '{}'", choice.message.content_as_text());
            tracing::info!("📦 Message reasoning_content: {:?}", choice.message.reasoning_content);
            tracing::info!("📦 Message reasoning: {:?}", choice.message.reasoning);
        } else {
            tracing::warn!("⚠️ No choices in response!");
        }

        // Extract content and usage information
        let (prompt_tokens, completion_tokens, total_tokens) = response.get_usage_safe();

        // Extract content and tool_calls from choices[0].message or response.content
        let (content, tool_calls) = if let Some(choice) = response.choices.get(0) {
            let msg = &choice.message;

            // Extract content (could be in content, reasoning_content, reasoning, etc.)
            let content = if msg.is_text_only() && !msg.content_as_text().is_empty() {
                msg.content_as_text()
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
        } else if !response.content.is_empty() {
            // Fallback: some providers (like Aliyun in llm-connector 0.4.16)
            // put content directly in response.content instead of choices
            tracing::info!("📦 Using response.content: '{}'", response.content);
            (response.content.clone(), None)
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
}

