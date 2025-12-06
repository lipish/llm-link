// Core modules (always present)
mod adapters;
mod apps;
mod settings;
mod service;
mod normalizer;
mod api;
mod models;
mod cli;
mod provider;

// New modules for multi-mode support
mod db;
mod mode;
mod admin;

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
use tracing::{info, error, warn, Span};
use std::time::Duration;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use cli::{Args, ConfigLoader, list_applications, show_application_info};

// Import new modules
use mode::RunMode;
use db::DatabasePool;
use admin::create_admin_app;

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

    // Get run mode (default to multi for better UX)
    let run_mode = args.mode.unwrap_or_default();
    
    info!("🚀 Starting LLM Link in {} mode", run_mode);
    
    // Route to appropriate mode handler
    match run_mode {
        RunMode::Single => run_single_mode(args).await,
        RunMode::Multi => run_multi_mode(args).await,
    }
}

/// Run in single provider mode (traditional)
async fn run_single_mode(args: Args) -> Result<()> {
    info!("📋 Single provider mode: Using YAML configuration");
    
    // Load configuration (required for single mode)
    let (config, config_source) = ConfigLoader::load_config(&args)?;
    let config = ConfigLoader::apply_cli_overrides(config, &args);

    // Log configuration
    log_configuration(&config, &config_source);

    // Initialize LLM service
    let llm_service = initialize_llm_service(&config)?;
    let app_state = AppState::new(llm_service, config.clone());

    // Build and start server
    let app = build_single_mode_app(app_state, &config);
    start_server(app, &config).await?;

    Ok(())
}

/// Run in multi provider mode (new zero-config experience)
async fn run_multi_mode(args: Args) -> Result<()> {
    info!("🌐 Multi provider mode: Using database and web interface");
    
    // First test with in-memory database to isolate SQLite library issues
    match test_in_memory_database().await {
        Ok(_) => info!("✅ In-memory database test passed - SQLite library works"),
        Err(e) => {
            error!("❌ In-memory database test failed: {}", e);
            error!("This indicates a SQLite library installation issue");
            std::process::exit(1);
        }
    }
    
    // Try file-based database first, fallback to in-memory if it fails
    let db_pool = match try_file_database().await {
        Ok(pool) => {
            info!("✅ File-based database initialized successfully");
            pool
        }
        Err(e) => {
            warn!("⚠️ File-based database failed: {}", e);
            info!("🔄 Falling back to in-memory database for Phase 1");
            info!("📝 Note: File persistence will be implemented in Phase 2");
            
            match DatabasePool::new_memory().await {
                Ok(pool) => {
                    info!("✅ In-memory database initialized successfully");
                    pool
                }
                Err(e) => {
                    error!("❌ In-memory database also failed: {}", e);
                    std::process::exit(1);
                }
            }
        }
    };
    
    // Check if this is first run
    let is_first_run = db_pool.is_first_run().await.unwrap_or(true); // Assume first run for in-memory
    
    // Start admin interface
    let admin_app = create_admin_app(db_pool.clone());
    let admin_port = args.admin_port.unwrap_or(8081);
    let admin_bind_addr = format!("0.0.0.0:{}", admin_port);
    
    info!("🌐 Admin interface: http://localhost:{}", admin_port);
    
    if is_first_run {
        info!("📝 First time setup? Visit: http://localhost:{}/setup", admin_port);
    }
    
    // Start admin server in background
    let admin_listener = tokio::net::TcpListener::bind(&admin_bind_addr).await?;
    let admin_handle = tokio::spawn(async move {
        if let Err(e) = axum::serve(admin_listener, admin_app).await {
            error!("Admin server error: {}", e);
        }
    });
    
    // TODO: Start main API server (placeholder for now)
    info!("📡 Main API server will be implemented in Phase 2");
    info!("🎉 Multi-mode setup complete. Admin interface is running.");
    
    // Wait for admin server (in real implementation, this would also start the main API)
    admin_handle.await?;
    
    Ok(())
}

/// Try to initialize file-based database
async fn try_file_database() -> Result<DatabasePool> {
    info!("Attempting file-based database initialization...");
    
    // Use absolute path for database to avoid path resolution issues
    let db_path = std::env::current_dir()
        .map_err(|e| anyhow::anyhow!("Failed to get current directory: {}", e))?
        .join("data")
        .join("llm_link.db");
    
    info!("Database path: {:?}", db_path);
    
    // Test with /tmp location to rule out project directory permissions
    let tmp_path = std::path::Path::new("/tmp").join("llm_link_test.db");
    info!("Testing with temp path: {:?}", tmp_path);
    
    match test_sqlite_connection(&tmp_path).await {
        Ok(_) => info!("✅ Temp directory SQLite test passed"),
        Err(e) => {
            warn!("⚠️ Temp directory SQLite test failed: {}", e);
            return Err(anyhow::anyhow!("File-based SQLite not working: {}", e));
        }
    }
    
    // Now try the actual data directory
    let data_dir = db_path.parent().unwrap();
    
    // Create directory and verify it exists
    std::fs::create_dir_all(data_dir)
        .map_err(|e| anyhow::anyhow!("Failed to create data directory: {}", e))?;
    
    // Verify directory was created and is writable
    match std::fs::metadata(data_dir) {
        Ok(metadata) => {
            info!("✅ Data directory exists, is_dir: {}, readonly: {}", 
                  metadata.is_dir(), metadata.permissions().readonly());
        }
        Err(e) => {
            warn!("⚠️ Cannot access data directory: {}", e);
            return Err(anyhow::anyhow!("Directory access failed: {}", e));
        }
    }
    
    // Test file creation in the directory
    let test_file = data_dir.join(".test_write");
    match std::fs::write(&test_file, "test") {
        Ok(_) => {
            info!("✅ Data directory is writable");
            let _ = std::fs::remove_file(&test_file);
        }
        Err(e) => {
            warn!("⚠️ Data directory is not writable: {}", e);
            return Err(anyhow::anyhow!("Directory not writable: {}", e));
        }
    }
    
    // Initialize database
    DatabasePool::new(&db_path).await
}

/// Test in-memory database to verify SQLite library works
async fn test_in_memory_database() -> Result<()> {
    info!("Testing in-memory SQLite database...");
    
    let pool = sqlx::SqlitePool::connect(":memory:").await?;
    
    // Run a simple query
    let result: i64 = sqlx::query_scalar("SELECT 1")
        .fetch_one(&pool)
        .await?;
    
    if result == 1 {
        info!("✅ In-memory database test successful");
        pool.close().await;
        Ok(())
    } else {
        anyhow::bail!("Unexpected query result: {}", result);
    }
}

/// Test basic SQLite connectivity
async fn test_sqlite_connection(db_path: &std::path::Path) -> Result<()> {
    info!("Testing SQLite connectivity...");
    
    // Create a simple test connection
    let test_conn_str = format!("sqlite://{}", db_path.display());
    let pool = sqlx::SqlitePool::connect(&test_conn_str).await?;
    
    // Run a simple query
    let result: i64 = sqlx::query_scalar("SELECT 1")
        .fetch_one(&pool)
        .await?;
    
    if result == 1 {
        info!("✅ Basic SQLite query successful");
        pool.close().await;
        Ok(())
    } else {
        anyhow::bail!("Unexpected query result: {}", result);
    }
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

/// Build single mode application and add middleware
fn build_single_mode_app(app_state: AppState, config: &Settings) -> Router {
    info!("🏗️ Building single-mode application routes...");

    build_single_mode_routes(app_state, config)
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

fn build_single_mode_routes(state: AppState, config: &Settings) -> Router {
    // Create basic routes (no state required)
    let basic_routes = Router::new()
        .route("/", get(|| {
            info!("🏠 Root endpoint accessed");
            async { "LLM Link is running in single mode" }
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
            let ollama_routes = api::ollama::build_ollama_routes(state.clone(), ollama_config);
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

    // Add Anthropic API endpoints
    if let Some(anthropic_config) = &config.apis.anthropic {
        if anthropic_config.enabled {
            info!("🔮 Enabling Anthropic API on path: {}", anthropic_config.path);
            let anthropic_routes = Router::new()
                .route(&format!("{}/v1/messages", anthropic_config.path), post(api::anthropic::messages))
                .route(&format!("{}/v1/messages/count_tokens", anthropic_config.path), post(api::anthropic::count_tokens))
                .route(&format!("{}/v1/models", anthropic_config.path), get(api::anthropic::models))
                .with_state(state.clone());
            app = app.merge(anthropic_routes);
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

    // Apply middleware at the end
    app.layer(
        ServiceBuilder::new()
            .layer(TraceLayer::new_for_http())
            .layer(CorsLayer::new().allow_origin(Any).allow_methods(Any).allow_headers(Any)),
    )
}
