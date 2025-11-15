mod adapters;
mod apps;
mod settings;
mod service;
mod llm;
mod api;
mod models;
mod cli;
mod provider;

use anyhow::Result;
use axum::{
    routing::{get, post},
    Router,
    extract::Request,
    response::Response,
};
use clap::Parser;
use settings::Settings;
use api::{AppState, health_check, info};
use api::config::{get_current_config, update_config_for_restart, validate_key, validate_key_for_update, update_key, switch_provider, get_pid, shutdown, get_health, init_instance_id};
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
    
    // Initialize instance ID for tracking restarts
    init_instance_id();

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

/// Initialize logging system
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

/// Log configuration information
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

/// Initialize LLM service
fn initialize_llm_service(config: &Settings) -> Result<service::Service> {
    info!("🔧 Initializing LLM service...");
    let llm_service = service::Service::new(&config.llm_backend)?;
    info!("✅ LLM service initialized successfully");
    Ok(llm_service)
}

/// Build application and add middleware
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

/// Start server
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
    // Create basic routes (no state required)
    let basic_routes = Router::new()
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
        }));

    // Create routes that require state
    let stateful_routes = Router::new()
        .route("/api/health", get(get_health))
        .route("/api/info", get(info))
        .route("/api/config/current", get(get_current_config))
        .route("/api/config/update", post(update_config_for_restart))
        .route("/api/config/validate", post(validate_key))
        .route("/api/config/validate-key", post(validate_key_for_update))
        .route("/api/config/update-key", post(update_key))
        .route("/api/config/switch-provider", post(switch_provider))
        .route("/api/config/pid", get(get_pid))
        .route("/api/config/shutdown", post(shutdown))
        .with_state(state.clone());

    // Merge routes
    let mut app = basic_routes.merge(stateful_routes);

    // Add Ollama API endpoints
    if let Some(ollama_config) = &config.apis.ollama {
        if ollama_config.enabled {
            info!("Enabling Ollama API on path: {}", ollama_config.path);
            let state_for_chat = state.clone();
            let ollama_routes = Router::new()
                .route(&format!("{}/api/tags", ollama_config.path), get(|| async {
                    // Return available models
                    axum::Json(serde_json::json!({
                        "models": [
                            {
                                "name": "MiniMax-M2",
                                "model": "MiniMax-M2",
                                "modified_at": "2025-01-01T00:00:00Z",
                                "size": 0,
                                "digest": "minimax-m2",
                                "details": {
                                    "format": "gguf",
                                    "family": "minimax",
                                    "families": ["minimax"],
                                    "parameter_size": "7B",
                                    "quantization_level": "Q4_K_M"
                                }
                            }
                        ]
                    }))
                }))
                .route(&format!("{}/api/chat", ollama_config.path), post(move |axum::extract::State(s): axum::extract::State<AppState>, axum::Json(req): axum::Json<serde_json::Value>| {
                    let s = s.clone();
                    async move {
                        use tracing::info;
                        use axum::response::{Response, IntoResponse};
                        use axum::body::Body;
                        use futures::StreamExt;
                        use std::convert::Infallible;

                        // Extract model name
                        let model = req.get("model")
                            .and_then(|v| v.as_str())
                            .unwrap_or("MiniMax-M2")
                            .to_string();

                        // Extract messages
                        let messages_value = req.get("messages")
                            .and_then(|v| v.as_array())
                            .cloned()
                            .unwrap_or_default();

                        // Extract stream parameter
                        let stream = req.get("stream")
                            .and_then(|v| v.as_bool())
                            .unwrap_or(false);

                        info!("📨 Chat request: model={}, messages_count={}, stream={}", model, messages_value.len(), stream);

                        // Check if this is a MiniMax request and use direct client
                        let config = s.config.read().await;
                        let is_minimax = matches!(&config.llm_backend, settings::LlmBackendSettings::Minimax { .. });
                        drop(config);

                        if is_minimax {
                            // Use direct MiniMax client for better compatibility
                            if let Ok(api_key) = std::env::var("MINIMAX_API_KEY") {
                                let minimax_client = llm::minimax_client::MinimaxClient::new(&api_key);

                                if stream {
                                    // Handle streaming response
                                    match minimax_client.chat_stream(&model, messages_value).await {
                                        Ok(stream) => {
                                            info!("✅ MiniMax streaming started");

                                            let model_name = model.clone();
                                            let in_think = std::sync::Arc::new(std::sync::Mutex::new(false));
                                            let in_think_clone = in_think.clone();
                                            let adapted_stream = stream.map(move |result| {
                                                let in_think = in_think_clone.clone();
                                                match result {
                                                    Ok(chunk) => {
                                                        // Parse each JSON line in the chunk
                                                        let mut output = String::new();
                                                        for line in chunk.lines() {
                                                            if line.is_empty() {
                                                                continue;
                                                            }

                                                            if let Ok(json_data) = serde_json::from_str::<serde_json::Value>(line) {
                                                                if let Some(choices) = json_data.get("choices").and_then(|c| c.as_array()) {
                                                                    if let Some(choice) = choices.first() {
                                                                        if let Some(delta) = choice.get("delta") {
                                                                            if let Some(content) = delta.get("content").and_then(|c| c.as_str()) {
                                                                                // Track think blocks across chunks
                                                                                let mut in_think_block = in_think.lock().unwrap();

                                                                                // Check if we're entering a think block
                                                                                if content.contains("<think>") {
                                                                                    *in_think_block = true;
                                                                                }

                                                                                // Check if we're exiting a think block
                                                                                if content.contains("</think>") {
                                                                                    *in_think_block = false;
                                                                                    continue;
                                                                                }

                                                                                // Skip content inside think blocks
                                                                                if *in_think_block {
                                                                                    continue;
                                                                                }

                                                                                drop(in_think_block);

                                                                                // Clean up any remaining <think> tags
                                                                                let cleaned = llm::minimax_client::MinimaxClient::clean_think_tags(content);

                                                                                if !cleaned.is_empty() {
                                                                                    let ollama_chunk = serde_json::json!({
                                                                                        "model": &model_name,
                                                                                        "created_at": chrono::Utc::now().to_rfc3339(),
                                                                                        "message": {
                                                                                            "role": "assistant",
                                                                                            "content": cleaned,
                                                                                        },
                                                                                        "done": false
                                                                                    });
                                                                                    output.push_str(&format!("{}\n", ollama_chunk));
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        Ok::<_, Infallible>(output)
                                                    }
                                                    Err(_) => Ok(String::new()),
                                                }
                                            });

                                            let body_stream = adapted_stream.map(|data| {
                                                match data {
                                                    Ok(s) => Ok::<_, Infallible>(axum::body::Bytes::from(s)),
                                                    Err(_) => Ok(axum::body::Bytes::new()),
                                                }
                                            });
                                            let body = Body::from_stream(body_stream);

                                            Response::builder()
                                                .status(200)
                                                .header("content-type", "application/x-ndjson")
                                                .body(body)
                                                .unwrap()
                                                .into_response()
                                        }
                                        Err(e) => {
                                            info!("❌ MiniMax streaming failed: {:?}", e);
                                            Response::builder()
                                                .status(500)
                                                .header("content-type", "application/json")
                                                .body(Body::from(serde_json::json!({"error": "Streaming failed"}).to_string()))
                                                .unwrap()
                                                .into_response()
                                        }
                                    }
                                } else {
                                    // Handle non-streaming response
                                    match minimax_client.chat(&model, messages_value).await {
                                        Ok(response) => {
                                            info!("✅ Chat response generated successfully (MiniMax direct)");
                                            let ollama_response = api::convert::response_to_ollama_from_minimax(response);
                                            Response::builder()
                                                .status(200)
                                                .header("content-type", "application/json")
                                                .body(Body::from(serde_json::to_string(&ollama_response).unwrap()))
                                                .unwrap()
                                                .into_response()
                                        }
                                        Err(e) => {
                                            info!("❌ MiniMax direct request failed: {:?}", e);
                                            Response::builder()
                                                .status(500)
                                                .header("content-type", "application/json")
                                                .body(Body::from(serde_json::json!({"error": "Chat request failed"}).to_string()))
                                                .unwrap()
                                                .into_response()
                                        }
                                    }
                                }
                            } else {
                                info!("❌ MINIMAX_API_KEY not set");
                                Response::builder()
                                    .status(500)
                                    .header("content-type", "application/json")
                                    .body(Body::from(serde_json::json!({"error": "API key not configured"}).to_string()))
                                    .unwrap()
                                    .into_response()
                            }
                        } else {
                            // Use llm-connector for other providers
                            match api::convert::openai_messages_to_llm(messages_value) {
                                Ok(messages) => {
                                    let llm_service = s.llm_service.read().await;
                                    match llm_service.chat(Some(&model), messages, None).await {
                                        Ok(response) => {
                                            info!("✅ Chat response generated successfully");
                                            let ollama_response = api::convert::response_to_ollama(response);
                                            Response::builder()
                                                .status(200)
                                                .header("content-type", "application/json")
                                                .body(Body::from(serde_json::to_string(&ollama_response).unwrap()))
                                                .unwrap()
                                                .into_response()
                                        }
                                        Err(e) => {
                                            info!("❌ Chat request failed: {:?}", e);
                                            Response::builder()
                                                .status(500)
                                                .header("content-type", "application/json")
                                                .body(Body::from(serde_json::json!({"error": "Chat request failed"}).to_string()))
                                                .unwrap()
                                                .into_response()
                                        }
                                    }
                                }
                                Err(e) => {
                                    info!("❌ Failed to convert messages: {:?}", e);
                                    Response::builder()
                                        .status(400)
                                        .header("content-type", "application/json")
                                        .body(Body::from(serde_json::json!({"error": "Invalid messages format"}).to_string()))
                                        .unwrap()
                                        .into_response()
                                }
                            }
                        }
                    }
                }))
                .route(&format!("{}/api/show", ollama_config.path), post(api::ollama::show_handler))
                .route(&format!("{}/api/version", ollama_config.path), get(|| async {
                    axum::Json(serde_json::json!({
                        "version": "0.1.0",
                        "build": "llm-link"
                    }))
                }))
                .with_state(state_for_chat);
            app = app.merge(ollama_routes);
        }
    }

    // Add OpenAI-compatible API endpoints
    if let Some(openai_config) = &config.apis.openai {
        if openai_config.enabled {
            info!("Enabling OpenAI API on path: {}", openai_config.path);
            let openai_routes = Router::new()
                .route(&format!("{}/chat/completions", openai_config.path), post(api::openai::chat))
                .route(&format!("{}/models", openai_config.path), get(api::openai::models))
                .route(&format!("{}/models/:model", openai_config.path), get(api::openai::models))
                .with_state(state.clone());
            app = app.merge(openai_routes);
        }
    }

    // Add Anthropic API endpoints (temporarily disabled for compilation)
    if let Some(_anthropic_config) = &config.apis.anthropic {
        // if anthropic_config.enabled {
        //     info!("Enabling Anthropic API on path: {}", anthropic_config.path);
        //     let anthropic_routes = Router::new()
        //         .route(&format!("{}/v1/messages", anthropic_config.path), post(api::anthropic::messages))
        //         .route(&format!("{}/v1/models", anthropic_config.path), get(api::anthropic::models))
        //         .with_state(state.clone());
        //     app = app.merge(anthropic_routes);
        // }
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

    // Apply middleware at the end
    app.layer(
        ServiceBuilder::new()
            .layer(TraceLayer::new_for_http())
            .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any)),
    )
}
