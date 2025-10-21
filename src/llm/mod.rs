mod chat;
mod models;
mod stream;
mod types;

pub use types::{Model, Response};

use crate::models::ModelsConfig;
use crate::settings::LlmBackendSettings;
use anyhow::Result;
use llm_connector::LlmClient;

/// Unified LLM client that wraps llm-connector for all providers
pub struct Client {
    backend: LlmBackendSettings,
    llm_client: LlmClient,
    models_config: ModelsConfig,
}

impl Client {
    /// Create a new client with the specified backend configuration
    pub fn new(config: &LlmBackendSettings) -> Result<Self> {
        let llm_client = match config {
            LlmBackendSettings::OpenAI {
                api_key, base_url, ..
            } => {
                // Use 30 second timeout for better reliability
                if let Some(base_url) = base_url {
                    LlmClient::openai_compatible(api_key, base_url, "openai")?
                } else {
                    LlmClient::openai(api_key)?
                }
            }
            LlmBackendSettings::Anthropic { api_key, .. } => {
                // Use 30 second timeout for better reliability
                LlmClient::anthropic(api_key)?
            }
            LlmBackendSettings::Aliyun { api_key, .. } => LlmClient::aliyun(api_key)?,
            LlmBackendSettings::Zhipu { api_key, .. } => {
                // Use Zhipu OpenAI compatible mode for better reliability
                LlmClient::zhipu_openai_compatible(api_key)?
            }
            LlmBackendSettings::Volcengine { api_key, .. } => LlmClient::volcengine(api_key)?,
            LlmBackendSettings::Tencent { api_key, .. } => LlmClient::tencent(api_key)?,
            LlmBackendSettings::Ollama { base_url, .. } => {
                if base_url.is_some() {
                    // For custom Ollama URLs, we might need to use openai_compatible
                    // But for now, let's use the standard ollama method
                    LlmClient::ollama()?
                } else {
                    LlmClient::ollama()?
                }
            }
        };

        // Load models configuration
        let models_config = ModelsConfig::load_with_fallback();

        Ok(Self {
            backend: config.clone(),
            llm_client,
            models_config,
        })
    }
}
