pub mod setup;
pub mod handlers;

pub use setup::*;
pub use handlers::*;

use axum::{Router, routing::{get, post}, response::Html};
use crate::db::DatabasePool;

/// Create admin web application
pub fn create_admin_app(db_pool: DatabasePool) -> Router {
    Router::new()
        .route("/", get(setup_wizard_page))
        .route("/setup", get(setup_wizard_page).post(handle_setup_form))
        .route("/api/providers", get(list_providers_api).post(create_provider_api))
        .route("/api/providers/stats", get(get_provider_stats_api))
        .route("/api/providers/:id", get(get_provider_api).put(update_provider_api).delete(delete_provider_api))
        .route("/api/providers/:id/toggle", post(toggle_provider_api))
        .route("/api/test-provider/:id", post(test_provider_api))
        .with_state(db_pool)
}

/// HTML for setup wizard
#[allow(dead_code)] // Will be used in Phase 2 static file serving
pub fn setup_wizard_html() -> Html<String> {
    Html(include_str!("../static/setup.html").to_string())
}
