use crate::settings::{
    Settings, ServerSettings, LlmBackendSettings, ApiSettings,
    OpenAiApiSettings, OllamaApiSettings, AnthropicApiSettings,
    ClientAdapterSettings, ZedAdapterSettings,
};
use super::AppConfigGenerator;

/// Generate protocol combination configuration
pub fn generate_protocol_config(protocols: &[String], cli_api_key: Option<&str>) -> Settings {
    let mut openai_config = None;
    let mut ollama_config = None;
    let mut anthropic_config = None;

    // Enable corresponding APIs based on protocol list
    for protocol in protocols {
        match protocol.to_lowercase().as_str() {
            "openai" => {
                openai_config = Some(OpenAiApiSettings {
                    enabled: true,
                    path: "/v1".to_string(),
                    api_key_header: Some("Authorization".to_string()),
                    api_key: Some(AppConfigGenerator::resolve_env_var("${LLM_LINK_API_KEY}", cli_api_key)),
                });
            },
            "ollama" => {
                ollama_config = Some(OllamaApiSettings {
                    enabled: true,
                    path: "".to_string(),  // Empty path so routes become /api/tags directly
                    api_key_header: None,
                    api_key: None,
                });
            },
            "anthropic" => {
                anthropic_config = Some(AnthropicApiSettings {
                    enabled: true,
                    path: "/anthropic".to_string(),
                    api_key_header: Some("x-api-key".to_string()),
                });
            },
            _ => {
                eprintln!("Warning: Unknown protocol '{}', ignoring", protocol);
            }
        }
    }

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
            openai: openai_config,
            ollama: ollama_config,
            anthropic: anthropic_config,
        },
        client_adapters: Some(ClientAdapterSettings {
            default_adapter: Some("auto".to_string()),
            force_adapter: None,
            zed: Some(ZedAdapterSettings {
                enabled: true,
                force_images_field: Some(true),
                preferred_format: Some("ndjson".to_string()),
            }),
        }),
    }
}

