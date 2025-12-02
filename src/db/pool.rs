use sqlx::SqlitePool;
use std::path::Path;
use tracing::info;
use crate::db::{initialize_database, Provider, NewProvider, UpdateProvider};
use anyhow::Result;

#[derive(Clone)]
pub struct DatabasePool {
    pool: SqlitePool,
}

impl DatabasePool {
    /// Create new database pool with migrations
    pub async fn new(db_path: &Path) -> Result<Self> {
        let pool = initialize_database(db_path).await?;
        Ok(Self { pool })
    }

    /// Create in-memory database pool for Phase 1 fallback
    pub async fn new_memory() -> Result<Self> {
        info!("Creating in-memory database pool...");
        let pool = SqlitePool::connect(":memory:").await?;
        
        // Run migrations on in-memory database
        sqlx::migrate!("./migrations").run(&pool).await?;
        
        Ok(Self { pool })
    }

    /// Get the underlying SqlitePool
    #[allow(dead_code)] // Will be used in Phase 2 for advanced database operations
    pub fn inner(&self) -> &SqlitePool {
        &self.pool
    }

    /// Create a new provider
    pub async fn create_provider(&self, provider: NewProvider) -> Result<i64> {
        let result = sqlx::query(
            r#"
            INSERT INTO providers (name, type, config, enabled, priority)
            VALUES (?, ?, ?, ?, ?)
            "#
        )
        .bind(&provider.name)
        .bind(&provider.provider_type)
        .bind(&provider.config)
        .bind(provider.enabled)
        .bind(provider.priority)
        .execute(&self.pool)
        .await?;

        Ok(result.last_insert_rowid())
    }

    /// Get all providers
    pub async fn list_providers(&self) -> Result<Vec<Provider>> {
        let providers = sqlx::query_as::<_, Provider>(
            r#"
            SELECT 
                id,
                name as "name!",
                type as "provider_type!",
                config as "config!",
                enabled as "enabled!",
                priority as "priority!",
                created_at as "created_at!",
                updated_at as "updated_at!"
            FROM providers 
            ORDER BY priority DESC, created_at ASC
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(providers)
    }

    /// Get provider by ID
    pub async fn get_provider(&self, id: i64) -> Result<Option<Provider>> {
        let provider = sqlx::query_as::<_, Provider>(
            r#"
            SELECT 
                id,
                name as "name!",
                type as "provider_type!",
                config as "config!",
                enabled as "enabled!",
                priority as "priority!",
                created_at as "created_at!",
                updated_at as "updated_at!"
            FROM providers 
            WHERE id = ?
            "#
        )
        .bind(id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(provider)
    }

    /// Get enabled providers
    #[allow(dead_code)] // Will be used in Phase 2 for load balancing
    pub async fn get_enabled_providers(&self) -> Result<Vec<Provider>> {
        let providers = sqlx::query_as::<_, Provider>(
            r#"
            SELECT 
                id,
                name as "name!",
                type as "provider_type!",
                config as "config!",
                enabled as "enabled!",
                priority as "priority!",
                created_at as "created_at!",
                updated_at as "updated_at!"
            FROM providers 
            WHERE enabled = true
            ORDER BY priority DESC, created_at ASC
            "#
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(providers)
    }

    /// Update provider
    pub async fn update_provider(&self, id: i64, update: UpdateProvider) -> Result<bool> {
        let mut query = sqlx::QueryBuilder::new("UPDATE providers SET updated_at = CURRENT_TIMESTAMP");
        let mut has_updates = false;

        if let Some(name) = &update.name {
            query.push(", name = ");
            query.push_bind(name);
            has_updates = true;
        }
        if let Some(provider_type) = &update.provider_type {
            query.push(", type = ");
            query.push_bind(provider_type);
            has_updates = true;
        }
        if let Some(config) = &update.config {
            query.push(", config = ");
            query.push_bind(config);
            has_updates = true;
        }
        if let Some(enabled) = update.enabled {
            query.push(", enabled = ");
            query.push_bind(enabled);
            has_updates = true;
        }
        if let Some(priority) = update.priority {
            query.push(", priority = ");
            query.push_bind(priority);
            has_updates = true;
        }

        if !has_updates {
            return Ok(false);
        }

        query.push(" WHERE id = ");
        query.push_bind(id);

        let result = query.build().execute(&self.pool).await?;
        Ok(result.rows_affected() > 0)
    }

    /// Delete provider
    pub async fn delete_provider(&self, id: i64) -> Result<bool> {
        let result = sqlx::query("DELETE FROM providers WHERE id = ?")
            .bind(id)
            .execute(&self.pool)
            .await?;

        Ok(result.rows_affected() > 0)
    }

    /// Check if this is the first run (no providers configured)
    pub async fn is_first_run(&self) -> Result<bool> {
        let count: i64 = sqlx::query_scalar("SELECT COUNT(*) FROM providers")
            .fetch_one(&self.pool)
            .await?;

        Ok(count == 0)
    }

    /// Store configuration value
    pub async fn set_config(&self, key: &str, value: &str) -> Result<()> {
        sqlx::query(
            "INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)"
        )
        .bind(key)
        .bind(value)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    /// Get configuration value
    pub async fn get_config(&self, key: &str) -> Result<Option<String>> {
        let value: Option<String> = sqlx::query_scalar(
            "SELECT value FROM config WHERE key = ?"
        )
        .bind(key)
        .fetch_one(&self.pool)
        .await?;

        Ok(value)
    }

    /// Close the database pool
    #[allow(dead_code)] // Will be used in Phase 2 for graceful shutdown
    pub async fn close(self) {
        self.pool.close().await;
    }
}
