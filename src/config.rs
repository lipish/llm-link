use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub server: ServerConfig,
    pub llm_backend: LlmBackendConfig,
    pub apis: ApiConfigs,
    pub client_adapters: Option<ClientAdapterConfigs>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServerConfig {
    pub host: String,
    pub port: u16,
    pub log_level: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum LlmBackendConfig {
    OpenAI {
        api_key: String,
        base_url: Option<String>,
        model: String,
    },
    Anthropic {
        api_key: String,
        model: String,
    },
    Ollama {
        base_url: Option<String>,
        model: String,
    },
    Zhipu {
        api_key: String,
        base_url: Option<String>,
        model: String,
    },
    Aliyun {
        api_key: String,
        model: String,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ApiConfigs {
    pub ollama: Option<OllamaApiConfig>,
    pub openai: Option<OpenAiApiConfig>,
    pub anthropic: Option<AnthropicApiConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClientAdapterConfigs {
    /// 默认客户端适配模式
    pub default_adapter: Option<String>,
    /// 强制客户端适配模式（忽略自动检测）
    pub force_adapter: Option<String>,
    /// Zed.dev 特定配置
    pub zed: Option<ZedAdapterConfig>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ZedAdapterConfig {
    /// 是否启用 Zed.dev 适配
    pub enabled: bool,
    /// 是否强制添加 images 字段
    pub force_images_field: Option<bool>,
    /// 首选响应格式
    pub preferred_format: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OllamaApiConfig {
    pub enabled: bool,
    pub path: String,
    pub api_key_header: Option<String>,
    pub api_key: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpenAiApiConfig {
    pub enabled: bool,
    pub path: String,
    pub api_key_header: Option<String>,
    pub api_key: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AnthropicApiConfig {
    pub enabled: bool,
    pub path: String,
    pub api_key_header: Option<String>,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            server: ServerConfig {
                host: "127.0.0.1".to_string(),
                port: 8080,
                log_level: "info".to_string(),
            },
            llm_backend: LlmBackendConfig::Ollama {
                base_url: Some("http://localhost:11434".to_string()),
                model: "llama2".to_string(),
            },
            apis: ApiConfigs {
                ollama: Some(OllamaApiConfig {
                    enabled: true,
                    path: "/ollama".to_string(),
                    api_key_header: None,
                    api_key: None,
                }),
                openai: Some(OpenAiApiConfig {
                    enabled: true,
                    path: "/v1".to_string(),
                    api_key_header: None,
                    api_key: None,
                }),
                anthropic: Some(AnthropicApiConfig {
                    enabled: true,
                    path: "/anthropic".to_string(),
                    api_key_header: None,
                }),
            },
            client_adapters: None,
        }
    }
}

impl Config {
    pub fn from_file<P: AsRef<std::path::Path>>(path: P) -> anyhow::Result<Self> {
        let content = std::fs::read_to_string(path)?;
        // 替换环境变量
        let expanded_content = expand_env_vars(&content)?;
        let config: Config = serde_yaml::from_str(&expanded_content)?;
        Ok(config)
    }

    pub fn from_env() -> anyhow::Result<Self> {
        let mut config = Config::default();

        if let Ok(host) = std::env::var("LLM_LINK_HOST") {
            config.server.host = host;
        }

        if let Ok(port) = std::env::var("LLM_LINK_PORT") {
            config.server.port = port.parse()?;
        }

        if let Ok(log_level) = std::env::var("LLM_LINK_LOG_LEVEL") {
            config.server.log_level = log_level;
        }

        Ok(config)
    }

    #[allow(dead_code)]
    pub fn load() -> anyhow::Result<Self> {
        if let Ok(config_path) = std::env::var("LLM_LINK_CONFIG") {
            Self::from_file(config_path)
        } else {
            // Try default config locations
            let default_paths = [
                "./llm-link.yaml",
                "./config.yaml",
                "./llm-link.yml",
                "./config.yml",
            ];

            for path in default_paths.iter() {
                if std::path::Path::new(path).exists() {
                    return Self::from_file(path);
                }
            }

            // Fallback to environment variables or defaults
            Self::from_env()
        }
    }

    pub fn load_with_source() -> anyhow::Result<(Self, String)> {
        if let Ok(config_path) = std::env::var("LLM_LINK_CONFIG") {
            let config = Self::from_file(&config_path)?;
            Ok((config, config_path))
        } else {
            // Try default config locations
            let default_paths = [
                "configs/llm-link.yaml",
                "./llm-link.yaml",
                "./config.yaml",
                "./llm-link.yml",
                "./config.yml",
            ];

            for path in default_paths.iter() {
                if std::path::Path::new(path).exists() {
                    let config = Self::from_file(path)?;
                    return Ok((config, path.to_string()));
                }
            }

            // Fallback to environment variables or defaults
            let config = Self::from_env()?;
            Ok((config, "environment variables".to_string()))
        }
    }
}

/// 展开配置文件中的环境变量
/// 支持 ${VAR_NAME} 格式
fn expand_env_vars(content: &str) -> anyhow::Result<String> {
    let mut result = content.to_string();

    // 收集所有环境变量
    let env_vars: HashMap<String, String> = std::env::vars().collect();

    // 替换 ${VAR_NAME} 格式
    let re_braces = regex::Regex::new(r"\$\{([A-Za-z_][A-Za-z0-9_]*)\}").unwrap();

    // 使用 replace_all 的字符串版本来避免生命周期问题
    for caps in re_braces.captures_iter(content) {
        let full_match = &caps[0];
        let var_name = &caps[1];

        if let Some(env_value) = env_vars.get(var_name) {
            result = result.replace(full_match, env_value);
        } else {
            eprintln!("Warning: Environment variable '{}' not found, keeping placeholder", var_name);
        }
    }

    Ok(result)
}