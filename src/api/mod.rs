pub mod openai;
pub mod ollama;
pub mod anthropic;
pub mod convert;
pub mod config;

use crate::settings::{Settings, LlmBackendSettings};
use crate::service::Service as LlmService;
use crate::models::ModelsConfig;
use axum::response::Json;
use axum::extract::State;
use axum::http::StatusCode;
use serde_json::json;
use std::sync::{Arc, RwLock};
use anyhow::Result;

/// 应用状态
#[derive(Clone)]
pub struct AppState {
    pub llm_service: Arc<RwLock<LlmService>>,
    pub config: Arc<RwLock<Settings>>,
}

impl AppState {
    pub fn new(llm_service: LlmService, config: Settings) -> Self {
        Self {
            llm_service: Arc::new(RwLock::new(llm_service)),
            config: Arc::new(RwLock::new(config)),
        }
    }

    /// 动态更新 LLM 服务配置
    ///
    /// 这个方法允许在运行时更新 LLM 后端配置，而无需重启服务
    pub fn update_llm_service(&self, new_backend: &LlmBackendSettings) -> Result<()> {
        // 创建新的 LLM 服务
        let new_service = LlmService::new(new_backend)?;

        // 更新服务
        {
            let mut service = self.llm_service.write()
                .map_err(|e| anyhow::anyhow!("Failed to acquire write lock for llm_service: {}", e))?;
            *service = new_service;
        }

        // 更新配置
        {
            let mut config = self.config.write()
                .map_err(|e| anyhow::anyhow!("Failed to acquire write lock for config: {}", e))?;
            config.llm_backend = new_backend.clone();
        }

        Ok(())
    }

    /// 获取当前配置的副本
    pub fn get_current_config(&self) -> Result<Settings> {
        self.config.read()
            .map_err(|e| anyhow::anyhow!("Failed to acquire read lock for config: {}", e))
            .map(|config| config.clone())
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
    let config = state.config.read()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;
    let current_provider = get_provider_name(&config.llm_backend);
    let current_model = get_current_model(&config.llm_backend);
    
    let models_config = ModelsConfig::load_with_fallback();

    // Build supported_providers from the dynamic HashMap
    let mut supported_providers: Vec<serde_json::Value> = models_config.providers
        .iter()
        .map(|(name, provider_models)| {
            json!({
                "name": name,
                "models": provider_models.models,
            })
        })
        .collect();

    // Sort by provider name for consistent output
    supported_providers.sort_by(|a, b| {
        a["name"].as_str().unwrap_or("").cmp(b["name"].as_str().unwrap_or(""))
    });

    let mut api_endpoints = serde_json::Map::with_capacity(3);

    if let Some(ollama_config) = &config.apis.ollama {
        if ollama_config.enabled {
            api_endpoints.insert("ollama".to_string(), json!({
                "path": ollama_config.path,
                "enabled": true,
                "auth_required": ollama_config.api_key.is_some(),
            }));
        }
    }

    if let Some(openai_config) = &config.apis.openai {
        if openai_config.enabled {
            api_endpoints.insert("openai".to_string(), json!({
                "path": openai_config.path,
                "enabled": true,
                "auth_required": openai_config.api_key.is_some(),
            }));
        }
    }

    if let Some(anthropic_config) = &config.apis.anthropic {
        if anthropic_config.enabled {
            api_endpoints.insert("anthropic".to_string(), json!({
                "path": anthropic_config.path,
                "enabled": true,
            }));
        }
    }

    let response = json!({
        "service": "llm-link",
        "version": "0.3.3",
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
        LlmBackendSettings::Longcat { .. } => "longcat",
        LlmBackendSettings::Moonshot { .. } => "moonshot",
        LlmBackendSettings::Minimax { .. } => "minimax",
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
        LlmBackendSettings::Longcat { model, .. } => model.clone(),
        LlmBackendSettings::Moonshot { model, .. } => model.clone(),
        LlmBackendSettings::Minimax { model, .. } => model.clone(),
    }
}
