use serde::{Deserialize, Serialize};
use crate::config::{Config, ServerConfig, LlmBackendConfig, ApiConfigs, OpenAiApiConfig, OllamaApiConfig, AnthropicApiConfig, ClientAdapterConfigs, ZedAdapterConfig};

/// 支持的应用类型
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SupportedApp {
    /// Codex CLI - OpenAI API 客户端
    CodexCLI,
    /// Claude Code - Anthropic 客户端
    ClaudeCode,
    /// Zed.dev - Ollama API 客户端
    ZedDev,
    /// 双协议支持
    Dual,
}

impl SupportedApp {
    /// 从字符串解析应用类型
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "codex-cli" | "codex" => Some(Self::CodexCLI),
            "claude-code" | "claude" => Some(Self::ClaudeCode),
            "zed-dev" | "zed" => Some(Self::ZedDev),
            "dual" => Some(Self::Dual),
            _ => None,
        }
    }

    /// 获取应用名称
    pub fn name(&self) -> &'static str {
        match self {
            Self::CodexCLI => "codex-cli",
            Self::ClaudeCode => "claude-code",
            Self::ZedDev => "zed-dev",
            Self::Dual => "dual",
        }
    }

    /// 列出所有支持的应用
    pub fn all() -> Vec<Self> {
        vec![Self::CodexCLI, Self::ClaudeCode, Self::ZedDev, Self::Dual]
    }
}

/// 应用配置生成器
pub struct AppConfigGenerator;

impl AppConfigGenerator {
    /// 为指定应用生成配置
    pub fn generate_config(app: &SupportedApp) -> Config {
        match app {
            SupportedApp::CodexCLI => Self::codex_cli_config(),
            SupportedApp::ClaudeCode => Self::claude_code_config(),
            SupportedApp::ZedDev => Self::zed_dev_config(),
            SupportedApp::Dual => Self::dual_protocol_config(),
        }
    }

    /// 解析环境变量模板
    fn resolve_env_var(template: &str) -> String {
        if template.starts_with("${") && template.ends_with("}") {
            let var_name = &template[2..template.len()-1];
            std::env::var(var_name).unwrap_or_else(|_| {
                eprintln!("Warning: Environment variable '{}' not found, using placeholder", var_name);
                template.to_string()
            })
        } else {
            template.to_string()
        }
    }

    /// Codex CLI 配置
    fn codex_cli_config() -> Config {
        Config {
            server: ServerConfig {
                host: "0.0.0.0".to_string(),
                port: 8088,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendConfig::Zhipu {
                api_key: Self::resolve_env_var("${ZHIPU_API_KEY}"),
                base_url: Some("https://open.bigmodel.cn/api/paas/v4".to_string()),
                model: "glm-4-flash".to_string(),
            },
            apis: ApiConfigs {
                openai: Some(OpenAiApiConfig {
                    enabled: true,
                    path: "/v1".to_string(),
                    api_key_header: Some("Authorization".to_string()),
                    api_key: Some(Self::resolve_env_var("${LLM_LINK_API_KEY}")),
                }),
                ollama: Some(OllamaApiConfig {
                    enabled: false,
                    path: "/ollama".to_string(),
                    api_key_header: None,
                    api_key: None,
                }),
                anthropic: Some(AnthropicApiConfig {
                    enabled: false,
                    path: "/anthropic".to_string(),
                    api_key_header: None,
                }),
            },
            client_adapters: Some(ClientAdapterConfigs {
                default_adapter: Some("openai".to_string()),
                force_adapter: Some("openai".to_string()),
                zed: Some(ZedAdapterConfig {
                    enabled: false,
                    force_images_field: Some(false),
                    preferred_format: Some("json".to_string()),
                }),
            }),
        }
    }

    /// Zed.dev 配置
    fn zed_dev_config() -> Config {
        Config {
            server: ServerConfig {
                host: "0.0.0.0".to_string(),
                port: 11434,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendConfig::Zhipu {
                api_key: Self::resolve_env_var("${ZHIPU_API_KEY}"),
                base_url: Some("https://open.bigmodel.cn/api/paas/v4".to_string()),
                model: "glm-4-flash".to_string(),
            },
            apis: ApiConfigs {
                openai: Some(OpenAiApiConfig {
                    enabled: false,
                    path: "/v1".to_string(),
                    api_key_header: None,
                    api_key: None,
                }),
                ollama: Some(OllamaApiConfig {
                    enabled: true,
                    path: "/api".to_string(),
                    api_key_header: None,
                    api_key: None,
                }),
                anthropic: Some(AnthropicApiConfig {
                    enabled: false,
                    path: "/anthropic".to_string(),
                    api_key_header: None,
                }),
            },
            client_adapters: Some(ClientAdapterConfigs {
                default_adapter: Some("zed".to_string()),
                force_adapter: Some("zed".to_string()),
                zed: Some(ZedAdapterConfig {
                    enabled: true,
                    force_images_field: Some(true),
                    preferred_format: Some("ndjson".to_string()),
                }),
            }),
        }
    }

    /// Claude Code 配置
    fn claude_code_config() -> Config {
        Config {
            server: ServerConfig {
                host: "0.0.0.0".to_string(),
                port: 8089,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendConfig::Zhipu {
                api_key: Self::resolve_env_var("${ZHIPU_API_KEY}"),
                base_url: Some("https://open.bigmodel.cn/api/paas/v4".to_string()),
                model: "glm-4-plus".to_string(),
            },
            apis: ApiConfigs {
                openai: Some(OpenAiApiConfig {
                    enabled: false,
                    path: "/v1".to_string(),
                    api_key_header: None,
                    api_key: None,
                }),
                ollama: Some(OllamaApiConfig {
                    enabled: false,
                    path: "/ollama".to_string(),
                    api_key_header: None,
                    api_key: None,
                }),
                anthropic: Some(AnthropicApiConfig {
                    enabled: true,
                    path: "/anthropic".to_string(),
                    api_key_header: Some("x-api-key".to_string()),
                }),
            },
            client_adapters: Some(ClientAdapterConfigs {
                default_adapter: Some("standard".to_string()),
                force_adapter: None,
                zed: Some(ZedAdapterConfig {
                    enabled: false,
                    force_images_field: Some(false),
                    preferred_format: Some("json".to_string()),
                }),
            }),
        }
    }

    /// 双协议配置
    fn dual_protocol_config() -> Config {
        Config {
            server: ServerConfig {
                host: "0.0.0.0".to_string(),
                port: 11434,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendConfig::Zhipu {
                api_key: Self::resolve_env_var("${ZHIPU_API_KEY}"),
                base_url: Some("https://open.bigmodel.cn/api/paas/v4".to_string()),
                model: "glm-4-flash".to_string(),
            },
            apis: ApiConfigs {
                openai: Some(OpenAiApiConfig {
                    enabled: true,
                    path: "/v1".to_string(),
                    api_key_header: Some("Authorization".to_string()),
                    api_key: Some(Self::resolve_env_var("${LLM_LINK_API_KEY}")),
                }),
                ollama: Some(OllamaApiConfig {
                    enabled: true,
                    path: "/ollama".to_string(),
                    api_key_header: None,
                    api_key: None,
                }),
                anthropic: Some(AnthropicApiConfig {
                    enabled: false,
                    path: "/anthropic".to_string(),
                    api_key_header: None,
                }),
            },
            client_adapters: Some(ClientAdapterConfigs {
                default_adapter: Some("auto".to_string()),
                force_adapter: None,
                zed: Some(ZedAdapterConfig {
                    enabled: true,
                    force_images_field: Some(true),
                    preferred_format: Some("ndjson".to_string()),
                }),
            }),
        }
    }
}

/// 应用信息提供器
pub struct AppInfoProvider;

impl AppInfoProvider {
    /// 获取应用的推荐配置说明
    pub fn get_app_info(app: &SupportedApp) -> AppInfo {
        match app {
            SupportedApp::CodexCLI => AppInfo {
                name: "Codex CLI".to_string(),
                description: "GitHub Codex CLI tool for AI-powered coding assistance".to_string(),
                port: 8088,
                protocol: "OpenAI API".to_string(),
                endpoints: vec![
                    "POST /v1/chat/completions".to_string(),
                    "GET /v1/models".to_string(),
                ],
                auth_required: true,
                env_vars: vec!["ZHIPU_API_KEY".to_string(), "LLM_LINK_API_KEY".to_string()],
                example_usage: "codex --profile glm_4_flash \"Write a Python function\"".to_string(),
            },
            SupportedApp::ClaudeCode => AppInfo {
                name: "Claude Code".to_string(),
                description: "Anthropic Claude for code generation and analysis".to_string(),
                port: 8089,
                protocol: "Anthropic API".to_string(),
                endpoints: vec![
                    "POST /anthropic/messages".to_string(),
                    "GET /anthropic/models".to_string(),
                ],
                auth_required: true,
                env_vars: vec!["ZHIPU_API_KEY".to_string(), "ANTHROPIC_API_KEY".to_string()],
                example_usage: "claude-code --model claude-3 \"Analyze this code\"".to_string(),
            },
            SupportedApp::ZedDev => AppInfo {
                name: "Zed.dev".to_string(),
                description: "Zed editor with AI assistant integration".to_string(),
                port: 11434,
                protocol: "Ollama API".to_string(),
                endpoints: vec![
                    "POST /api/chat".to_string(),
                    "GET /api/tags".to_string(),
                ],
                auth_required: false,
                env_vars: vec!["ZHIPU_API_KEY".to_string()],
                example_usage: "Configure in Zed settings: \"api_url\": \"http://localhost:11434\"".to_string(),
            },
            SupportedApp::Dual => AppInfo {
                name: "Dual Protocol".to_string(),
                description: "Both OpenAI and Ollama APIs enabled".to_string(),
                port: 11434,
                protocol: "OpenAI + Ollama".to_string(),
                endpoints: vec![
                    "POST /v1/chat/completions".to_string(),
                    "GET /v1/models".to_string(),
                    "POST /ollama/api/chat".to_string(),
                    "GET /ollama/api/tags".to_string(),
                ],
                auth_required: true,
                env_vars: vec!["ZHIPU_API_KEY".to_string(), "LLM_LINK_API_KEY".to_string()],
                example_usage: "Supports both OpenAI and Ollama clients simultaneously".to_string(),
            },
        }
    }
}

/// 应用信息结构
#[derive(Debug, Clone)]
pub struct AppInfo {
    pub name: String,
    pub description: String,
    pub port: u16,
    pub protocol: String,
    pub endpoints: Vec<String>,
    pub auth_required: bool,
    pub env_vars: Vec<String>,
    pub example_usage: String,
}

/// 环境变量检查器
pub struct EnvChecker;

impl EnvChecker {
    /// 检查应用所需的环境变量
    pub fn check_env_vars(app: &SupportedApp) -> Result<(), Vec<String>> {
        let mut missing_vars = Vec::new();

        // 所有应用都需要 ZHIPU_API_KEY
        if std::env::var("ZHIPU_API_KEY").is_err() {
            missing_vars.push("ZHIPU_API_KEY".to_string());
        }

        // 检查应用特定的环境变量
        match app {
            SupportedApp::CodexCLI | SupportedApp::Dual => {
                if std::env::var("LLM_LINK_API_KEY").is_err() {
                    missing_vars.push("LLM_LINK_API_KEY".to_string());
                }
            },
            SupportedApp::ClaudeCode => {
                if std::env::var("ANTHROPIC_API_KEY").is_err() {
                    missing_vars.push("ANTHROPIC_API_KEY".to_string());
                }
            },
            SupportedApp::ZedDev => {
                // Zed.dev 只需要 ZHIPU_API_KEY
            },
        }

        if missing_vars.is_empty() {
            Ok(())
        } else {
            Err(missing_vars)
        }
    }

    /// 显示环境变量设置指南
    pub fn show_env_guide(app: &SupportedApp) {
        println!("🔧 Environment Variables Required for {}:", app.name());
        println!();

        match app {
            SupportedApp::CodexCLI => {
                println!("export ZHIPU_API_KEY=\"your-zhipu-api-key\"");
                println!("export LLM_LINK_API_KEY=\"your-auth-token\"");
                println!();
                println!("💡 The LLM_LINK_API_KEY can be any string you choose for authentication.");
            },
            SupportedApp::ZedDev => {
                println!("export ZHIPU_API_KEY=\"your-zhipu-api-key\"");
                println!();
                println!("💡 Zed.dev doesn't require additional authentication tokens.");
            },
            SupportedApp::ClaudeCode => {
                println!("export ZHIPU_API_KEY=\"your-zhipu-api-key\"");
                println!("export ANTHROPIC_API_KEY=\"your-anthropic-api-key\"");
                println!();
                println!("💡 You need both Zhipu and Anthropic API keys for Claude Code mode.");
            },
            SupportedApp::Dual => {
                println!("export ZHIPU_API_KEY=\"your-zhipu-api-key\"");
                println!("export LLM_LINK_API_KEY=\"your-auth-token\"");
                println!();
                println!("💡 Dual mode supports both OpenAI and Ollama protocols.");
            },
        }
    }
}
