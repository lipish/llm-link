use axum::http::HeaderMap;
use llm_connector::StreamFormat;
use serde_json::Value;
use crate::config::Config;

/// 客户端适配器类型
#[derive(Debug, Clone, PartialEq)]
pub enum ClientAdapter {
    /// 标准 Ollama 客户端
    Standard,
    /// Zed.dev 编辑器适配
    ZedDev,
    /// OpenAI API 客户端适配
    OpenAI,
}

impl ClientAdapter {
    /// 获取该客户端的首选格式
    pub fn preferred_format(&self) -> StreamFormat {
        match self {
            ClientAdapter::Standard => StreamFormat::NDJSON, // Ollama 标准
            ClientAdapter::ZedDev => StreamFormat::NDJSON,   // Zed 偏好 NDJSON
            ClientAdapter::OpenAI => StreamFormat::SSE,      // OpenAI/Codex 偏好 SSE
        }
    }

    /// 应用客户端特定的响应处理
    pub fn apply_response_adaptations(&self, config: &Config, data: &mut Value) {
        match self {
            ClientAdapter::Standard => {
                // 标准模式：不做任何修改
            }
            ClientAdapter::ZedDev => {
                // Zed.dev 特定适配：添加 images 字段
                let should_add_images = if let Some(ref adapters) = config.client_adapters {
                    if let Some(ref zed_config) = adapters.zed {
                        zed_config.force_images_field.unwrap_or(true)
                    } else {
                        true
                    }
                } else {
                    true
                };

                if should_add_images {
                    if let Some(message) = data.get_mut("message") {
                        if message.get("images").is_none() {
                            message.as_object_mut().unwrap().insert(
                                "images".to_string(),
                                Value::Null
                            );
                        }
                    }
                }
            }
            ClientAdapter::OpenAI => {
                // OpenAI 特定适配：确保 OpenAI 格式兼容性
                // 目前不需要特殊处理
            }
        }
    }
}

/// 格式检测器
pub struct FormatDetector;

impl FormatDetector {
    /// 根据 HTTP 标准确定响应格式
    pub fn determine_format(headers: &HeaderMap) -> (StreamFormat, &'static str) {
        if let Some(accept) = headers.get("accept") {
            if let Ok(accept_str) = accept.to_str() {
                if accept_str.contains("text/event-stream") {
                    return (StreamFormat::SSE, "text/event-stream");
                }
                if accept_str.contains("application/x-ndjson") || accept_str.contains("application/jsonlines") {
                    return (StreamFormat::NDJSON, "application/x-ndjson");
                }
            }
        }
        // 默认：NDJSON
        (StreamFormat::NDJSON, "application/x-ndjson")
    }

    /// 获取格式对应的 Content-Type
    pub fn get_content_type(format: StreamFormat) -> &'static str {
        match format {
            StreamFormat::SSE => "text/event-stream",
            StreamFormat::NDJSON => "application/x-ndjson",
            StreamFormat::Json => "application/json",
        }
    }
}
