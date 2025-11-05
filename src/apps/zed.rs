use crate::settings::{
    Settings, ServerSettings, LlmBackendSettings, ApiSettings,
    OpenAiApiSettings, OllamaApiSettings, AnthropicApiSettings,
    ClientAdapterSettings, ZedAdapterSettings,
};
use super::AppConfigGenerator;

/// Zed.dev application configuration
pub struct ZedApp;

impl ZedApp {
    /// Generate Zed.dev configuration
    pub fn generate_config(cli_api_key: Option<&str>) -> Settings {
        Settings {
            server: ServerSettings {
                host: "0.0.0.0".to_string(),
                port: 11434,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendSettings::Zhipu {
                api_key: AppConfigGenerator::resolve_env_var("${ZHIPU_API_KEY}", cli_api_key),
                base_url: Some("https://open.bigmodel.cn/api/paas/v4".to_string()),
                model: "glm-4-flash".to_string(),
            },
            apis: ApiSettings {
                openai: Some(OpenAiApiSettings {
                    enabled: false,
                    path: "/v1".to_string(),
                    api_key_header: None,
                    api_key: None,
                }),
                ollama: Some(OllamaApiSettings {
                    enabled: true,
                    path: "".to_string(),  // Empty path so routes become /api/tags directly
                    api_key_header: None,
                    api_key: None,
                }),
                anthropic: Some(AnthropicApiSettings {
                    enabled: false,
                    path: "/anthropic".to_string(),
                    api_key_header: None,
                }),
            },
            client_adapters: Some(ClientAdapterSettings {
                default_adapter: Some("zed".to_string()),
                force_adapter: Some("zed".to_string()),
                zed: Some(ZedAdapterSettings {
                    enabled: true,
                    force_images_field: Some(true),
                    preferred_format: Some("ndjson".to_string()),
                }),
            }),
        }
    }
}

