pub mod openai;
pub mod ollama;
pub mod anthropic;
pub mod convert;

use crate::settings::{Settings, LlmBackendSettings};
use crate::service::Service as LlmService;
use crate::models::ModelsConfig;
use axum::response::Json;
use axum::extract::State;
use axum::http::StatusCode;
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

/// 获取完整的 provider 和 model 信息
pub async fn info(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    let current_provider = get_provider_name(&state.config.llm_backend);
    let current_model = get_current_model(&state.config.llm_backend);
    
    let models_config = ModelsConfig::load_with_fallback();
    
    let supported_providers = vec![
        json!({
            "name": "openai",
            "models": models_config.openai.models,
        }),
        json!({
            "name": "anthropic",
            "models": models_config.anthropic.models,
        }),
        json!({
            "name": "zhipu",
            "models": models_config.zhipu.models,
        }),
        json!({
            "name": "ollama",
            "models": models_config.ollama.models,
        }),
        json!({
            "name": "aliyun",
            "models": models_config.aliyun.models,
        }),
        json!({
            "name": "volcengine",
            "models": vec![
                json!({
                    "id": "ep-20241023xxxxx-xxxxx",
                    "name": "Doubao Model",
                    "description": "Volcengine Doubao model endpoint"
                })
            ],
        }),
        json!({
            "name": "tencent",
            "models": vec![
                json!({
                    "id": "hunyuan-lite",
                    "name": "Hunyuan Lite",
                    "description": "Tencent Hunyuan lite model"
                })
            ],
        }),
    ];

    let mut api_endpoints = serde_json::Map::new();
    
    if let Some(ollama_config) = &state.config.apis.ollama {
        if ollama_config.enabled {
            api_endpoints.insert("ollama".to_string(), json!({
                "path": ollama_config.path,
                "enabled": true,
                "auth_required": ollama_config.api_key.is_some(),
            }));
        }
    }
    
    if let Some(openai_config) = &state.config.apis.openai {
        if openai_config.enabled {
            api_endpoints.insert("openai".to_string(), json!({
                "path": openai_config.path,
                "enabled": true,
                "auth_required": openai_config.api_key.is_some(),
            }));
        }
    }
    
    if let Some(anthropic_config) = &state.config.apis.anthropic {
        if anthropic_config.enabled {
            api_endpoints.insert("anthropic".to_string(), json!({
                "path": anthropic_config.path,
                "enabled": true,
            }));
        }
    }

    let response = json!({
        "service": "llm-link",
        "version": "0.2.4",
        "current_provider": current_provider,
        "current_model": current_model,
        "supported_providers": supported_providers,
        "api_endpoints": api_endpoints,
    });

    Ok(Json(response))
}

fn get_provider_name(backend: &LlmBackendSettings) -> &str {
    match backend {
        LlmBackendSettings::OpenAI { .. } => "openai",
        LlmBackendSettings::Anthropic { .. } => "anthropic",
        LlmBackendSettings::Zhipu { .. } => "zhipu",
        LlmBackendSettings::Ollama { .. } => "ollama",
        LlmBackendSettings::Aliyun { .. } => "aliyun",
        LlmBackendSettings::Volcengine { .. } => "volcengine",
        LlmBackendSettings::Tencent { .. } => "tencent",
    }
}

fn get_current_model(backend: &LlmBackendSettings) -> String {
    match backend {
        LlmBackendSettings::OpenAI { model, .. } => model.clone(),
        LlmBackendSettings::Anthropic { model, .. } => model.clone(),
        LlmBackendSettings::Zhipu { model, .. } => model.clone(),
        LlmBackendSettings::Ollama { model, .. } => model.clone(),
        LlmBackendSettings::Aliyun { model, .. } => model.clone(),
        LlmBackendSettings::Volcengine { model, .. } => model.clone(),
        LlmBackendSettings::Tencent { model, .. } => model.clone(),
    }
}
