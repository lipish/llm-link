use serde::{Deserialize, Serialize};
use std::collections::HashMap;

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
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpenAiApiConfig {
    pub enabled: bool,
    pub path: String,
    pub api_key_header: Option<String>,
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
                }),
                openai: Some(OpenAiApiConfig {
                    enabled: true,
                    path: "/v1".to_string(),
                    api_key_header: None,
                }),
                anthropic: Some(AnthropicApiConfig {
                    enabled: true,
                    path: "/anthropic".to_string(),
                    api_key_header: None,
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
}