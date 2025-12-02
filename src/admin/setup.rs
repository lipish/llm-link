use axum::{extract::State, response::Html, Json};
use serde::{Deserialize, Serialize};
use crate::db::{DatabasePool, NewProvider};
use anyhow::Result;

#[derive(Debug, Deserialize)]
pub struct SetupForm {
    pub name: String,
    pub provider_type: String,
    pub config: String,
}

#[derive(Debug, Serialize)]
pub struct SetupResponse {
    pub success: bool,
    pub message: String,
}

/// Show setup wizard page
pub async fn setup_wizard_page(State(db_pool): State<DatabasePool>) -> Html<String> {
    // Check if setup is already completed
    if let Ok(setup_completed) = db_pool.get_config("setup_completed").await {
        if setup_completed.as_deref() == Some("true") {
            // Redirect to main admin page if setup is done
            return Html(include_str!("../static/admin.html").to_string());
        }
    }
    
    Html(include_str!("../static/setup.html").to_string())
}

/// Handle setup form submission
pub async fn handle_setup_form(
    State(db_pool): State<DatabasePool>,
    Json(form): Json<SetupForm>,
) -> Result<Json<SetupResponse>, axum::http::StatusCode> {
    // Validate form data
    if form.name.is_empty() {
        return Ok(Json(SetupResponse {
            success: false,
            message: "Provider name cannot be empty".to_string(),
        }));
    }
    
    if form.provider_type.is_empty() {
        return Ok(Json(SetupResponse {
            success: false,
            message: "Provider type cannot be empty".to_string(),
        }));
    }
    
    // Validate JSON config
    let config_json: serde_json::Value = match serde_json::from_str(&form.config) {
        Ok(config) => config,
        Err(e) => {
            return Ok(Json(SetupResponse {
                success: false,
                message: format!("Invalid JSON config: {}", e),
            }));
        }
    };
    
    // Validate required fields in config based on provider type
    if !validate_provider_config(&form.provider_type, &config_json) {
        return Ok(Json(SetupResponse {
            success: false,
            message: "Missing required fields in provider config".to_string(),
        }));
    }
    
    // Create provider in database
    let new_provider = NewProvider::new(form.name, form.provider_type, form.config);
    
    match db_pool.create_provider(new_provider).await {
        Ok(provider_id) => {
            // Mark setup as completed
            if let Err(e) = db_pool.set_config("setup_completed", "true").await {
                tracing::error!("Failed to mark setup as completed: {}", e);
            }
            
            tracing::info!("Created provider with ID: {}", provider_id);
            
            Ok(Json(SetupResponse {
                success: true,
                message: "Provider created successfully".to_string(),
            }))
        }
        Err(e) => {
            tracing::error!("Failed to create provider: {}", e);
            
            Ok(Json(SetupResponse {
                success: false,
                message: format!("Failed to create provider: {}", e),
            }))
        }
    }
}

/// Validate provider configuration based on type
fn validate_provider_config(provider_type: &str, config: &serde_json::Value) -> bool {
    match provider_type {
        "openai" => {
            config.get("api_key").and_then(|v| v.as_str()).map(|s| !s.is_empty()).unwrap_or(false)
                && config.get("model").and_then(|v| v.as_str()).map(|s| !s.is_empty()).unwrap_or(false)
        }
        "zhipu" => {
            config.get("api_key").and_then(|v| v.as_str()).map(|s| !s.is_empty()).unwrap_or(false)
                && config.get("model").and_then(|v| v.as_str()).map(|s| !s.is_empty()).unwrap_or(false)
        }
        "anthropic" => {
            config.get("api_key").and_then(|v| v.as_str()).map(|s| !s.is_empty()).unwrap_or(false)
                && config.get("model").and_then(|v| v.as_str()).map(|s| !s.is_empty()).unwrap_or(false)
        }
        "ollama" => {
            config.get("model").and_then(|v| v.as_str()).map(|s| !s.is_empty()).unwrap_or(false)
        }
        _ => false, // Unknown provider type
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;
    
    #[test]
    fn test_validate_openai_config() {
        let valid_config = json!({
            "api_key": "sk-test123",
            "model": "gpt-4"
        });
        assert!(validate_provider_config("openai", &valid_config));
        
        let invalid_config = json!({
            "model": "gpt-4"
        });
        assert!(!validate_provider_config("openai", &invalid_config));
    }
    
    #[test]
    fn test_validate_ollama_config() {
        let valid_config = json!({
            "model": "llama2"
        });
        assert!(validate_provider_config("ollama", &valid_config));
        
        let invalid_config = json!({});
        assert!(!validate_provider_config("ollama", &invalid_config));
    }
}
