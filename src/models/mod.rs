use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use anyhow::{Result, anyhow};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelInfo {
    pub id: String,
    pub name: String,
    pub description: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderModels {
    pub models: Vec<ModelInfo>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelsConfig {
    pub openai: ProviderModels,
    pub anthropic: ProviderModels,
    pub zhipu: ProviderModels,
    pub ollama: ProviderModels,
    pub aliyun: ProviderModels,
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
        if let Ok(config) = Self::load_embedded() {
            return config;
        }

        // Fallback to hardcoded default configuration
        Self::default()
    }

    /// Load models configuration from external file (for testing/customization)
    pub fn load_from_file<P: AsRef<Path>>(path: P) -> Result<Self> {
        let content = fs::read_to_string(path)
            .map_err(|e| anyhow!("Failed to read models config file: {}", e))?;

        let config: ModelsConfig = serde_yaml::from_str(&content)
            .map_err(|e| anyhow!("Failed to parse models config: {}", e))?;

        Ok(config)
    }

    /// Get models for a specific provider
    pub fn get_models_for_provider(&self, provider: &str) -> Vec<ModelInfo> {
        match provider.to_lowercase().as_str() {
            "openai" => self.openai.models.clone(),
            "anthropic" => self.anthropic.models.clone(),
            "zhipu" => self.zhipu.models.clone(),
            "ollama" => self.ollama.models.clone(),
            "aliyun" => self.aliyun.models.clone(),
            _ => vec![],
        }
    }
}

impl Default for ModelsConfig {
    fn default() -> Self {
        Self {
            openai: ProviderModels {
                models: vec![
                    ModelInfo {
                        id: "gpt-4o".to_string(),
                        name: "GPT-4o".to_string(),
                        description: "GPT-4 Omni model".to_string(),
                    },
                    ModelInfo {
                        id: "gpt-4".to_string(),
                        name: "GPT-4".to_string(),
                        description: "Most capable GPT-4 model".to_string(),
                    },
                    ModelInfo {
                        id: "gpt-3.5-turbo".to_string(),
                        name: "GPT-3.5 Turbo".to_string(),
                        description: "Fast and efficient model".to_string(),
                    },
                ],
            },
            anthropic: ProviderModels {
                models: vec![
                    ModelInfo {
                        id: "claude-3-5-sonnet-20241022".to_string(),
                        name: "Claude 3.5 Sonnet".to_string(),
                        description: "Latest Claude 3.5 Sonnet model".to_string(),
                    },
                    ModelInfo {
                        id: "claude-3-haiku-20240307".to_string(),
                        name: "Claude 3 Haiku".to_string(),
                        description: "Fast Claude 3 model".to_string(),
                    },
                ],
            },
            zhipu: ProviderModels {
                models: vec![
                    ModelInfo {
                        id: "glm-4-flash".to_string(),
                        name: "GLM-4 Flash".to_string(),
                        description: "Fast GLM-4 model".to_string(),
                    },
                    ModelInfo {
                        id: "glm-4".to_string(),
                        name: "GLM-4".to_string(),
                        description: "Standard GLM-4 model".to_string(),
                    },
                ],
            },
            ollama: ProviderModels {
                models: vec![
                    ModelInfo {
                        id: "llama3.2".to_string(),
                        name: "Llama 3.2".to_string(),
                        description: "Latest Llama model".to_string(),
                    },
                    ModelInfo {
                        id: "llama2".to_string(),
                        name: "Llama 2".to_string(),
                        description: "Stable Llama 2 model".to_string(),
                    },
                    ModelInfo {
                        id: "codellama".to_string(),
                        name: "Code Llama".to_string(),
                        description: "Code-specialized model".to_string(),
                    },
                    ModelInfo {
                        id: "mistral".to_string(),
                        name: "Mistral".to_string(),
                        description: "Mistral 7B model".to_string(),
                    },
                ],
            },
            aliyun: ProviderModels {
                models: vec![
                    ModelInfo {
                        id: "qwen-turbo".to_string(),
                        name: "Qwen Turbo".to_string(),
                        description: "Fast Qwen model".to_string(),
                    },
                    ModelInfo {
                        id: "qwen-plus".to_string(),
                        name: "Qwen Plus".to_string(),
                        description: "Enhanced Qwen model".to_string(),
                    },
                ],
            },
        }
    }
}
