use super::{ApiType, Provider, ProviderConfig};
use anyhow::Result;
use llm_connector::LlmClient;

/// Zhipu Provider implementation
#[allow(dead_code)]
pub struct ZhipuProvider;

impl Provider for ZhipuProvider {
    fn name() -> &'static str {
        "zhipu"
    }
    
    fn create_client(config: &ProviderConfig) -> Result<LlmClient> {
        Ok(LlmClient::zhipu_openai_compatible(&config.api_key)?)
    }
    
    fn default_model() -> &'static str {
        "glm-4-flash"
    }
    
    fn env_var_name() -> &'static str {
        "ZHIPU_API_KEY"
    }
    
    fn api_type() -> ApiType {
        ApiType::OpenAICompatible
    }
    
    fn requires_api_key() -> bool {
        true
    }
    
    fn requires_base_url() -> bool {
        true
    }
    
    fn default_base_url() -> Option<&'static str> {
        Some("https://open.bigmodel.cn/api/paas/v4")
    }
}

