use super::{ApiType, Provider, ProviderConfig};
use anyhow::Result;
use llm_connector::LlmClient;

/// Tencent Provider implementation
#[allow(dead_code)]
pub struct TencentProvider;

impl Provider for TencentProvider {
    fn name() -> &'static str {
        "tencent"
    }
    
    fn create_client(config: &ProviderConfig) -> Result<LlmClient> {
        Ok(LlmClient::tencent(&config.api_key)?)
    }
    
    fn default_model() -> &'static str {
        "hunyuan-lite"
    }
    
    fn env_var_name() -> &'static str {
        "TENCENT_API_KEY"
    }
    
    fn api_type() -> ApiType {
        ApiType::Native
    }
    
    fn requires_api_key() -> bool {
        true
    }
}

