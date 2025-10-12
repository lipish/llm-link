mod config;
mod llm_service;
mod llm_connector;
mod handlers;

use anyhow::Result;
use axum::{
    http::HeaderValue,
    middleware,
    routing::{get, post},
    Router,
};
use clap::Parser;
use config::Config;
use handlers::{AppState, health_check};
use std::net::SocketAddr;
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
use tracing::{info, Level};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Parser, Debug)]
#[command(name = "llm-link")]
#[command(about = "A configurable LLM proxy service", long_about = None)]
struct Args {
    /// Configuration file path
    #[arg(short, long)]
    config: Option<String>,

    /// Host to bind to
    #[arg(long, default_value = "127.0.0.1")]
    host: Option<String>,

    /// Port to bind to
    #[arg(short, long, default_value = "8080")]
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

    // Load configuration
    let mut config = if let Some(config_path) = args.config {
        Config::from_file(config_path)?
    } else {
        Config::load()?
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

    info!("Starting LLM Link proxy service");
    info!("Server will bind to {}:{}", config.server.host, config.server.port);

    // Initialize LLM service
    let llm_service = llm_service::LlmService::from_config(&config.llm_backend)?;
    let app_state = AppState {
        llm_service: std::sync::Arc::new(llm_service),
    };

    // Build the application
    let app = build_app(app_state, &config);

    // Start the server
    let bind_addr = format!("{}:{}", config.server.host, config.server.port);
    let listener = tokio::net::TcpListener::bind(&bind_addr).await?;

    info!("LLM Link proxy is listening on {}", bind_addr);

    // For now, just test if we can build successfully
    println!("Server setup completed successfully!");

    Ok(())
}

fn build_app(state: AppState, config: &Config) -> Router<AppState> {
    let mut app = Router::new()
        .route("/health", get(health_check))
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any)),
        )
        .with_state(state);

    // Add Ollama API endpoints
    if let Some(ollama_config) = &config.apis.ollama {
        if ollama_config.enabled {
            info!("Enabling Ollama API on path: {}", ollama_config.path);
            app = app
                .route(&format!("{}/api/generate", ollama_config.path), post(handlers::ollama_generate))
                .route(&format!("{}/api/chat", ollama_config.path), post(handlers::ollama_chat))
                .route(&format!("{}/api/tags", ollama_config.path), get(handlers::ollama_tags))
                .route(&format!("{}/api/show", ollama_config.path), get(handlers::ollama_show))
                .route(&format!("{}/api/version", ollama_config.path), get(|| async {
                    axum::Json(serde_json::json!({
                        "version": "0.1.0",
                        "build": "llm-link"
                    }))
                }));
        }
    }

    // Add OpenAI-compatible API endpoints
    if let Some(openai_config) = &config.apis.openai {
        if openai_config.enabled {
            info!("Enabling OpenAI API on path: {}", openai_config.path);
            app = app
                .route(&format!("{}/chat/completions", openai_config.path), post(handlers::openai_chat))
                .route(&format!("{}/models", openai_config.path), get(handlers::openai_models))
                .route(&format!("{}/models/:model", openai_config.path), get(handlers::openai_models));
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

    app
}
