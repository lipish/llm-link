use anyhow::Result;
use tracing::{info, error};
use crate::settings::Settings;
use crate::apps::{SupportedApp, AppConfigGenerator};
use crate::cli::Args;

pub struct ConfigLoader;

impl ConfigLoader {
    /// 加载配置（应用模式或协议模式）
    pub fn load_config(args: &Args) -> Result<(Settings, String)> {
        if let Some(app_name) = &args.app {
            Self::load_app_config(app_name, args)
        } else if let Some(protocols_str) = &args.protocols {
            Self::load_protocol_config(protocols_str, args)
        } else {
            Err(anyhow::anyhow!(
                "Application mode required. Use --app <app-name> or --protocols <protocols>.\n\
                 Available applications: codex-cli, zed, claude-code\n\
                 Use --list-apps for more information."
            ))
        }
    }

    /// 加载应用模式配置
    fn load_app_config(app_name: &str, args: &Args) -> Result<(Settings, String)> {
        let app = SupportedApp::from_str(app_name)
            .ok_or_else(|| anyhow::anyhow!(
                "Unknown application: {}. Use --list-apps to see available applications.", 
                app_name
            ))?;

        info!("🚀 Starting in {} mode", app.name());

        // Require --provider parameter
        let provider = Self::require_provider(app_name, args)?;

        // Generate base config for the app
        let mut config = AppConfigGenerator::generate_config(&app, args.api_key.as_deref());

        // Apply provider/model overrides (provider is required, model is optional)
        config = Self::apply_provider_overrides(
            config,
            Some(provider),
            args.model.as_deref(),
            args.llm_api_key.as_deref()
        )?;

        let config_source = format!("built-in: {} with provider: {}", app.name(), provider);
        Ok((config, config_source))
    }

    /// 加载协议模式配置
    fn load_protocol_config(protocols_str: &str, args: &Args) -> Result<(Settings, String)> {
        let protocols: Vec<String> = protocols_str
            .split(',')
            .map(|s| s.trim().to_string())
            .collect();

        if protocols.is_empty() {
            return Err(anyhow::anyhow!("No protocols specified. Use --protocols openai,ollama,anthropic"));
        }

        info!("🚀 Starting with protocols: {}", protocols.join(", "));

        // Check environment variables for protocol combination
        Self::check_protocol_env_vars(&protocols, args)?;

        let config = AppConfigGenerator::generate_protocol_config(&protocols, args.api_key.as_deref());
        let config_source = format!("protocols: {}", protocols.join(", "));
        
        Ok((config, config_source))
    }

    /// 要求提供 --provider 参数
    fn require_provider<'a>(app_name: &str, args: &'a Args) -> Result<&'a str> {
        args.provider.as_deref()
            .ok_or_else(|| {
                error!("❌ Missing required parameter: --provider");
                error!("");
                error!("🔧 You must specify which LLM provider to use:");
                error!("   --provider openai      (requires OPENAI_API_KEY)");
                error!("   --provider anthropic   (requires ANTHROPIC_API_KEY)");
                error!("   --provider zhipu       (requires ZHIPU_API_KEY)");
                error!("   --provider aliyun      (requires ALIYUN_API_KEY)");
                error!("   --provider ollama      (no API key needed)");
                error!("");
                error!("💡 Example:");
                error!("   ./llm-link --app {} --provider openai", app_name);
                error!("");
                error!("📚 For more information:");
                error!("   ./llm-link --app-info {}", app_name);
                anyhow::anyhow!("Missing required parameter: --provider")
            })
    }

    /// 检查协议模式的环境变量
    fn check_protocol_env_vars(protocols: &[String], args: &Args) -> Result<()> {
        let mut missing_vars = Vec::new();

        // Always need ZHIPU_API_KEY
        if std::env::var("ZHIPU_API_KEY").is_err() {
            missing_vars.push("ZHIPU_API_KEY".to_string());
        }

        // Check protocol-specific requirements
        for protocol in protocols {
            match protocol.to_lowercase().as_str() {
                "openai" => {
                    if args.api_key.is_none() && std::env::var("LLM_LINK_API_KEY").is_err() {
                        missing_vars.push("LLM_LINK_API_KEY".to_string());
                    }
                },
                "anthropic" => {
                    if std::env::var("ANTHROPIC_API_KEY").is_err() {
                        missing_vars.push("ANTHROPIC_API_KEY".to_string());
                    }
                },
                "ollama" => {
                    // Ollama doesn't require additional env vars
                },
                _ => {
                    return Err(anyhow::anyhow!(
                        "Unknown protocol: {}. Supported: openai, ollama, anthropic", 
                        protocol
                    ));
                }
            }
        }

        if !missing_vars.is_empty() {
            error!("❌ Missing required environment variables for protocols:");
            for var in &missing_vars {
                error!("   - {}", var);
            }
            error!("");
            println!("🔧 Set the required environment variables:");
            for var in &missing_vars {
                match var.as_str() {
                    "ZHIPU_API_KEY" => println!("export ZHIPU_API_KEY=\"your-zhipu-api-key\""),
                    "LLM_LINK_API_KEY" => {
                        println!("export LLM_LINK_API_KEY=\"your-auth-token\"");
                        println!("# OR use: --api-key \"your-auth-token\"");
                    },
                    "ANTHROPIC_API_KEY" => println!("export ANTHROPIC_API_KEY=\"your-anthropic-api-key\""),
                    _ => println!("export {}=\"your-{}-here\"", var, var.to_lowercase().replace('_', "-")),
                }
            }
            return Err(anyhow::anyhow!("Missing required environment variables"));
        }

        Ok(())
    }

    /// 应用 provider 覆盖
    fn apply_provider_overrides(
        mut config: Settings,
        provider: Option<&str>,
        model: Option<&str>,
        llm_api_key: Option<&str>,
    ) -> Result<Settings> {
        use crate::settings::LlmBackendSettings;

        if let Some(provider_name) = provider {
            info!("🔄 Overriding LLM provider to: {}", provider_name);

            // Determine API key
            let api_key = if let Some(key) = llm_api_key {
                Some(key.to_string())
            } else {
                match provider_name {
                    "openai" => std::env::var("OPENAI_API_KEY").ok(),
                    "anthropic" => std::env::var("ANTHROPIC_API_KEY").ok(),
                    "zhipu" => std::env::var("ZHIPU_API_KEY").ok(),
                    "aliyun" => std::env::var("ALIYUN_API_KEY").ok(),
                    "volcengine" => std::env::var("VOLCENGINE_API_KEY").ok(),
                    "tencent" => std::env::var("TENCENT_API_KEY").ok(),
                    "longcat" => std::env::var("LONGCAT_API_KEY").ok(),
                    "moonshot" => std::env::var("MOONSHOT_API_KEY").ok(),
                    "minimax" => std::env::var("MINIMAX_API_KEY").ok(),
                    "ollama" => None,
                    _ => return Err(anyhow::anyhow!("Unknown provider: {}", provider_name)),
                }
            };

            // Check if API key is required but missing
            if provider_name != "ollama" && api_key.is_none() {
                let env_var = match provider_name {
                    "openai" => "OPENAI_API_KEY",
                    "anthropic" => "ANTHROPIC_API_KEY",
                    "zhipu" => "ZHIPU_API_KEY",
                    "aliyun" => "ALIYUN_API_KEY",
                    "volcengine" => "VOLCENGINE_API_KEY",
                    "tencent" => "TENCENT_API_KEY",
                    "longcat" => "LONGCAT_API_KEY",
                    "moonshot" => "MOONSHOT_API_KEY",
                    "minimax" => "MINIMAX_API_KEY",
                    _ => "API_KEY",
                };

                // Warn but allow startup without API key
                // User can set it later via hot-reload API
                tracing::warn!("⚠️  Starting without API key for provider '{}'", provider_name);
                tracing::warn!("⚠️  Set {} environment variable or use --llm-api-key", env_var);
                tracing::warn!("⚠️  Or update API key dynamically via: POST /api/config/update-key");
                tracing::warn!("⚠️  LLM requests will fail until API key is configured");
                tracing::warn!("");
            }

            // Determine model
            let model_name = if let Some(m) = model {
                m.to_string()
            } else {
                // Use provider's default model
                match provider_name {
                    "openai" => "gpt-4".to_string(),
                    "anthropic" => "claude-3-5-sonnet-20241022".to_string(),
                    "zhipu" => "glm-4-flash".to_string(),
                    "aliyun" => "qwen-max".to_string(),
                    "volcengine" => "doubao-pro-32k".to_string(),
                    "tencent" => "hunyuan-lite".to_string(),
                    "longcat" => "LongCat-Flash-Chat".to_string(),
                    "moonshot" => "kimi-k2-turbo-preview".to_string(),
                    "minimax" => "MiniMax-M2".to_string(),
                    "ollama" => "llama2".to_string(),
                    _ => return Err(anyhow::anyhow!("Unknown provider: {}", provider_name)),
                }
            };

            info!("🔄 Using model: {}", model_name);

            // Create new backend settings based on provider
            // Use empty string as placeholder if API key is not provided
            let api_key_value = api_key.unwrap_or_else(|| String::new());

            config.llm_backend = match provider_name {
                "openai" => LlmBackendSettings::OpenAI {
                    api_key: api_key_value,
                    base_url: None,
                    model: model_name,
                },
                "anthropic" => LlmBackendSettings::Anthropic {
                    api_key: api_key_value,
                    model: model_name,
                },
                "zhipu" => LlmBackendSettings::Zhipu {
                    api_key: api_key_value,
                    base_url: Some("https://open.bigmodel.cn/api/paas/v4".to_string()),
                    model: model_name,
                },
                "aliyun" => LlmBackendSettings::Aliyun {
                    api_key: api_key_value,
                    model: model_name,
                },
                "volcengine" => LlmBackendSettings::Volcengine {
                    api_key: api_key_value,
                    model: model_name,
                },
                "tencent" => LlmBackendSettings::Tencent {
                    api_key: api_key_value,
                    model: model_name,
                },
                "longcat" => LlmBackendSettings::Longcat {
                    api_key: api_key_value,
                    model: model_name,
                },
                "moonshot" => LlmBackendSettings::Moonshot {
                    api_key: api_key_value,
                    model: model_name,
                },
                "minimax" => LlmBackendSettings::Minimax {
                    api_key: api_key_value,
                    model: model_name,
                },
                "ollama" => LlmBackendSettings::Ollama {
                    base_url: std::env::var("OLLAMA_BASE_URL").ok()
                        .or(Some("http://localhost:11434".to_string())),
                    model: model_name,
                },
                _ => return Err(anyhow::anyhow!("Unknown provider: {}", provider_name)),
            };
        } else if let Some(model_name) = model {
            // Only model override, keep existing provider
            info!("🔄 Overriding model to: {}", model_name);
            match &mut config.llm_backend {
                LlmBackendSettings::OpenAI { model, .. } => *model = model_name.to_string(),
                LlmBackendSettings::Anthropic { model, .. } => *model = model_name.to_string(),
                LlmBackendSettings::Zhipu { model, .. } => *model = model_name.to_string(),
                LlmBackendSettings::Aliyun { model, .. } => *model = model_name.to_string(),
                LlmBackendSettings::Volcengine { model, .. } => *model = model_name.to_string(),
                LlmBackendSettings::Tencent { model, .. } => *model = model_name.to_string(),
                LlmBackendSettings::Longcat { model, .. } => *model = model_name.to_string(),
                LlmBackendSettings::Moonshot { model, .. } => *model = model_name.to_string(),
                LlmBackendSettings::Minimax { model, .. } => *model = model_name.to_string(),
                LlmBackendSettings::Ollama { model, .. } => *model = model_name.to_string(),
            }
        }

        Ok(config)
    }

    /// 应用命令行参数覆盖
    pub fn apply_cli_overrides(mut config: Settings, args: &Args) -> Settings {
        if let Some(host) = &args.host {
            config.server.host = host.clone();
        }
        if let Some(port) = args.port {
            config.server.port = port;
        }
        if let Some(log_level) = &args.log_level {
            config.server.log_level = log_level.clone();
        }
        config
    }
}

