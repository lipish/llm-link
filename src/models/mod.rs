use serde::{Deserialize, Serialize};
use anyhow::{Result, anyhow};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelInfo {
    pub id: String,
    pub name: String,
    pub description: String,
    #[serde(default)]
    pub supports_tools: bool,
    #[serde(default = "default_context_length")]
    pub context_length: u32,
}

fn default_context_length() -> u32 {
    4096
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderModels {
    pub models: Vec<ModelInfo>,
}

/// Models configuration using HashMap for flexible provider support
/// This allows any provider to be added in models.yaml without code changes
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelsConfig {
    #[serde(flatten)]
    pub providers: HashMap<String, ProviderModels>,
}

impl ModelsConfig {
    /// Load models configuration from embedded YAML
    pub fn load_embedded() -> Result<Self> {
        // Load embedded models.yaml from src/models/models.yaml
        let content = include_str!("models.yaml");

        let config: ModelsConfig = serde_yaml::from_str(content)
            .map_err(|e| anyhow!("Failed to parse embedded models config: {}", e))?;

        Ok(config)
    }

    /// Load models configuration with fallback to default
    pub fn load_with_fallback() -> Self {
        // Try to load from embedded YAML first
        match Self::load_embedded() {
            Ok(config) => {
                tracing::info!("✅ Successfully loaded models from embedded YAML");
                config
            }
            Err(e) => {
                tracing::warn!("⚠️ Failed to load models from YAML, using defaults: {}", e);
                Self::default()
            }
        }
    }

    /// Get models for a specific provider
    pub fn get_models_for_provider(&self, provider: &str) -> Vec<ModelInfo> {
        self.providers
            .get(&provider.to_lowercase())
            .map(|p| p.models.clone())
            .unwrap_or_default()
    }

    /// Get all provider names
    #[allow(dead_code)]
    pub fn get_all_providers(&self) -> Vec<String> {
        self.providers.keys().cloned().collect()
    }
}

impl Default for ModelsConfig {
    fn default() -> Self {
        let mut providers = HashMap::new();

        // OpenAI
        providers.insert("openai".to_string(), ProviderModels {
            models: vec![
                ModelInfo {
                    id: "gpt-4o".to_string(),
                    name: "GPT-4o".to_string(),
                    description: "GPT-4 Omni model".to_string(),
                    supports_tools: true,
                    context_length: 128000,
                },
                ModelInfo {
                    id: "gpt-4".to_string(),
                    name: "GPT-4".to_string(),
                    description: "Most capable GPT-4 model".to_string(),
                    supports_tools: true,
                    context_length: 8192,
                },
                ModelInfo {
                    id: "gpt-3.5-turbo".to_string(),
                    name: "GPT-3.5 Turbo".to_string(),
                    description: "Fast and efficient model".to_string(),
                    supports_tools: true,
                    context_length: 16385,
                },
            ],
        });

        // Anthropic
        providers.insert("anthropic".to_string(), ProviderModels {
            models: vec![
                ModelInfo {
                    id: "claude-3-5-sonnet-20241022".to_string(),
                    name: "Claude 3.5 Sonnet".to_string(),
                    description: "Latest Claude 3.5 Sonnet model".to_string(),
                    supports_tools: true,
                    context_length: 200000,
                },
                ModelInfo {
                    id: "claude-3-haiku-20240307".to_string(),
                    name: "Claude 3 Haiku".to_string(),
                    description: "Fast Claude 3 model".to_string(),
                    supports_tools: true,
                    context_length: 200000,
                },
            ],
        });

        // Zhipu
        providers.insert("zhipu".to_string(), ProviderModels {
            models: vec![
                ModelInfo {
                    id: "glm-4-flash".to_string(),
                    name: "GLM-4 Flash".to_string(),
                    description: "Fast GLM-4 model".to_string(),
                    supports_tools: true,
                    context_length: 128000,
                },
                ModelInfo {
                    id: "glm-4".to_string(),
                    name: "GLM-4".to_string(),
                    description: "Standard GLM-4 model".to_string(),
                    supports_tools: true,
                    context_length: 128000,
                },
            ],
        });

        // Ollama
        providers.insert("ollama".to_string(), ProviderModels {
            models: vec![
                ModelInfo {
                    id: "llama3.2".to_string(),
                    name: "Llama 3.2".to_string(),
                    description: "Latest Llama model".to_string(),
                    supports_tools: false,
                    context_length: 128000,
                },
                ModelInfo {
                    id: "llama2".to_string(),
                    name: "Llama 2".to_string(),
                    description: "Stable Llama 2 model".to_string(),
                    supports_tools: false,
                    context_length: 4096,
                },
            ],
        });

        // Aliyun
        providers.insert("aliyun".to_string(), ProviderModels {
            models: vec![
                ModelInfo {
                    id: "qwen-turbo".to_string(),
                    name: "Qwen Turbo".to_string(),
                    description: "Fast Qwen model".to_string(),
                    supports_tools: true,
                    context_length: 8192,
                },
                ModelInfo {
                    id: "qwen-plus".to_string(),
                    name: "Qwen Plus".to_string(),
                    description: "Enhanced Qwen model".to_string(),
                    supports_tools: true,
                    context_length: 32768,
                },
            ],
        });

        // Volcengine
        providers.insert("volcengine".to_string(), ProviderModels {
            models: vec![
                ModelInfo {
                    id: "doubao-pro-32k".to_string(),
                    name: "Doubao Pro".to_string(),
                    description: "Volcengine Doubao model".to_string(),
                    supports_tools: true,
                    context_length: 32768,
                },
            ],
        });

        // Tencent
        providers.insert("tencent".to_string(), ProviderModels {
            models: vec![
                ModelInfo {
                    id: "hunyuan-lite".to_string(),
                    name: "Hunyuan Lite".to_string(),
                    description: "Tencent Hunyuan Lite model".to_string(),
                    supports_tools: true,
                    context_length: 256000,
                },
            ],
        });

        // Longcat
        providers.insert("longcat".to_string(), ProviderModels {
            models: vec![
                ModelInfo {
                    id: "LongCat-Flash-Chat".to_string(),
                    name: "LongCat Flash Chat".to_string(),
                    description: "High-performance general dialogue model".to_string(),
                    supports_tools: false,
                    context_length: 4096,
                },
            ],
        });

        Self { providers }
    }
}
