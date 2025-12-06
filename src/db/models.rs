use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Provider {
    pub id: i64,
    pub name: String,
    #[sqlx(rename = "type")]
    pub provider_type: String,
    pub config: String,  // JSON string
    pub enabled: bool,
    pub priority: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewProvider {
    pub name: String,
    pub provider_type: String,
    pub config: String,
    pub enabled: bool,
    pub priority: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateProvider {
    pub name: Option<String>,
    pub provider_type: Option<String>,
    pub config: Option<String>,
    pub enabled: Option<bool>,
    pub priority: Option<i32>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Config {
    pub key: String,
    pub value: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProviderStats {
    pub total: usize,
    pub enabled: usize,
    pub disabled: usize,
}

impl Provider {
    #[allow(dead_code)] // Will be used in Phase 2 for provider creation
    pub fn new(name: String, provider_type: String, config: String) -> Self {
        let now = Utc::now();
        Self {
            id: 0,  // Will be set by database
            name,
            provider_type,
            config,
            enabled: true,
            priority: 0,
            created_at: now,
            updated_at: now,
        }
    }

    #[allow(dead_code)] // Will be used in Phase 2 for provider conversion
    pub fn from_new(new_provider: NewProvider) -> Self {
        let now = Utc::now();
        Self {
            id: 0,
            name: new_provider.name,
            provider_type: new_provider.provider_type,
            config: new_provider.config,
            enabled: new_provider.enabled,
            priority: new_provider.priority,
            created_at: now,
            updated_at: now,
        }
    }
}

impl NewProvider {
    pub fn new(name: String, provider_type: String, config: String) -> Self {
        Self {
            name,
            provider_type,
            config,
            enabled: true,
            priority: 0,
        }
    }
}
