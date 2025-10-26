use axum::{extract::State, http::StatusCode, response::Json};
use serde::{Deserialize, Serialize};
use serde_json::json;
use tracing::{info, error};
use std::sync::atomic::{AtomicU64, Ordering};

use crate::api::AppState;

/// 安全地掩盖 API Key 用于日志记录
fn mask_api_key(api_key: &str) -> String {
    if api_key.len() <= 8 {
        "*".repeat(api_key.len())
    } else {
        format!("{}***{}", &api_key[..4], &api_key[api_key.len()-4..])
    }
}

/// 验证 API Key 格式
fn validate_api_key(provider: &str, api_key: &str) -> Result<(), String> {
    if api_key.trim().is_empty() {
        return Err("API key cannot be empty".to_string());
    }

    match provider {
        "openai" => {
            if !api_key.starts_with("sk-") {
                return Err("OpenAI API key should start with 'sk-'".to_string());
            }
        }
        "anthropic" => {
            if !api_key.starts_with("sk-ant-") {
                return Err("Anthropic API key should start with 'sk-ant-'".to_string());
            }
        }
        "zhipu" => {
            // Zhipu API keys have specific format, but we'll be lenient
            if api_key.len() < 10 {
                return Err("Zhipu API key seems too short".to_string());
            }
        }
        "ollama" => {
            // Ollama doesn't require API key, so this is always valid
        }
        _ => {
            // For other providers, just check minimum length
            if api_key.len() < 10 {
                return Err("API key seems too short".to_string());
            }
        }
    }

    Ok(())
}

/// 验证 provider 名称
fn validate_provider(provider: &str) -> Result<(), String> {
    match provider {
        "openai" | "anthropic" | "zhipu" | "ollama" | "aliyun" | "volcengine" | "tencent" => Ok(()),
        _ => Err(format!("Unsupported provider: {}", provider)),
    }
}

// 全局计数器，每次启动时递增
static INSTANCE_ID: AtomicU64 = AtomicU64::new(0);

pub fn init_instance_id() {
    use std::time::{SystemTime, UNIX_EPOCH};
    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();
    INSTANCE_ID.store(timestamp, Ordering::SeqCst);
}

pub fn get_instance_id() -> u64 {
    INSTANCE_ID.load(Ordering::SeqCst)
}

#[derive(Debug, Deserialize)]
pub struct UpdateConfigRequest {
    pub provider: String,
    pub api_key: String,
    #[serde(default)]
    pub model: Option<String>,
    #[serde(default)]
    pub base_url: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateKeyRequest {
    pub provider: String,
    pub api_key: String,
    #[serde(default)]
    pub base_url: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct SwitchProviderRequest {
    pub provider: String,
    #[serde(default)]
    pub model: Option<String>,
    #[serde(default)]
    pub api_key: Option<String>,
    #[serde(default)]
    pub base_url: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct CurrentConfigResponse {
    pub provider: String,
    pub model: String,
    pub has_api_key: bool,
    pub has_base_url: bool,
    pub supports_hot_reload: bool,
}

/// 获取当前配置信息（不包含敏感的 API Key）
pub async fn get_current_config(
    State(state): State<AppState>,
) -> Result<Json<CurrentConfigResponse>, StatusCode> {
    use crate::settings::LlmBackendSettings;

    let config = state.config.read().unwrap();
    let (provider, model, has_api_key, has_base_url) = match &config.llm_backend {
        LlmBackendSettings::OpenAI { model, base_url, .. } => {
            ("openai", model.clone(), true, base_url.is_some())
        }
        LlmBackendSettings::Anthropic { model, .. } => {
            ("anthropic", model.clone(), true, false)
        }
        LlmBackendSettings::Zhipu { model, base_url, .. } => {
            ("zhipu", model.clone(), true, base_url.is_some())
        }
        LlmBackendSettings::Ollama { model, base_url } => {
            ("ollama", model.clone(), false, base_url.is_some())
        }
        LlmBackendSettings::Aliyun { model, .. } => {
            ("aliyun", model.clone(), true, false)
        }
        LlmBackendSettings::Volcengine { model, .. } => {
            ("volcengine", model.clone(), true, false)
        }
        LlmBackendSettings::Tencent { model, .. } => {
            ("tencent", model.clone(), true, false)
        }
    };
    
    Ok(Json(CurrentConfigResponse {
        provider: provider.to_string(),
        model,
        has_api_key,
        has_base_url,
        supports_hot_reload: true, // 现在支持热重载
    }))
}

/// 获取健康状态和实例信息
///
/// 用于验证服务是否重启成功
pub async fn get_health(
    State(state): State<AppState>,
) -> Json<serde_json::Value> {
    use crate::settings::LlmBackendSettings;

    let config = state.config.read().unwrap();
    let (provider, model) = match &config.llm_backend {
        LlmBackendSettings::OpenAI { model, .. } => ("openai", model.clone()),
        LlmBackendSettings::Anthropic { model, .. } => ("anthropic", model.clone()),
        LlmBackendSettings::Zhipu { model, .. } => ("zhipu", model.clone()),
        LlmBackendSettings::Ollama { model, .. } => ("ollama", model.clone()),
        LlmBackendSettings::Aliyun { model, .. } => ("aliyun", model.clone()),
        LlmBackendSettings::Volcengine { model, .. } => ("volcengine", model.clone()),
        LlmBackendSettings::Tencent { model, .. } => ("tencent", model.clone()),
    };
    
    Json(json!({
        "status": "ok",
        "instance_id": get_instance_id(),
        "pid": std::process::id(),
        "provider": provider,
        "model": model,
    }))
}

/// 更新配置并请求重启
/// 
/// 这个端点会:
/// 1. 验证配置的有效性
/// 2. 将配置保存为环境变量格式（供调用者重启时使用）
/// 3. 返回需要设置的环境变量
/// 
/// z-agent 需要:
/// 1. 调用此端点获取环境变量
/// 2. 使用新的环境变量重启 llm-link 进程
pub async fn update_config_for_restart(
    State(_state): State<AppState>,
    Json(request): Json<UpdateConfigRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("🔧 Preparing config update for provider: {}", request.provider);
    
    // 验证 provider 和生成默认 model
    let default_model = request.model.clone().or_else(|| {
        match request.provider.as_str() {
            "openai" => Some("gpt-4o".to_string()),
            "anthropic" => Some("claude-3-5-sonnet-20241022".to_string()),
            "zhipu" => Some("glm-4-flash".to_string()),
            "ollama" => Some("llama2".to_string()),
            "aliyun" => Some("qwen-turbo".to_string()),
            "volcengine" => Some("ep-20241023xxxxx-xxxxx".to_string()),
            "tencent" => Some("hunyuan-lite".to_string()),
            _ => None,
        }
    });
    
    let model = match default_model {
        Some(m) => m,
        None => {
            error!("❌ Unknown provider: {}", request.provider);
            return Err(StatusCode::BAD_REQUEST);
        }
    };
    
    // 构建环境变量
    let mut env_vars = serde_json::Map::new();
    
    // 添加 provider 对应的 API key 环境变量
    let api_key_var = match request.provider.as_str() {
        "openai" => "OPENAI_API_KEY",
        "anthropic" => "ANTHROPIC_API_KEY",
        "zhipu" => "ZHIPU_API_KEY",
        "aliyun" => "ALIYUN_API_KEY",
        "volcengine" => "VOLCENGINE_API_KEY",
        "tencent" => "TENCENT_API_KEY",
        "ollama" => "", // Ollama 不需要 API key
        _ => return Err(StatusCode::BAD_REQUEST),
    };
    
    if !api_key_var.is_empty() {
        env_vars.insert(api_key_var.to_string(), json!(request.api_key));
    }
    
    // 添加 base_url（如果提供）
    if let Some(base_url) = request.base_url {
        let base_url_var = match request.provider.as_str() {
            "openai" => "OPENAI_BASE_URL",
            "zhipu" => "ZHIPU_BASE_URL",
            "ollama" => "OLLAMA_BASE_URL",
            _ => "",
        };
        if !base_url_var.is_empty() {
            env_vars.insert(base_url_var.to_string(), json!(base_url));
        }
    }
    
    info!("✅ Config prepared for restart with provider: {}", request.provider);
    
    Ok(Json(json!({
        "status": "success",
        "message": format!("Config prepared for provider: {}", request.provider),
        "restart_required": true,
        "current_instance_id": get_instance_id(),
        "env_vars": env_vars,
        "cli_args": {
            "provider": request.provider,
            "model": model,
        }
    })))
}

/// 验证 API Key 是否有效
/// 
/// 通过尝试创建一个临时的 Service 并列出模型来验证
pub async fn validate_key(
    State(_state): State<AppState>,
    Json(request): Json<UpdateConfigRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    use crate::settings::LlmBackendSettings;
    use crate::service::Service;
    
    info!("🔍 Validating API key for provider: {} (key: {})", request.provider, mask_api_key(&request.api_key));
    
    // 构建测试用的 backend settings
    let model = request.model.clone().unwrap_or_else(|| "test-model".to_string());
    
    let test_backend = match request.provider.as_str() {
        "openai" => LlmBackendSettings::OpenAI {
            api_key: request.api_key.clone(),
            base_url: request.base_url.clone(),
            model,
        },
        "anthropic" => LlmBackendSettings::Anthropic {
            api_key: request.api_key.clone(),
            model,
        },
        "zhipu" => LlmBackendSettings::Zhipu {
            api_key: request.api_key.clone(),
            base_url: request.base_url.clone(),
            model,
        },
        "ollama" => LlmBackendSettings::Ollama {
            base_url: request.base_url.clone(),
            model,
        },
        "aliyun" => LlmBackendSettings::Aliyun {
            api_key: request.api_key.clone(),
            model,
        },
        "volcengine" => LlmBackendSettings::Volcengine {
            api_key: request.api_key.clone(),
            model,
        },
        "tencent" => LlmBackendSettings::Tencent {
            api_key: request.api_key.clone(),
            model,
        },
        _ => {
            error!("❌ Unsupported provider: {}", request.provider);
            return Err(StatusCode::BAD_REQUEST);
        }
    };
    
    // 尝试创建 service 并列出模型
    match Service::new(&test_backend) {
        Ok(service) => {
            match service.list_models().await {
                Ok(models) => {
                    info!("✅ API key validated successfully, found {} models", models.len());
                    Ok(Json(json!({
                        "status": "valid",
                        "message": "API key is valid",
                        "models": models.iter().map(|m| &m.id).collect::<Vec<_>>(),
                    })))
                }
                Err(e) => {
                    error!("❌ API key validation failed: {:?}", e);
                    Ok(Json(json!({
                        "status": "invalid",
                        "message": format!("Failed to list models: {}", e),
                    })))
                }
            }
        }
        Err(e) => {
            error!("❌ Failed to create service: {:?}", e);
            Ok(Json(json!({
                "status": "error",
                "message": format!("Failed to create service: {}", e),
            })))
        }
    }
}

/// 获取当前进程 PID
/// 
/// z-agent 可以使用这个 PID 来管理进程（如重启）
pub async fn get_pid() -> Json<serde_json::Value> {
    let pid = std::process::id();
    
    Json(json!({
        "pid": pid,
        "message": "Use this PID to restart the service"
    }))
}

/// 验证 API Key（用于热更新）
///
/// 专门用于热更新场景的 API Key 验证
pub async fn validate_key_for_update(
    State(_state): State<AppState>,
    Json(request): Json<UpdateKeyRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    use crate::settings::LlmBackendSettings;
    use crate::service::Service;

    info!("🔍 Validating API key for hot update - provider: {} (key: {})", request.provider, mask_api_key(&request.api_key));

    // 使用默认模型进行测试
    let model = match request.provider.as_str() {
        "openai" => "gpt-4o".to_string(),
        "anthropic" => "claude-3-5-sonnet-20241022".to_string(),
        "zhipu" => "glm-4-flash".to_string(),
        "ollama" => "llama2".to_string(),
        "aliyun" => "qwen-turbo".to_string(),
        "volcengine" => "ep-20241023xxxxx-xxxxx".to_string(),
        "tencent" => "hunyuan-lite".to_string(),
        _ => {
            error!("❌ Unsupported provider: {}", request.provider);
            return Err(StatusCode::BAD_REQUEST);
        }
    };

    let test_backend = match request.provider.as_str() {
        "openai" => LlmBackendSettings::OpenAI {
            api_key: request.api_key.clone(),
            base_url: request.base_url.clone(),
            model,
        },
        "anthropic" => LlmBackendSettings::Anthropic {
            api_key: request.api_key.clone(),
            model,
        },
        "zhipu" => LlmBackendSettings::Zhipu {
            api_key: request.api_key.clone(),
            base_url: request.base_url.clone(),
            model,
        },
        "ollama" => LlmBackendSettings::Ollama {
            base_url: request.base_url.clone(),
            model,
        },
        "aliyun" => LlmBackendSettings::Aliyun {
            api_key: request.api_key.clone(),
            model,
        },
        "volcengine" => LlmBackendSettings::Volcengine {
            api_key: request.api_key.clone(),
            model,
        },
        "tencent" => LlmBackendSettings::Tencent {
            api_key: request.api_key.clone(),
            model,
        },
        _ => {
            error!("❌ Unsupported provider: {}", request.provider);
            return Err(StatusCode::BAD_REQUEST);
        }
    };

    // 尝试创建 service 并列出模型
    match Service::new(&test_backend) {
        Ok(service) => {
            match service.list_models().await {
                Ok(models) => {
                    info!("✅ API key validated successfully for hot update, found {} models", models.len());
                    Ok(Json(json!({
                        "status": "valid",
                        "message": "API key is valid and ready for hot update",
                        "provider": request.provider,
                        "models": models.iter().map(|m| &m.id).collect::<Vec<_>>(),
                        "supports_hot_reload": true,
                    })))
                }
                Err(e) => {
                    error!("❌ API key validation failed for hot update: {:?}", e);
                    Ok(Json(json!({
                        "status": "invalid",
                        "message": format!("Failed to list models: {}", e),
                        "provider": request.provider,
                    })))
                }
            }
        }
        Err(e) => {
            error!("❌ Failed to create service for hot update validation: {:?}", e);
            Ok(Json(json!({
                "status": "error",
                "message": format!("Failed to create service: {}", e),
                "provider": request.provider,
            })))
        }
    }
}

/// 运行时更新 API Key
///
/// 这个端点允许在不重启服务的情况下更新指定 provider 的 API Key
pub async fn update_key(
    State(state): State<AppState>,
    Json(request): Json<UpdateKeyRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // 验证输入
    if let Err(e) = validate_provider(&request.provider) {
        error!("❌ Invalid provider: {}", e);
        return Err(StatusCode::BAD_REQUEST);
    }

    if request.provider != "ollama" {
        if let Err(e) = validate_api_key(&request.provider, &request.api_key) {
            error!("❌ Invalid API key format: {}", e);
            return Ok(Json(json!({
                "status": "error",
                "message": format!("Invalid API key format: {}", e),
            })));
        }
    }

    info!("🔧 Updating API key for provider: {} (key: {})", request.provider, mask_api_key(&request.api_key));

    // 获取当前配置
    let current_config = state.get_current_config();

    // 构建新的 backend settings
    let new_backend = match request.provider.as_str() {
        "openai" => {
            if let crate::settings::LlmBackendSettings::OpenAI { model, .. } = &current_config.llm_backend {
                crate::settings::LlmBackendSettings::OpenAI {
                    api_key: request.api_key.clone(),
                    base_url: request.base_url.clone(),
                    model: model.clone(),
                }
            } else {
                // 如果当前不是 OpenAI，使用默认模型
                crate::settings::LlmBackendSettings::OpenAI {
                    api_key: request.api_key.clone(),
                    base_url: request.base_url.clone(),
                    model: "gpt-4o".to_string(),
                }
            }
        }
        "anthropic" => {
            if let crate::settings::LlmBackendSettings::Anthropic { model, .. } = &current_config.llm_backend {
                crate::settings::LlmBackendSettings::Anthropic {
                    api_key: request.api_key.clone(),
                    model: model.clone(),
                }
            } else {
                crate::settings::LlmBackendSettings::Anthropic {
                    api_key: request.api_key.clone(),
                    model: "claude-3-5-sonnet-20241022".to_string(),
                }
            }
        }
        "zhipu" => {
            if let crate::settings::LlmBackendSettings::Zhipu { model, .. } = &current_config.llm_backend {
                crate::settings::LlmBackendSettings::Zhipu {
                    api_key: request.api_key.clone(),
                    base_url: request.base_url.clone(),
                    model: model.clone(),
                }
            } else {
                crate::settings::LlmBackendSettings::Zhipu {
                    api_key: request.api_key.clone(),
                    base_url: request.base_url.clone(),
                    model: "glm-4-flash".to_string(),
                }
            }
        }
        "aliyun" => {
            if let crate::settings::LlmBackendSettings::Aliyun { model, .. } = &current_config.llm_backend {
                crate::settings::LlmBackendSettings::Aliyun {
                    api_key: request.api_key.clone(),
                    model: model.clone(),
                }
            } else {
                crate::settings::LlmBackendSettings::Aliyun {
                    api_key: request.api_key.clone(),
                    model: "qwen-turbo".to_string(),
                }
            }
        }
        "volcengine" => {
            if let crate::settings::LlmBackendSettings::Volcengine { model, .. } = &current_config.llm_backend {
                crate::settings::LlmBackendSettings::Volcengine {
                    api_key: request.api_key.clone(),
                    model: model.clone(),
                }
            } else {
                crate::settings::LlmBackendSettings::Volcengine {
                    api_key: request.api_key.clone(),
                    model: "ep-20241023xxxxx-xxxxx".to_string(),
                }
            }
        }
        "tencent" => {
            if let crate::settings::LlmBackendSettings::Tencent { model, .. } = &current_config.llm_backend {
                crate::settings::LlmBackendSettings::Tencent {
                    api_key: request.api_key.clone(),
                    model: model.clone(),
                }
            } else {
                crate::settings::LlmBackendSettings::Tencent {
                    api_key: request.api_key.clone(),
                    model: "hunyuan-lite".to_string(),
                }
            }
        }
        "ollama" => {
            if let crate::settings::LlmBackendSettings::Ollama { model, .. } = &current_config.llm_backend {
                crate::settings::LlmBackendSettings::Ollama {
                    base_url: request.base_url.clone(),
                    model: model.clone(),
                }
            } else {
                crate::settings::LlmBackendSettings::Ollama {
                    base_url: request.base_url.clone(),
                    model: "llama2".to_string(),
                }
            }
        }
        _ => {
            error!("❌ Unsupported provider: {}", request.provider);
            return Err(StatusCode::BAD_REQUEST);
        }
    };

    // 尝试更新服务
    match state.update_llm_service(&new_backend) {
        Ok(()) => {
            info!("✅ API key updated successfully for provider: {}", request.provider);
            Ok(Json(json!({
                "status": "success",
                "message": format!("API key updated for provider: {}", request.provider),
                "provider": request.provider,
                "restart_required": false,
            })))
        }
        Err(e) => {
            error!("❌ Failed to update API key: {:?}", e);
            Ok(Json(json!({
                "status": "error",
                "message": format!("Failed to update API key: {}", e),
            })))
        }
    }
}

/// 切换 Provider
///
/// 这个端点允许动态切换当前使用的 LLM 服务商
pub async fn switch_provider(
    State(state): State<AppState>,
    Json(request): Json<SwitchProviderRequest>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    // 验证输入
    if let Err(e) = validate_provider(&request.provider) {
        error!("❌ Invalid provider: {}", e);
        return Err(StatusCode::BAD_REQUEST);
    }

    let masked_key = request.api_key.as_ref().map(|k| mask_api_key(k)).unwrap_or_else(|| "none".to_string());
    info!("🔄 Switching to provider: {} (key: {})", request.provider, masked_key);

    // 获取当前配置
    let current_config = state.get_current_config();

    // 确定 API key
    let api_key = if let Some(key) = request.api_key {
        key
    } else {
        // 尝试从当前配置中获取对应 provider 的 API key
        match request.provider.as_str() {
            "openai" => {
                if let crate::settings::LlmBackendSettings::OpenAI { api_key, .. } = &current_config.llm_backend {
                    api_key.clone()
                } else {
                    error!("❌ No API key provided for OpenAI and none found in current config");
                    return Err(StatusCode::BAD_REQUEST);
                }
            }
            "anthropic" => {
                if let crate::settings::LlmBackendSettings::Anthropic { api_key, .. } = &current_config.llm_backend {
                    api_key.clone()
                } else {
                    error!("❌ No API key provided for Anthropic and none found in current config");
                    return Err(StatusCode::BAD_REQUEST);
                }
            }
            "zhipu" => {
                if let crate::settings::LlmBackendSettings::Zhipu { api_key, .. } = &current_config.llm_backend {
                    api_key.clone()
                } else {
                    error!("❌ No API key provided for Zhipu and none found in current config");
                    return Err(StatusCode::BAD_REQUEST);
                }
            }
            "ollama" => String::new(), // Ollama 不需要 API key
            _ => {
                error!("❌ Unsupported provider: {}", request.provider);
                return Err(StatusCode::BAD_REQUEST);
            }
        }
    };

    // 确定模型
    let model = request.model.unwrap_or_else(|| {
        match request.provider.as_str() {
            "openai" => "gpt-4o".to_string(),
            "anthropic" => "claude-3-5-sonnet-20241022".to_string(),
            "zhipu" => "glm-4-flash".to_string(),
            "ollama" => "llama2".to_string(),
            "aliyun" => "qwen-turbo".to_string(),
            "volcengine" => "ep-20241023xxxxx-xxxxx".to_string(),
            "tencent" => "hunyuan-lite".to_string(),
            _ => "default-model".to_string(),
        }
    });

    // 构建新的 backend settings
    let new_backend = match request.provider.as_str() {
        "openai" => crate::settings::LlmBackendSettings::OpenAI {
            api_key,
            base_url: request.base_url,
            model,
        },
        "anthropic" => crate::settings::LlmBackendSettings::Anthropic {
            api_key,
            model,
        },
        "zhipu" => crate::settings::LlmBackendSettings::Zhipu {
            api_key,
            base_url: request.base_url,
            model,
        },
        "ollama" => crate::settings::LlmBackendSettings::Ollama {
            base_url: request.base_url,
            model,
        },
        "aliyun" => crate::settings::LlmBackendSettings::Aliyun {
            api_key,
            model,
        },
        "volcengine" => crate::settings::LlmBackendSettings::Volcengine {
            api_key,
            model,
        },
        "tencent" => crate::settings::LlmBackendSettings::Tencent {
            api_key,
            model,
        },
        _ => {
            error!("❌ Unsupported provider: {}", request.provider);
            return Err(StatusCode::BAD_REQUEST);
        }
    };

    // 尝试更新服务
    match state.update_llm_service(&new_backend) {
        Ok(()) => {
            info!("✅ Provider switched successfully to: {}", request.provider);
            Ok(Json(json!({
                "status": "success",
                "message": format!("Provider switched to: {}", request.provider),
                "provider": request.provider,
                "model": new_backend.get_model(),
                "restart_required": false,
            })))
        }
        Err(e) => {
            error!("❌ Failed to switch provider: {:?}", e);
            Ok(Json(json!({
                "status": "error",
                "message": format!("Failed to switch provider: {}", e),
            })))
        }
    }
}

/// 触发优雅关闭
///
/// 注意：这需要配合信号处理才能实现优雅关闭
/// z-agent 应该先调用此端点，等待响应后再启动新进程
pub async fn shutdown() -> Json<serde_json::Value> {
    info!("🛑 Shutdown requested via API");

    // 在实际应用中，这里应该触发优雅关闭
    // 目前只返回成功，让调用方决定如何重启

    Json(json!({
        "status": "success",
        "message": "Shutdown signal sent. Please restart with new configuration.",
    }))
}
