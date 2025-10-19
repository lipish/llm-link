use clap::Parser;

#[derive(Parser, Debug)]
#[command(name = "llm-link")]
#[command(about = "A configurable LLM proxy service", long_about = None)]
pub struct Args {
    /// Application mode (codex-cli, zed, claude-code)
    #[arg(short, long)]
    pub app: Option<String>,

    /// Enable multiple protocols (comma-separated: openai,ollama,anthropic)
    #[arg(long)]
    pub protocols: Option<String>,

    /// List available applications
    #[arg(long)]
    pub list_apps: bool,

    /// Show application information
    #[arg(long)]
    pub app_info: Option<String>,

    /// API key for LLM Link authentication (overrides LLM_LINK_API_KEY env var)
    #[arg(long)]
    pub api_key: Option<String>,

    /// Override LLM provider (openai, anthropic, zhipu, ollama)
    #[arg(long)]
    pub provider: Option<String>,

    /// Override LLM model name
    #[arg(long)]
    pub model: Option<String>,

    /// LLM provider API key (overrides provider-specific env vars)
    #[arg(long)]
    pub llm_api_key: Option<String>,

    /// Host to bind to (if provided overrides config)
    #[arg(long)]
    pub host: Option<String>,

    /// Port to bind to (if provided overrides config)
    #[arg(short, long)]
    pub port: Option<u16>,

    /// Log level
    #[arg(long, default_value = "info")]
    pub log_level: Option<String>,
}

