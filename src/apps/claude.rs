use crate::settings::{
    Settings, ServerSettings, LlmBackendSettings, ApiSettings,
    OpenAiApiSettings, OllamaApiSettings, AnthropicApiSettings,
    ClientAdapterSettings, ZedAdapterSettings,
};
use super::AppConfigGenerator;

/// Claude Code 应用配置
pub struct ClaudeApp;

impl ClaudeApp {
    /// 生成 Claude Code 配置
    pub fn generate_config(cli_api_key: Option<&str>) -> Settings {
        Settings {
            server: ServerSettings {
                host: "0.0.0.0".to_string(),
                port: 8089,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendSettings::Anthropic {
                api_key: AppConfigGenerator::resolve_env_var("${ANTHROPIC_API_KEY}", cli_api_key),
                model: "claude-3-5-sonnet-20241022".to_string(),
            },
            apis: ApiSettings {
                openai: Some(OpenAiApiSettings {
                    enabled: false,
                    path: "/v1".to_string(),
                    api_key_header: None,
                    api_key: None,
                }),
                ollama: Some(OllamaApiSettings {
                    enabled: false,
                    path: "/ollama".to_string(),
                    api_key_header: None,
                    api_key: None,
                }),
                anthropic: Some(AnthropicApiSettings {
                    enabled: true,
                    path: "".to_string(),
                    api_key_header: Some("x-api-key".to_string()),
                }),
            },
            client_adapters: Some(ClientAdapterSettings {
                default_adapter: Some("standard".to_string()),
                force_adapter: None,
                zed: Some(ZedAdapterSettings {
                    enabled: false,
                    force_images_field: Some(false),
                    preferred_format: Some("json".to_string()),
                }),
            }),
        }
    }
}

