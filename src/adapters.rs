use axum::http::HeaderMap;
use llm_connector::StreamFormat;
use serde_json::Value;
use crate::config::Config;
use crate::utils::xml;

/// 客户端适配器类型
#[derive(Debug, Clone, PartialEq)]
pub enum ClientAdapter {
    /// 标准 Ollama 客户端
    Standard,
    /// Zed.dev 编辑器适配
    ZedDev,
    /// OpenAI API 客户端适配
    OpenAI,
    /// Zhipu 原生客户端（保留 XML 格式）
    ZhipuNative,
}

impl ClientAdapter {
    /// 获取该客户端的首选格式
    pub fn preferred_format(&self) -> StreamFormat {
        match self {
            ClientAdapter::Standard => StreamFormat::NDJSON, // Ollama 标准
            ClientAdapter::ZedDev => StreamFormat::NDJSON,   // Zed 偏好 NDJSON
            ClientAdapter::OpenAI => StreamFormat::SSE,      // OpenAI/Codex 偏好 SSE
            ClientAdapter::ZhipuNative => StreamFormat::NDJSON, // Zhipu 原生格式
        }
    }

    /// 应用客户端特定的响应处理
    pub fn apply_response_adaptations(&self, config: &Config, data: &mut Value) {
        match self {
            ClientAdapter::Standard => {
                // 标准模式：检查是否需要转换 XML
                self.apply_xml_conversion(config, data);
            }
            ClientAdapter::ZedDev => {
                // Zed.dev 特定适配：
                // 1. 转换 XML（如果需要）
                self.apply_xml_conversion(config, data);

                // 2. 添加 images 字段
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
                // OpenAI 特定适配：
                // 1. 转换 XML（如果需要）
                self.apply_xml_conversion(config, data);
                // 2. 确保 OpenAI 格式兼容性（目前不需要特殊处理）
            }
            ClientAdapter::ZhipuNative => {
                // Zhipu 原生客户端：保留 XML 格式，不做任何转换
                tracing::debug!("🔧 ZhipuNative adapter: preserving original XML format");
            }
        }
    }

    /// 应用 XML 到 JSON 的转换（如果配置启用）
    fn apply_xml_conversion(&self, config: &Config, data: &mut Value) {
        use crate::config::LlmBackendConfig;

        // 首先检查是否是 Zhipu provider
        let is_zhipu = matches!(config.llm_backend, LlmBackendConfig::Zhipu { .. });

        // 只对 Zhipu provider 进行 XML 转换
        if !is_zhipu {
            tracing::debug!("⏭️  Skipping XML conversion: not a Zhipu provider");
            return;
        }

        // 检查是否启用 XML 转换
        let should_convert = if let Some(ref adapters) = config.client_adapters {
            if let Some(ref zhipu_config) = adapters.zhipu {
                // 如果明确设置了 preserve_xml=true，则不转换
                if zhipu_config.preserve_xml.unwrap_or(false) {
                    tracing::debug!("⏭️  Skipping XML conversion: preserve_xml is enabled");
                    return;
                }
                // 否则根据 convert_xml_to_json 配置决定（默认为 true）
                zhipu_config.convert_xml_to_json.unwrap_or(true)
            } else {
                // 没有 zhipu 配置，默认转换
                true
            }
        } else {
            // 没有 client_adapters 配置，默认转换
            true
        };

        if should_convert {
            tracing::debug!("🔍 Checking for XML in Zhipu response...");
            if xml::transform_xml_in_json_response(data) {
                tracing::info!("🔄 Successfully converted XML to JSON in response");
            } else {
                tracing::debug!("✓ No XML found in response");
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
