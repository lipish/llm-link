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
        // Use embedded builtin models configuration
        const BUILTIN_MODELS: &str = include_str!("models.yaml");

        // Parse the embedded builtin config
        serde_yaml::from_str(BUILTIN_MODELS)
            .expect("Builtin models configuration should be valid")
    }
}
