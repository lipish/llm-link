use super::SupportedApp;

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

/// 应用信息提供器
pub struct AppInfoProvider;

impl AppInfoProvider {
    /// 获取应用信息
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
                env_vars: vec![
                    "ZHIPU_API_KEY".to_string(),
                    "LLM_LINK_API_KEY".to_string(),
                ],
                example_usage: "codex chat \"Write a function to sort an array\"".to_string(),
            },
            SupportedApp::ClaudeCode => AppInfo {
                name: "Claude Code".to_string(),
                description: "Anthropic Claude for code generation and analysis".to_string(),
                port: 8089,
                protocol: "Anthropic API".to_string(),
                endpoints: vec![
                    "POST /v1/messages".to_string(),
                    "GET /v1/models".to_string(),
                ],
                auth_required: true,
                env_vars: vec![
                    "ANTHROPIC_API_KEY".to_string(),
                ],
                example_usage: "curl -X POST http://localhost:8089/v1/messages".to_string(),
            },
            SupportedApp::Zed => AppInfo {
                name: "Zed".to_string(),
                description: "Zed editor with AI assistant integration".to_string(),
                port: 11434,
                protocol: "Ollama API".to_string(),
                endpoints: vec![
                    "POST /api/chat".to_string(),
                    "POST /api/generate".to_string(),
                    "GET /api/tags".to_string(),
                ],
                auth_required: false,
                env_vars: vec!["ZHIPU_API_KEY".to_string()],
                example_usage: "Configure in Zed settings: \"api_url\": \"http://localhost:11434\"".to_string(),
            },
        }
    }
}

