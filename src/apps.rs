use serde::{Deserialize, Serialize};

/// 支持的应用类型
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum SupportedApp {
    /// Codex CLI - OpenAI API 客户端
    CodexCLI,
    /// Claude Code - Anthropic 客户端
    ClaudeCode,
    /// Zed.dev - Ollama API 客户端
    ZedDev,
    /// 通用 OpenAI 客户端
    OpenAI,
    /// 通用 Ollama 客户端
    Ollama,
    /// 自定义配置
    Custom,
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
            SupportedApp::OpenAI => AppInfo {
                name: "OpenAI Compatible".to_string(),
                description: "Any OpenAI API compatible client".to_string(),
                port: 8080,
                protocol: "OpenAI API".to_string(),
                endpoints: vec![
                    "POST /v1/chat/completions".to_string(),
                    "GET /v1/models".to_string(),
                ],
                auth_required: true,
                env_vars: vec!["ZHIPU_API_KEY".to_string(), "LLM_LINK_API_KEY".to_string()],
                example_usage: "curl -H \"Authorization: Bearer $LLM_LINK_API_KEY\" http://localhost:8080/v1/models".to_string(),
            },
            SupportedApp::Ollama => AppInfo {
                name: "Ollama Compatible".to_string(),
                description: "Any Ollama API compatible client".to_string(),
                port: 11434,
                protocol: "Ollama API".to_string(),
                endpoints: vec![
                    "POST /api/chat".to_string(),
                    "GET /api/tags".to_string(),
                ],
                auth_required: false,
                env_vars: vec!["ZHIPU_API_KEY".to_string()],
                example_usage: "curl http://localhost:11434/api/tags".to_string(),
            },
            SupportedApp::Custom => AppInfo {
                name: "Custom Configuration".to_string(),
                description: "User-defined custom configuration".to_string(),
                port: 11434,
                protocol: "Multiple".to_string(),
                endpoints: vec!["User-defined".to_string()],
                auth_required: false,
                env_vars: vec!["User-defined".to_string()],
                example_usage: "Custom usage based on configuration".to_string(),
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
