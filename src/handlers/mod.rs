pub mod openai;
pub mod ollama;

use crate::config::Config;
use crate::service::Service as LlmService;
use axum::response::Json;
use serde_json::json;
use std::sync::Arc;

/// 应用状态
#[derive(Clone)]
pub struct AppState {
    pub llm_service: Arc<LlmService>,
    pub config: Arc<Config>,
}

impl AppState {
    pub fn new(llm_service: LlmService, config: Config) -> Self {
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

/// 占位符函数 - 需要实现
pub async fn ollama_generate() -> &'static str {
    "Not implemented"
}

pub async fn ollama_show() -> &'static str {
    "Not implemented"
}

pub async fn ollama_ps() -> &'static str {
    "Not implemented"
}

pub async fn anthropic_messages() -> &'static str {
    "Not implemented"
}

pub async fn anthropic_models() -> &'static str {
    "Not implemented"
}
