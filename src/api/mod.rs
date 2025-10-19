pub mod openai;
pub mod ollama;
pub mod anthropic;
pub mod convert;

use crate::settings::Settings;
use crate::service::Service as LlmService;
use axum::response::Json;
use serde_json::json;
use std::sync::Arc;

/// 应用状态
#[derive(Clone)]
pub struct AppState {
    pub llm_service: Arc<LlmService>,
    pub config: Arc<Settings>,
}

impl AppState {
    pub fn new(llm_service: LlmService, config: Settings) -> Self {
        Self {
            llm_service: Arc::new(llm_service),
            config: Arc::new(config),
        }
    }
}

/// 健康检查端点
pub async fn health_check() -> Json<serde_json::Value> {
    Json(json!({
        "status": "ok",
        "service": "llm-link",
        "version": "0.1.0"
    }))
}

/// 调试测试端点
pub async fn debug_test() -> Json<serde_json::Value> {
    Json(json!({
        "debug": "test",
        "timestamp": "2025-10-15T16:00:00Z"
    }))
}
