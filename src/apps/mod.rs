mod codex;
mod claude;
mod zed;
mod info;
mod protocol;

use serde::{Deserialize, Serialize};
use crate::settings::Settings;

pub use info::AppInfoProvider;

// Re-export app-specific modules
pub use codex::CodexApp;
pub use claude::ClaudeApp;
pub use zed::ZedApp;

/// 支持的应用类型
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SupportedApp {
    /// Codex CLI - OpenAI API 客户端
    CodexCLI,
    /// Claude Code - Anthropic 客户端
    ClaudeCode,
    /// Zed - Ollama API 客户端
    Zed,
}

impl SupportedApp {
    /// 从字符串解析应用类型
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "codex-cli" | "codex" => Some(Self::CodexCLI),
            "claude-code" | "claude" => Some(Self::ClaudeCode),
            "zed-dev" | "zed" => Some(Self::Zed),
            _ => None,
        }
    }

    /// 获取应用名称
    pub fn name(&self) -> &'static str {
        match self {
            Self::CodexCLI => "codex-cli",
            Self::ClaudeCode => "claude-code",
            Self::Zed => "zed",
        }
    }

    /// 获取所有支持的应用
    pub fn all() -> Vec<Self> {
        vec![
            Self::CodexCLI,
            Self::ClaudeCode,
            Self::Zed,
        ]
    }
}

/// 应用配置生成器
pub struct AppConfigGenerator;

impl AppConfigGenerator {
    /// 为指定应用生成配置
    pub fn generate_config(app: &SupportedApp, cli_api_key: Option<&str>) -> Settings {
        match app {
            SupportedApp::CodexCLI => CodexApp::generate_config(cli_api_key),
            SupportedApp::ClaudeCode => ClaudeApp::generate_config(cli_api_key),
            SupportedApp::Zed => ZedApp::generate_config(cli_api_key),
        }
    }

    /// 生成协议组合配置
    pub fn generate_protocol_config(protocols: &[String], cli_api_key: Option<&str>) -> Settings {
        protocol::generate_protocol_config(protocols, cli_api_key)
    }

    /// 解析环境变量模板，支持 CLI 参数覆盖
    pub(crate) fn resolve_env_var(template: &str, cli_api_key: Option<&str>) -> String {
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
}

