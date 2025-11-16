use super::Client;
use crate::settings::LlmBackendSettings;
use once_cell::sync::Lazy;
use serde::Deserialize;
use std::collections::HashMap;
use std::fs;
use std::path::Path;

/// 全局懒加载的本地模型覆盖配置。
///
/// 文件位置固定为仓库根目录下的 `model-overrides.yaml`，
/// 如果不存在则视为无覆盖配置。
static MODEL_OVERRIDES: Lazy<ModelOverrides> = Lazy::new(ModelOverrides::load);

#[derive(Debug, Default, Deserialize)]
struct ModelOverrides {
    /// provider -> (logical_model -> backend_model)
    #[serde(flatten)]
    providers: HashMap<String, HashMap<String, String>>,
}

impl ModelOverrides {
    fn load() -> Self {
        let path = Path::new("model-overrides.yaml");
        if !path.exists() {
            return ModelOverrides::default();
        }

        match fs::read_to_string(path) {
            Ok(contents) => match serde_yaml::from_str::<ModelOverrides>(&contents) {
                Ok(cfg) => cfg,
                Err(err) => {
                    tracing::warn!(
                        "Failed to parse model-overrides.yaml, ignoring overrides: {}",
                        err
                    );
                    ModelOverrides::default()
                }
            },
            Err(err) => {
                tracing::warn!(
                    "Failed to read model-overrides.yaml, ignoring overrides: {}",
                    err
                );
                ModelOverrides::default()
            }
        }
    }

    fn resolve_override(&self, provider: &str, logical_model: &str) -> Option<String> {
        self.providers
            .get(provider)
            .and_then(|m| m.get(logical_model))
            .cloned()
    }
}

impl Client {
    /// Resolve the effective backend model name for a request.
    ///
    /// `requested` 是协议层传入的 model（逻辑名或 ep-*），
    /// `default_model` 是后端配置中的默认模型（通常来自 CLI --model）。
    pub fn resolve_model(&self, requested: &str, default_model: &str) -> String {
        // Step 1: 本地 overrides（最高优先级）
        let provider_name = match &self.backend {
            LlmBackendSettings::OpenAI { .. } => "openai",
            LlmBackendSettings::Anthropic { .. } => "anthropic",
            LlmBackendSettings::Ollama { .. } => "ollama",
            LlmBackendSettings::Zhipu { .. } => "zhipu",
            LlmBackendSettings::Aliyun { .. } => "aliyun",
            LlmBackendSettings::Volcengine { .. } => "volcengine",
            LlmBackendSettings::Tencent { .. } => "tencent",
            LlmBackendSettings::Longcat { .. } => "longcat",
            LlmBackendSettings::Moonshot { .. } => "moonshot",
            LlmBackendSettings::Minimax { .. } => "minimax",
        };

        if let Some(overridden) = MODEL_OVERRIDES.resolve_override(provider_name, requested) {
            // 命中本地覆盖，只记录逻辑层信息，避免泄露具体 endpoint
            tracing::debug!(
                "🎯 Model override hit: provider={} logical_model={}",
                provider_name,
                requested,
            );
            return overridden;
        }

        // Step 2: provider 特定规则
        match &self.backend {
            // Volcengine: 逻辑名走默认模型，ep-* 直接透传
            LlmBackendSettings::Volcengine { .. } => {
                if requested.starts_with("ep-") {
                    tracing::debug!(
                        "🎯 Volcengine model resolved via explicit endpoint (logical model treated as endpoint)",
                    );
                    requested.to_string()
                } else {
                    tracing::debug!(
                        "🎯 Volcengine logical model resolved via default endpoint (logical_model only)",
                    );
                    default_model.to_string()
                }
            }
            // 其他 provider 暂时按请求模型透传
            _ => requested.to_string(),
        }
    }
}
