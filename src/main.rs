mod adapters;
mod apps;
mod config;
mod service;
mod client;
mod handlers;
mod models;

use anyhow::Result;
use axum::{
    routing::{get, post},
    Router,
    extract::Request,
    response::Response,
};
use clap::Parser;
use config::Config;
use handlers::{AppState, health_check};
// use std::net::SocketAddr;
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
    classify::ServerErrorsFailureClass,
};
use tracing::{info, error, Span};
use std::time::Duration;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use apps::{SupportedApp, AppInfoProvider};

#[derive(Parser, Debug)]
#[command(name = "llm-link")]
#[command(about = "A configurable LLM proxy service", long_about = None)]
struct Args {
    /// Application mode (codex-cli, zed-dev, claude-code)
    #[arg(short, long)]
    app: Option<String>,

    /// Enable multiple protocols (comma-separated: openai,ollama,anthropic)
    #[arg(long)]
    protocols: Option<String>,

    /// List available applications
    #[arg(long)]
    list_apps: bool,

    /// Show application information
    #[arg(long)]
    app_info: Option<String>,

    /// API key for LLM Link authentication (overrides LLM_LINK_API_KEY env var)
    #[arg(long)]
    api_key: Option<String>,

    /// Host to bind to (if provided overrides config)
    #[arg(long)]
    host: Option<String>,

    /// Port to bind to (if provided overrides config)
    #[arg(short, long)]
    port: Option<u16>,

    /// Log level
    #[arg(long, default_value = "info")]
    log_level: Option<String>,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();

    // Initialize logging
    let log_level = args.log_level.clone()
        .or_else(|| std::env::var("LLM_LINK_LOG_LEVEL").ok())
        .unwrap_or_else(|| "info".to_string());

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| tracing_subscriber::EnvFilter::new(log_level)),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Handle special CLI modes first
    if args.list_apps {
        list_applications();
        return Ok(());
    }

    if let Some(app_name) = args.app_info {
        show_application_info(&app_name);
        return Ok(());
    }

    // Load configuration - Application mode only
    let (mut config, config_source) = if let Some(app_name) = args.app {
        // Application mode
        use apps::{SupportedApp, AppConfigGenerator, EnvChecker};

        let app = SupportedApp::from_str(&app_name)
            .ok_or_else(|| anyhow::anyhow!("Unknown application: {}. Use --list-apps to see available applications.", app_name))?;

        info!("🚀 Starting in {} mode", app.name());

        // Check environment variables
        if let Err(missing_vars) = EnvChecker::check_env_vars(&app, args.api_key.as_deref()) {
            error!("❌ Missing required environment variables:");
            for var in &missing_vars {
                error!("   - {}", var);
            }
            error!("");
            EnvChecker::show_env_guide(&app);
            return Err(anyhow::anyhow!("Missing required environment variables"));
        }

        let config = AppConfigGenerator::generate_config(&app, args.api_key.as_deref());
        (config, format!("built-in: {}", app.name()))
    } else if let Some(protocols_str) = args.protocols {
        // Protocol combination mode
        use apps::AppConfigGenerator;

        let protocols: Vec<String> = protocols_str
            .split(',')
            .map(|s| s.trim().to_string())
            .collect();

        if protocols.is_empty() {
            return Err(anyhow::anyhow!("No protocols specified. Use --protocols openai,ollama,anthropic"));
        }

        info!("🚀 Starting with protocols: {}", protocols.join(", "));

        // Check environment variables for protocol combination
        let mut missing_vars = Vec::new();

        // Always need ZHIPU_API_KEY
        if std::env::var("ZHIPU_API_KEY").is_err() {
            missing_vars.push("ZHIPU_API_KEY".to_string());
        }

        // Check protocol-specific requirements
        for protocol in &protocols {
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
                    return Err(anyhow::anyhow!("Unknown protocol: {}. Supported: openai, ollama, anthropic", protocol));
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

        let config = AppConfigGenerator::generate_protocol_config(&protocols, args.api_key.as_deref());
        (config, format!("protocols: {}", protocols.join(", ")))
    } else {
        return Err(anyhow::anyhow!(
            "Application mode required. Use --app <app-name> or --protocols <protocols>.\n\
             Available applications: codex-cli, zed-dev, claude-code\n\
             Use --list-apps for more information."
        ));
    };

    // Override with command line arguments
    if let Some(host) = args.host {
        config.server.host = host;
    }
    if let Some(port) = args.port {
        config.server.port = port;
    }
    if let Some(log_level) = args.log_level {
        config.server.log_level = log_level;
    }

    info!("🚀 Starting LLM Link proxy service");
    info!("🌐 Server will bind to {}:{}", config.server.host, config.server.port);
    info!("📋 Configuration loaded from: {}", config_source);

    // Log enabled APIs
    if let Some(ollama_config) = &config.apis.ollama {
        if ollama_config.enabled {
            info!("🦙 Ollama API enabled on path: {}", ollama_config.path);
            if ollama_config.api_key.is_some() {
                info!("🔐 Ollama API key authentication: ENABLED");
            } else {
                info!("🔓 Ollama API key authentication: DISABLED");
            }
        }
    }

    // Initialize LLM service
    info!("🔧 Initializing LLM service...");
    let llm_service = service::Service::from_config(&config.llm_backend)?;
    info!("✅ LLM service initialized successfully");

    let app_state = AppState::new(llm_service, config.clone());

    // Build the application
    info!("🏗️ Building application routes...");
    let app = build_app(app_state, &config)
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(|request: &Request<_>| {
                    info!("🌐 ======================================");
                    info!("🌐 Incoming request: {} {}", request.method(), request.uri());
                    info!("📋 Full URI: {}", request.uri());
                    info!("📋 Headers: {:?}", request.headers());
                    info!("📋 User-Agent: {:?}", request.headers().get("user-agent"));
                    info!("📋 Host: {:?}", request.headers().get("host"));
                    info!("📋 Accept: {:?}", request.headers().get("accept"));
                    info!("📋 Content-Type: {:?}", request.headers().get("content-type"));
                    info!("📋 Content-Length: {:?}", request.headers().get("content-length"));
                    info!("======================================");
                    tracing::info_span!(
                        "http_request",
                        method = %request.method(),
                        uri = %request.uri(),
                        version = ?request.version(),
                    )
                })
                .on_request(|_request: &Request<_>, _span: &Span| {
                    info!("🚀 Processing request...");
                })
                .on_response(|response: &Response<_>, latency: Duration, _span: &Span| {
                    info!("✅ Response: {} (took {:?})", response.status(), latency);
                })
                .on_failure(|error: ServerErrorsFailureClass, latency: Duration, _span: &Span| {
                    error!("❌ Request failed: {:?} (took {:?})", error, latency);
                })
        );

    // Start the server
    let bind_addr = format!("{}:{}", config.server.host, config.server.port);
    info!("🔌 Binding to address: {}", bind_addr);
    let listener = tokio::net::TcpListener::bind(&bind_addr).await?;

    info!("🎉 LLM Link proxy is listening on {}", bind_addr);
    info!("📡 Ready to accept connections!");
    info!("👀 Monitoring for incoming requests...");

    // Serve the app (axum 0.7) with concrete state applied
    axum::serve(listener, app).await?;

    Ok(())
}

/// 列出所有支持的应用
fn list_applications() {
    println!("🚀 LLM Link - Supported Applications");
    println!();

    for app in SupportedApp::all() {
        let info = AppInfoProvider::get_app_info(&app);
        println!("📱 {}", info.name);
        println!("   Description: {}", info.description);
        println!("   Port: {}", info.port);
        println!("   Protocol: {}", info.protocol);
        println!("   Auth Required: {}", if info.auth_required { "Yes" } else { "No" });
        println!("   Usage: ./target/release/llm-link --app {}", app.name());
        println!();
    }

    println!("🔗 Protocol Combinations:");
    println!("   ./target/release/llm-link --protocols openai,ollama");
    println!("   ./target/release/llm-link --protocols openai,anthropic");
    println!("   ./target/release/llm-link --protocols openai,ollama,anthropic");
    println!();

    println!("💡 Examples:");
    println!("   ./target/release/llm-link --app codex-cli");
    println!("   ./target/release/llm-link --app zed-dev");
    println!("   ./target/release/llm-link --app claude-code");
    println!("   ./target/release/llm-link --protocols openai,ollama");
    println!();
    println!("🔧 For environment variable requirements:");
    println!("   ./target/release/llm-link --app-info <app-name>");
}

/// 显示特定应用的信息
fn show_application_info(app_name: &str) {
    if let Some(app) = SupportedApp::from_str(app_name) {
        let info = AppInfoProvider::get_app_info(&app);

        println!("📱 {} Configuration", info.name);
        println!("   Description: {}", info.description);
        println!("   Port: {}", info.port);
        println!("   Protocol: {}", info.protocol);
        println!("   Endpoints: {}", info.endpoints.join(", "));
        println!("   Auth Required: {}", if info.auth_required { "Yes" } else { "No" });
        println!();

        use apps::EnvChecker;
        EnvChecker::show_env_guide(&app);
    } else {
        error!("❌ Unknown application: {}", app_name);
        println!();
        println!("Available applications:");
        for app in SupportedApp::all() {
            println!("  - {}", app.name());
        }
    }
}

fn build_app(state: AppState, config: &Config) -> Router {
    let mut app = Router::new()
        .route("/", get(|| {
            info!("🏠 Root endpoint accessed");
            async { "Ollama is running" }
        }))
        .route("/health", get(|| {
            info!("🏥 Health check endpoint accessed");
            async { health_check().await }
        }))
        .route("/debug", get(|| {
            info!("🐛 Debug endpoint accessed");
            async { handlers::debug_test().await }
        }))
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any)),
        );

    // Add Ollama API endpoints
    if let Some(ollama_config) = &config.apis.ollama {
        if ollama_config.enabled {
            info!("Enabling Ollama API on path: {}", ollama_config.path);
            app = app
                .route(&format!("{}/api/generate", ollama_config.path), post(handlers::ollama_generate))
                .route(&format!("{}/api/chat", ollama_config.path), post(handlers::ollama::chat))
                .route(&format!("{}/api/tags", ollama_config.path), get(handlers::ollama::models))
                .route(&format!("{}/api/show", ollama_config.path), post(handlers::ollama_show))
                .route(&format!("{}/api/version", ollama_config.path), get(|| async {
                    axum::Json(serde_json::json!({
                        "version": "0.1.0",
                        "build": "llm-link"
                    }))
                }))
                .route(&format!("{}/api/ps", ollama_config.path), get(handlers::ollama_ps));
        }
    }

    // Add OpenAI-compatible API endpoints
    if let Some(openai_config) = &config.apis.openai {
        if openai_config.enabled {
            info!("Enabling OpenAI API on path: {}", openai_config.path);
            app = app
                .route(&format!("{}/chat/completions", openai_config.path), post(handlers::openai::chat))
                .route(&format!("{}/models", openai_config.path), get(handlers::openai::models))
                .route(&format!("{}/models/:model", openai_config.path), get(handlers::openai::models));
        }
    }

    // Add Anthropic API endpoints
    if let Some(anthropic_config) = &config.apis.anthropic {
        if anthropic_config.enabled {
            info!("Enabling Anthropic API on path: {}", anthropic_config.path);
            app = app
                .route(&format!("{}/v1/messages", anthropic_config.path), post(handlers::anthropic_messages))
                .route(&format!("{}/v1/models", anthropic_config.path), get(handlers::anthropic_models));
        }
    }

    // Add catch-all route for debugging
    app = app.fallback(|request: axum::extract::Request| async move {
        error!("🚫 ======================================");
        error!("🚫 UNMATCHED ROUTE ACCESSED!");
        error!("🚫 Method: {}", request.method());
        error!("🚫 URI: {}", request.uri());
        error!("🚫 Full URI: {}", request.uri());
        error!("🚫 Headers: {:?}", request.headers());
        error!("🚫 User-Agent: {:?}", request.headers().get("user-agent"));
        error!("🚫 Host: {:?}", request.headers().get("host"));
        error!("🚫 Accept: {:?}", request.headers().get("accept"));
        error!("🚫 Content-Type: {:?}", request.headers().get("content-type"));
        error!("🚫 Content-Length: {:?}", request.headers().get("content-length"));
        error!("🚫 ======================================");
        axum::http::StatusCode::NOT_FOUND
    });

    // Apply concrete state at the end so the resulting type is Router<()>
    app.with_state(state)
}


