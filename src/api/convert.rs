use crate::llm::Response;
use anyhow::Result;
use llm_connector::types::{Function, Message as LlmMessage, Role as LlmRole, Tool};
use serde_json::Value;

/// Convert OpenAI messages format to llm-connector format
pub fn openai_messages_to_llm(messages: Vec<Value>) -> Result<Vec<LlmMessage>> {
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

/// Convert Response to OpenAI format
pub fn response_to_openai(response: Response) -> Value {
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

/// Convert Response to Ollama format
pub fn response_to_ollama(response: Response) -> Value {
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
pub fn openai_tools_to_llm(tools: Vec<Value>) -> Vec<Tool> {
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

/// Convert model list to Ollama format
pub fn models_to_ollama(models: Vec<crate::llm::Model>) -> Vec<Value> {
    models
        .into_iter()
        .map(|model| {
            let family = model.id.split('-').next().unwrap_or("unknown");
            serde_json::json!({
                "name": model.id,
                "model": model.id,
                "modified_at": chrono::Utc::now().to_rfc3339(),
                "size": 1000000,
                "digest": format!("sha256:{}", "0".repeat(64)),
                "details": {
                    "parent_model": "",
                    "format": "gguf",
                    "family": family,
                    "families": [family],
                    "parameter_size": "7B",
                    "quantization_level": "Q4_K_M"
                },
                "expires_at": null
            })
        })
        .collect()
}

