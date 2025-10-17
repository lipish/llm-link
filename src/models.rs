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
    /// Load models configuration from file
    pub fn load_from_file<P: AsRef<Path>>(path: P) -> Result<Self> {
        let content = fs::read_to_string(path)
            .map_err(|e| anyhow!("Failed to read models config file: {}", e))?;
        
        let config: ModelsConfig = serde_yaml::from_str(&content)
            .map_err(|e| anyhow!("Failed to parse models config: {}", e))?;
        
        Ok(config)
    }

    /// Load models configuration with fallback to default
    pub fn load_with_fallback() -> Self {
        // Try to load from configs/models.yaml first
        if let Ok(config) = Self::load_from_file("configs/models.yaml") {
            return config;
        }

        // Fallback to default configuration
        Self::default()
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
                        id: "gpt-4".to_string(),
                        name: "GPT-4".to_string(),
                        description: "Most capable GPT-4 model".to_string(),
                    },
                    ModelInfo {
                        id: "gpt-4-turbo".to_string(),
                        name: "GPT-4 Turbo".to_string(),
                        description: "Latest GPT-4 Turbo model".to_string(),
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
                        id: "claude-3-opus-20240229".to_string(),
                        name: "Claude 3 Opus".to_string(),
                        description: "Most capable Claude 3 model".to_string(),
                    },
                ],
            },
            zhipu: ProviderModels {
                models: vec![
                    ModelInfo {
                        id: "glm-4-flash".to_string(),
                        name: "GLM-4 Flash".to_string(),
                        description: "Fast model for quick tasks".to_string(),
                    },
                    ModelInfo {
                        id: "glm-4-plus".to_string(),
                        name: "GLM-4 Plus".to_string(),
                        description: "Enhanced model for complex tasks".to_string(),
                    },
                    ModelInfo {
                        id: "glm-4".to_string(),
                        name: "GLM-4".to_string(),
                        description: "Standard model".to_string(),
                    },
                    ModelInfo {
                        id: "glm-4-air".to_string(),
                        name: "GLM-4 Air".to_string(),
                        description: "Lightweight model".to_string(),
                    },
                    ModelInfo {
                        id: "glm-4-long".to_string(),
                        name: "GLM-4 Long".to_string(),
                        description: "Long context model".to_string(),
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
                        id: "llama3.1".to_string(),
                        name: "Llama 3.1".to_string(),
                        description: "Llama 3.1 model".to_string(),
                    },
                    ModelInfo {
                        id: "llama2".to_string(),
                        name: "Llama 2".to_string(),
                        description: "Llama 2 model".to_string(),
                    },
                    ModelInfo {
                        id: "codellama".to_string(),
                        name: "Code Llama".to_string(),
                        description: "Code-specialized Llama model".to_string(),
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
                    ModelInfo {
                        id: "qwen-max".to_string(),
                        name: "Qwen Max".to_string(),
                        description: "Most capable Qwen model".to_string(),
                    },
                ],
            },
        }
    }
}
