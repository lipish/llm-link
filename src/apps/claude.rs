use crate::settings::{
    Settings, ServerSettings, LlmBackendSettings, ApiSettings,
    OpenAiApiSettings, OllamaApiSettings, AnthropicApiSettings,
    ClientAdapterSettings, ZedAdapterSettings,
};

/// Claude Code application configuration
pub struct ClaudeApp;

impl ClaudeApp {
    /// Generate Claude Code configuration
    pub fn generate_config(_cli_api_key: Option<&str>) -> Settings {
        Settings {
            server: ServerSettings {
                host: "0.0.0.0".to_string(),
                port: 8089,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendSettings::Anthropic {
                // Provider API key is supplied via CLI (--api-key) and applied later by loader
                api_key: String::new(),
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

