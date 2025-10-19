use super::Client;
use crate::llm::types::Model;
use crate::settings::LlmBackendSettings;
use anyhow::Result;
use llm_connector::Provider;

impl Client {
    /// List available models
    pub async fn list_models(&self) -> Result<Vec<Model>> {
        let provider_name = match &self.backend {
            LlmBackendSettings::OpenAI { .. } => "openai",
            LlmBackendSettings::Anthropic { .. } => "anthropic",
            LlmBackendSettings::Zhipu { .. } => "zhipu",
            LlmBackendSettings::Ollama { .. } => "ollama",
            LlmBackendSettings::Aliyun { .. } => "aliyun",
        };

        // Special handling for Ollama - get actual installed models
        if provider_name == "ollama" {
            if let Some(ollama_client) = self.llm_client.as_ollama() {
                // Try to get actual installed models from Ollama
                match ollama_client.models().await {
                    Ok(ollama_models) => {
                        let models: Vec<Model> = ollama_models.into_iter()
                            .map(|model_name| Model { id: model_name })
                            .collect();

                        if !models.is_empty() {
                            return Ok(models);
                        }
                    }
                    Err(e) => {
                        eprintln!("Warning: Failed to get Ollama models: {}, falling back to config", e);
                    }
                }
            }
        }

        // For other providers or if Ollama API fails, use configuration file
        let model_infos = self.models_config.get_models_for_provider(provider_name);

        // Convert ModelInfo to Model
        let models: Vec<Model> = model_infos.into_iter().map(|info| Model {
            id: info.id,
        }).collect();

        // If no models found in config, fall back to current model from backend config
        if models.is_empty() {
            let fallback_model = match &self.backend {
                LlmBackendSettings::OpenAI { model, .. } => model.clone(),
                LlmBackendSettings::Anthropic { model, .. } => model.clone(),
                LlmBackendSettings::Zhipu { model, .. } => model.clone(),
                LlmBackendSettings::Ollama { model, .. } => model.clone(),
                LlmBackendSettings::Aliyun { model, .. } => model.clone(),
            };

            Ok(vec![Model { id: fallback_model }])
        } else {
            Ok(models)
        }
    }
}

