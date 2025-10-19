use crate::apps::{SupportedApp, AppInfoProvider};
use tracing::error;

/// 列出所有支持的应用
pub fn list_applications() {
    println!("📱 Supported Applications:");
    println!();

    for app in SupportedApp::all() {
        let info = AppInfoProvider::get_app_info(&app);
        println!("  {} - {}", app.name(), info.description);
        println!("    Port: {}", info.port);
        println!("    Protocol: {}", info.protocol);
        println!();
    }

    println!("💡 Usage:");
    println!("  ./llm-link --app <app-name> --provider <provider>");
    println!();
    println!("📚 For detailed setup:");
    println!("  ./llm-link --app-info <app-name>");
}

/// 显示应用详细信息
pub fn show_application_info(app_name: &str) {
    if let Some(app) = SupportedApp::from_str(app_name) {
        let info = AppInfoProvider::get_app_info(&app);

        println!("📱 {} Configuration", info.name);
        println!("   Description: {}", info.description);
        println!("   Port: {}", info.port);
        println!("   Protocol: {}", info.protocol);
        println!("   Endpoints: {}", info.endpoints.join(", "));
        println!("   Auth Required: {}", if info.auth_required { "Yes" } else { "No" });
        println!();

        println!("🔧 Required Parameters:");
        println!();
        println!("⚠️  You MUST specify --provider and corresponding API key:");
        println!();
        println!("   --provider openai      (requires OPENAI_API_KEY)");
        println!("   --provider anthropic   (requires ANTHROPIC_API_KEY)");
        println!("   --provider zhipu       (requires ZHIPU_API_KEY)");
        println!("   --provider aliyun      (requires ALIYUN_API_KEY)");
        println!("   --provider ollama      (no API key needed)");
        println!();
        
        if info.auth_required {
            println!("   --api-key <TOKEN>      (or set LLM_LINK_API_KEY env var)");
            println!();
        }

        println!("💡 Example:");
        println!();
        println!("   export OPENAI_API_KEY=\"sk-xxx\"");
        if info.auth_required {
            println!("   export LLM_LINK_API_KEY=\"your-auth-token\"");
        }
        println!("   ./llm-link --app {} --provider openai", app_name);
        println!();
        println!("   # Or use a different provider:");
        println!("   export ANTHROPIC_API_KEY=\"sk-ant-xxx\"");
        if info.auth_required {
            println!("   export LLM_LINK_API_KEY=\"your-auth-token\"");
        }
        println!("   ./llm-link --app {} --provider anthropic", app_name);
        println!();
    } else {
        error!("❌ Unknown application: {}", app_name);
        println!();
        println!("Available applications:");
        for app in SupportedApp::all() {
            println!("  - {}", app.name());
        }
    }
}

