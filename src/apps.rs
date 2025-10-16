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
}

impl SupportedApp {
    /// 从字符串解析应用类型
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "codex-cli" | "codex" => Some(Self::CodexCLI),
            "claude-code" | "claude" => Some(Self::ClaudeCode),
            "zed-dev" | "zed" => Some(Self::ZedDev),
            _ => None,
        }
    }

    /// 获取应用名称
    pub fn name(&self) -> &'static str {
        match self {
            Self::CodexCLI => "codex-cli",
            Self::ClaudeCode => "claude-code",
            Self::ZedDev => "zed-dev",
        }
    }

    /// 获取所有支持的应用
    pub fn all() -> Vec<Self> {
        vec![
            Self::CodexCLI,
            Self::ClaudeCode,
            Self::ZedDev,
        ]
    }
}

/// 应用配置生成器
pub struct AppConfigGenerator;

impl AppConfigGenerator {
    /// 为指定应用生成配置
    pub fn generate_config(app: &SupportedApp, cli_api_key: Option<&str>) -> Config {
        match app {
            SupportedApp::CodexCLI => Self::codex_cli_config(cli_api_key),
            SupportedApp::ClaudeCode => Self::claude_code_config(cli_api_key),
            SupportedApp::ZedDev => Self::zed_dev_config(cli_api_key),
        }
    }

    /// 解析环境变量模板，支持 CLI 参数覆盖
    fn resolve_env_var(template: &str, cli_api_key: Option<&str>) -> String {
        if template.starts_with("${") && template.ends_with("}") {
            let var_name = &template[2..template.len()-1];

            // 如果是 LLM_LINK_API_KEY 且提供了 CLI 参数，优先使用 CLI 参数
            if var_name == "LLM_LINK_API_KEY" {
                if let Some(cli_key) = cli_api_key {
                    return cli_key.to_string();
                }
            }

            // 否则尝试从环境变量获取
            std::env::var(var_name).unwrap_or_else(|_| {
                eprintln!("Warning: Environment variable '{}' not found, using placeholder", var_name);
                template.to_string()
            })
        } else {
            template.to_string()
        }
    }

    /// Codex CLI 配置
    fn codex_cli_config(cli_api_key: Option<&str>) -> Config {
        Config {
            server: ServerConfig {
                host: "0.0.0.0".to_string(),
                port: 8088,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendConfig::Zhipu {
                api_key: Self::resolve_env_var("${ZHIPU_API_KEY}", cli_api_key),
                base_url: Some("https://open.bigmodel.cn/api/paas/v4".to_string()),
                model: "glm-4-flash".to_string(),
            },
            apis: ApiConfigs {
                openai: Some(OpenAiApiConfig {
                    enabled: true,
                    path: "/v1".to_string(),
                    api_key_header: Some("Authorization".to_string()),
                    api_key: Some(Self::resolve_env_var("${LLM_LINK_API_KEY}", cli_api_key)),
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
    fn zed_dev_config(cli_api_key: Option<&str>) -> Config {
        Config {
            server: ServerConfig {
                host: "0.0.0.0".to_string(),
                port: 11434,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendConfig::Zhipu {
                api_key: Self::resolve_env_var("${ZHIPU_API_KEY}", cli_api_key),
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
    fn claude_code_config(cli_api_key: Option<&str>) -> Config {
        Config {
            server: ServerConfig {
                host: "0.0.0.0".to_string(),
                port: 8089,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendConfig::Zhipu {
                api_key: Self::resolve_env_var("${ZHIPU_API_KEY}", cli_api_key),
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


    /// 生成多协议配置
    pub fn generate_protocol_config(protocols: &[String], cli_api_key: Option<&str>) -> Config {
        let mut openai_config = None;
        let mut ollama_config = None;
        let mut anthropic_config = None;

        // 根据协议列表启用相应的 API
        for protocol in protocols {
            match protocol.to_lowercase().as_str() {
                "openai" => {
                    openai_config = Some(OpenAiApiConfig {
                        enabled: true,
                        path: "/v1".to_string(),
                        api_key_header: Some("Authorization".to_string()),
                        api_key: Some(Self::resolve_env_var("${LLM_LINK_API_KEY}", cli_api_key)),
                    });
                },
                "ollama" => {
                    ollama_config = Some(OllamaApiConfig {
                        enabled: true,
                        path: "/ollama".to_string(),
                        api_key_header: None,
                        api_key: None,
                    });
                },
                "anthropic" => {
                    anthropic_config = Some(AnthropicApiConfig {
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

        Config {
            server: ServerConfig {
                host: "0.0.0.0".to_string(),
                port: 11434,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendConfig::Zhipu {
                api_key: Self::resolve_env_var("${ZHIPU_API_KEY}", cli_api_key),
                base_url: Some("https://open.bigmodel.cn/api/paas/v4".to_string()),
                model: "glm-4-flash".to_string(),
            },
            apis: ApiConfigs {
                openai: openai_config,
                ollama: ollama_config,
                anthropic: anthropic_config,
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
    /// 检查应用所需的环境变量，考虑 CLI 参数
    pub fn check_env_vars(app: &SupportedApp, cli_api_key: Option<&str>) -> Result<(), Vec<String>> {
        let app_info = AppInfoProvider::get_app_info(app);
        let mut missing_vars = Vec::new();

        // 检查应用所需的所有环境变量
        for env_var in &app_info.env_vars {
            // 特殊处理 LLM_LINK_API_KEY：如果提供了 CLI 参数，则不需要环境变量
            if env_var == "LLM_LINK_API_KEY" && cli_api_key.is_some() {
                continue;
            }

            // 检查环境变量是否存在
            if std::env::var(env_var).is_err() {
                missing_vars.push(env_var.clone());
            }
        }

        if missing_vars.is_empty() {
            Ok(())
        } else {
            Err(missing_vars)
        }
    }

    /// 显示环境变量设置指南
    pub fn show_env_guide(app: &SupportedApp) {
        let app_info = AppInfoProvider::get_app_info(app);

        println!("🔧 Environment Variables Required for {}:", app_info.name);
        println!();

        // 显示所有必需的环境变量
        for env_var in &app_info.env_vars {
            match env_var.as_str() {
                "ZHIPU_API_KEY" => println!("export ZHIPU_API_KEY=\"your-zhipu-api-key\""),
                "LLM_LINK_API_KEY" => println!("export LLM_LINK_API_KEY=\"your-auth-token\""),
                "ANTHROPIC_API_KEY" => println!("export ANTHROPIC_API_KEY=\"your-anthropic-api-key\""),
                _ => println!("export {}=\"your-{}-here\"", env_var, env_var.to_lowercase().replace('_', "-")),
            }
        }
        println!();

        // 应用特定的提示
        match app {
            SupportedApp::CodexCLI => {
                println!("💡 Alternative: Use CLI parameter instead of environment variable:");
                println!("   ./target/release/llm-link --app codex-cli --api-key \"your-auth-token\"");
                println!();
                println!("💡 The LLM_LINK_API_KEY can be any string you choose for authentication.");
            },
            SupportedApp::ZedDev => {
                println!("💡 Zed.dev doesn't require additional authentication tokens.");
            },
            SupportedApp::ClaudeCode => {
                println!("💡 You need both Zhipu and Anthropic API keys for Claude Code mode.");
            },
        }

        println!();
        println!("🚀 Start command:");
        println!("   ./target/release/llm-link --app {}", app.name());
        println!();
        println!("📖 Example usage:");
        println!("   {}", app_info.example_usage);
        println!();
    }
}
