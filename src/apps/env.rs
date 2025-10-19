use super::SupportedApp;
use super::info::AppInfoProvider;

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
            SupportedApp::Zed => {
                println!("💡 Zed doesn't require additional authentication tokens.");
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

