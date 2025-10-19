mod adapters;
mod apps;
mod settings;
mod service;
mod llm;
mod api;
mod models;
mod cli;

use anyhow::Result;
use axum::{
    routing::{get, post},
    Router,
    extract::Request,
    response::Response,
};
use clap::Parser;
use settings::Settings;
use api::{AppState, health_check};
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
    classify::ServerErrorsFailureClass,
};
use tracing::{info, error, Span};
use std::time::Duration;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use cli::{Args, ConfigLoader, list_applications, show_application_info};

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();

    // Initialize logging
    initialize_logging(&args);

    // Handle special CLI modes first
    if args.list_apps {
        list_applications();
        return Ok(());
    }

    if let Some(app_name) = &args.app_info {
        show_application_info(app_name);
        return Ok(());
    }

    // Load configuration
    let (config, config_source) = ConfigLoader::load_config(&args)?;
    let config = ConfigLoader::apply_cli_overrides(config, &args);

    // Log configuration
    log_configuration(&config, &config_source);

    // Initialize LLM service
    let llm_service = initialize_llm_service(&config)?;
    let app_state = AppState::new(llm_service, config.clone());

    // Build and start server
    let app = build_app_with_middleware(app_state, &config);
    start_server(app, &config).await?;

    Ok(())
}

/// 初始化日志系统
fn initialize_logging(args: &Args) {
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
}

/// 记录配置信息
fn log_configuration(config: &Settings, config_source: &str) {
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
}

/// 初始化 LLM 服务
fn initialize_llm_service(config: &Settings) -> Result<service::Service> {
    info!("🔧 Initializing LLM service...");
    let llm_service = service::Service::new(&config.llm_backend)?;
    info!("✅ LLM service initialized successfully");
    Ok(llm_service)
}

/// 构建应用并添加中间件
fn build_app_with_middleware(app_state: AppState, config: &Settings) -> Router {
    info!("🏗️ Building application routes...");

    build_app(app_state, config)
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
        )
}

/// 启动服务器
async fn start_server(app: Router, config: &Settings) -> Result<()> {
    let bind_addr = format!("{}:{}", config.server.host, config.server.port);
    info!("🔌 Binding to address: {}", bind_addr);
    let listener = tokio::net::TcpListener::bind(&bind_addr).await?;

    info!("🎉 LLM Link proxy is listening on {}", bind_addr);
    info!("📡 Ready to accept connections!");
    info!("👀 Monitoring for incoming requests...");

    axum::serve(listener, app).await?;
    Ok(())
}

fn build_app(state: AppState, config: &Settings) -> Router {
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
            async { api::debug_test().await }
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
                .route(&format!("{}/api/generate", ollama_config.path), post(api::ollama::generate))
                .route(&format!("{}/api/chat", ollama_config.path), post(api::ollama::chat))
                .route(&format!("{}/api/tags", ollama_config.path), get(api::ollama::models))
                .route(&format!("{}/api/show", ollama_config.path), post(api::ollama::show))
                .route(&format!("{}/api/version", ollama_config.path), get(|| async {
                    axum::Json(serde_json::json!({
                        "version": "0.1.0",
                        "build": "llm-link"
                    }))
                }))
                .route(&format!("{}/api/ps", ollama_config.path), get(api::ollama::ps));
        }
    }

    // Add OpenAI-compatible API endpoints
    if let Some(openai_config) = &config.apis.openai {
        if openai_config.enabled {
            info!("Enabling OpenAI API on path: {}", openai_config.path);
            app = app
                .route(&format!("{}/chat/completions", openai_config.path), post(api::openai::chat))
                .route(&format!("{}/models", openai_config.path), get(api::openai::models))
                .route(&format!("{}/models/:model", openai_config.path), get(api::openai::models));
        }
    }

    // Add Anthropic API endpoints
    if let Some(anthropic_config) = &config.apis.anthropic {
        if anthropic_config.enabled {
            info!("Enabling Anthropic API on path: {}", anthropic_config.path);
            app = app
                .route(&format!("{}/v1/messages", anthropic_config.path), post(api::anthropic::messages))
                .route(&format!("{}/v1/models", anthropic_config.path), get(api::anthropic::models));
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
