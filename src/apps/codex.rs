use crate::settings::{
    Settings, ServerSettings, LlmBackendSettings, ApiSettings,
    OpenAiApiSettings, OllamaApiSettings, AnthropicApiSettings,
    ClientAdapterSettings, ZedAdapterSettings,
};
use super::AppConfigGenerator;

/// Codex CLI 应用配置
pub struct CodexApp;

impl CodexApp {
    /// 生成 Codex CLI 配置
    pub fn generate_config(cli_api_key: Option<&str>) -> Settings {
        Settings {
            server: ServerSettings {
                host: "0.0.0.0".to_string(),
                port: 8088,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendSettings::Zhipu {
                api_key: AppConfigGenerator::resolve_env_var("${ZHIPU_API_KEY}", cli_api_key),
                base_url: Some("https://open.bigmodel.cn/api/paas/v4".to_string()),
                model: "glm-4-flash".to_string(),
            },
            apis: ApiSettings {
                openai: Some(OpenAiApiSettings {
                    enabled: true,
                    path: "/v1".to_string(),
                    api_key_header: Some("Authorization".to_string()),
                    api_key: Some(AppConfigGenerator::resolve_env_var("${LLM_LINK_API_KEY}", cli_api_key)),
                }),
                ollama: Some(OllamaApiSettings {
                    enabled: false,
                    path: "/ollama".to_string(),
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
                default_adapter: Some("openai".to_string()),
                force_adapter: Some("openai".to_string()),
                zed: Some(ZedAdapterSettings {
                    enabled: false,
                    force_images_field: Some(false),
                    preferred_format: Some("json".to_string()),
                }),
            }),
        }
    }
}

