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

/// Supported application types
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SupportedApp {
    /// Codex CLI - OpenAI API client
    CodexCLI,
    /// Claude Code - Anthropic client
    ClaudeCode,
    /// Zed - Ollama API client
    Zed,
}

impl SupportedApp {
    /// Parse application type from string
    pub fn from_str(s: &str) -> Option<Self> {
        match s.to_lowercase().as_str() {
            "codex-cli" | "codex" => Some(Self::CodexCLI),
            "claude-code" | "claude" => Some(Self::ClaudeCode),
            "zed-dev" | "zed" => Some(Self::Zed),
            _ => None,
        }
    }

    /// Get application name
    pub fn name(&self) -> &'static str {
        match self {
            Self::CodexCLI => "codex-cli",
            Self::ClaudeCode => "claude-code",
            Self::Zed => "zed",
        }
    }

    /// Get all supported applications
    pub fn all() -> Vec<Self> {
        vec![
            Self::CodexCLI,
            Self::ClaudeCode,
            Self::Zed,
        ]
    }
}

/// Application configuration generator
pub struct AppConfigGenerator;

impl AppConfigGenerator {
    /// Generate configuration for specified application
    pub fn generate_config(app: &SupportedApp, cli_api_key: Option<&str>) -> Settings {
        match app {
            SupportedApp::CodexCLI => CodexApp::generate_config(cli_api_key),
            SupportedApp::ClaudeCode => ClaudeApp::generate_config(cli_api_key),
            SupportedApp::Zed => ZedApp::generate_config(),
        }
    }

    /// Generate protocol combination configuration
    pub fn generate_protocol_config(protocols: &[String], cli_api_key: Option<&str>) -> Settings {
        protocol::generate_protocol_config(protocols, cli_api_key)
    }

    /// Resolve environment variable template, supporting CLI parameter override
    pub(crate) fn resolve_env_var(template: &str, cli_api_key: Option<&str>) -> String {
        if template.starts_with("${") && template.ends_with("}") {
            let var_name = &template[2..template.len()-1];

            // If it's LLM_LINK_API_KEY and CLI parameter is provided, prioritize CLI parameter
            if var_name == "LLM_LINK_API_KEY" {
                if let Some(cli_key) = cli_api_key {
                    return cli_key.to_string();
                }
            }

            eprintln!(
                "Warning: Environment variable '{}' ignored. Provide the value via CLI flags (e.g. --api-key).",
                var_name
            );
            String::new()
        } else {
            template.to_string()
        }
    }
}

