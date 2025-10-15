use serde::{Deserialize, Serialize};
// removed unused import

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub server: ServerConfig,
    pub llm_backend: LlmBackendConfig,
    pub apis: ApiConfigs,
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
    Aliyun {
        api_key: String,
        model: String,
    },
    Zhipu {
        api_key: String,
        base_url: Option<String>,
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
    pub api_key: Option<String>,
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
                    api_key: None,
                }),
            },
        }
    }
}

impl Config {
    pub fn from_file<P: AsRef<std::path::Path>>(path: P) -> anyhow::Result<Self> {
        let content = std::fs::read_to_string(path)?;
        let config: Config = serde_yaml::from_str(&content)?;
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

    pub fn load() -> anyhow::Result<Self> {
        if let Ok(config_path) = std::env::var("LLM_LINK_CONFIG") {
            Self::from_file(config_path)
        } else {
            // Try default config locations (now in configs directory)
            let default_paths = [
                "./configs/llm-link.yaml",
                "./configs/config.yaml",
                "./configs/llm-link.yml",
                "./configs/config.yml",
                // Fallback to old locations for backward compatibility
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

    /// Load configuration and return both config and source path
    pub fn load_with_source() -> anyhow::Result<(Self, String)> {
        if let Ok(config_path) = std::env::var("LLM_LINK_CONFIG") {
            let config = Self::from_file(&config_path)?;
            Ok((config, format!("environment variable: {}", config_path)))
        } else {
            // Try default config locations (now in configs directory)
            let default_paths = [
                "./configs/llm-link.yaml",
                "./configs/config.yaml",
                "./configs/llm-link.yml",
                "./configs/config.yml",
                // Fallback to old locations for backward compatibility
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
            Ok((config, "environment variables/defaults".to_string()))
        }
    }
}