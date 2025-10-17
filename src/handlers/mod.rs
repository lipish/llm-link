pub mod openai;
pub mod ollama;

use crate::config::Config;
use crate::service::Service as LlmService;
use axum::{response::Json, extract::State};
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

pub async fn ollama_show(
    State(state): State<AppState>,
    Json(request): Json<serde_json::Value>,
) -> Result<Json<serde_json::Value>, axum::http::StatusCode> {
    use serde_json::json;

    // Extract model name from request
    let model_name = request.get("name")
        .and_then(|v| v.as_str())
        .unwrap_or("unknown");

    // Check if model exists
    match state.llm_service.validate_model(model_name).await {
        Ok(true) => {
            // Return model details in Ollama format
            let response = json!({
                "license": "",
                "modelfile": format!("FROM {}", model_name),
                "parameters": "",
                "template": "{{ if .System }}{{ .System }}{{ end }}{{ if .Prompt }}{{ .Prompt }}{{ end }}{{ .Response }}",
                "details": {
                    "parent_model": "",
                    "format": "gguf",
                    "family": model_name.split('-').next().unwrap_or("unknown"),
                    "families": [model_name.split('-').next().unwrap_or("unknown")],
                    "parameter_size": "7B",
                    "quantization_level": "Q4_K_M"
                },
                "model_info": {
                    "general.architecture": "llama",
                    "general.file_type": 2,
                    "general.parameter_count": 7000000000u64,
                    "general.quantization_version": 2,
                    "llama.attention.head_count": 32,
                    "llama.attention.head_count_kv": 32,
                    "llama.attention.layer_norm_rms_epsilon": 0.000001,
                    "llama.block_count": 32,
                    "llama.context_length": 4096,
                    "llama.embedding_length": 4096,
                    "llama.feed_forward_length": 11008,
                    "llama.rope.dimension_count": 128,
                    "llama.rope.freq_base": 10000.0,
                    "llama.vocab_size": 32000
                }
            });
            Ok(Json(response))
        }
        Ok(false) => Err(axum::http::StatusCode::NOT_FOUND),
        Err(_) => Err(axum::http::StatusCode::INTERNAL_SERVER_ERROR),
    }
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
