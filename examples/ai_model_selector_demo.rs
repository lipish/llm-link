use std::io::{self, Write};
use serde_json::json;
use reqwest;

const BASE_URL: &str = "http://localhost:11434";

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🚀 Model Selector Demo");
    println!("=====================\n");

    // 1. 首先检查服务是否运行
    println!("📡 检查服务状态...");
    match check_service().await {
        Ok(_) => println!("✅ 服务运行正常\n"),
        Err(e) => {
            eprintln!("❌ 服务未运行: {}", e);
            eprintln!("\n请先启动 llm-link 服务：");
            eprintln!("  cargo run -- --app zed --provider zhipu --model glm-4-flash");
            return Ok(());
        }
    }

    // 2. 获取当前配置
    println!("📋 获取当前配置...");
    let current_config = get_current_config().await?;
    println!("   当前 Provider: {}", current_config["provider"]);
    println!("   当前 Model: {}", current_config["model"]);
    println!("   支持热重载: {}\n", current_config["supports_hot_reload"]);

    // 3. 显示所有可用的 providers 和 models
    println!("📚 获取所有支持的 Providers 和 Models...");
    let info = get_info().await?;
    
    if let Some(providers) = info.get("supported_providers").and_then(|p| p.as_array()) {
        println!("   找到 {} 个 providers:\n", providers.len());
        for provider in providers {
            let name = provider["name"].as_str().unwrap_or("unknown");
            let empty_vec = Vec::new();
            let models = provider["models"].as_array().unwrap_or(&empty_vec);
            println!("   🔹 {} ({} 个模型)", name, models.len());
            for model in models.iter().take(3) {
                let id = model["id"].as_str().unwrap_or("");
                let name = model["name"].as_str().unwrap_or(id);
                println!("      • {} - {}", name, id);
            }
            if models.len() > 3 {
                println!("      ... 还有 {} 个模型", models.len() - 3);
            }
            println!();
        }
    }

    // 4. 演示模型选择器功能
    println!("🎯 Model Selector 演示");
    println!("=====================\n");

    // 模拟用户输入
    println!("请输入要测试的 Provider (例如: openai, anthropic, zhipu):");
    print!("> ");
    io::stdout().flush()?;
    
    let mut provider = String::new();
    io::stdin().read_line(&mut provider)?;
    let provider = provider.trim().to_lowercase();

    println!("\n请输入 API Key (或按 Enter 跳过验证):");
    print!("> ");
    io::stdout().flush()?;
    
    let mut api_key = String::new();
    io::stdin().read_line(&mut api_key)?;
    let api_key = api_key.trim();

    if api_key.is_empty() {
        println!("\n⚠️  跳过 API Key 验证，直接显示配置中的模型列表\n");
        show_models_from_config(&provider).await?;
    } else {
        println!("\n🔍 验证 API Key 并获取可用模型...\n");
        
        match validate_key(&provider, api_key).await {
            Ok(response) => {
                let status = response["status"].as_str().unwrap_or("");
                if status == "valid" {
                    println!("✅ API Key 验证成功！\n");
                    
                    if let Some(models) = response.get("models").and_then(|m| m.as_array()) {
                        println!("📋 可用模型列表 ({} 个):\n", models.len());
                        display_model_selector(models);
                    } else {
                        println!("⚠️  未找到模型列表");
                    }
                } else {
                    println!("❌ API Key 验证失败: {}", response["message"].as_str().unwrap_or("未知错误"));
                }
            }
            Err(e) => {
                eprintln!("❌ 验证失败: {}", e);
            }
        }
    }

    Ok(())
}

async fn check_service() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let url = format!("{}/api/health", BASE_URL);
    let response = client.get(&url).send().await?;
    
    if response.status().is_success() {
        Ok(())
    } else {
        Err("服务未运行".into())
    }
}

async fn get_current_config() -> Result<serde_json::Value, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let url = format!("{}/api/config/current", BASE_URL);
    let response = client.get(&url).send().await?;
    let json: serde_json::Value = response.json().await?;
    Ok(json)
}

async fn get_info() -> Result<serde_json::Value, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let url = format!("{}/api/info", BASE_URL);
    let response = client.get(&url).send().await?;
    let json: serde_json::Value = response.json().await?;
    Ok(json)
}

async fn validate_key(provider: &str, api_key: &str) -> Result<serde_json::Value, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let url = format!("{}/api/config/validate-key", BASE_URL);
    
    let payload = json!({
        "provider": provider,
        "api_key": api_key
    });

    let response = client
        .post(&url)
        .json(&payload)
        .send()
        .await?;

    let json: serde_json::Value = response.json().await?;
    Ok(json)
}

async fn show_models_from_config(provider: &str) -> Result<(), Box<dyn std::error::Error>> {
    let info = get_info().await?;
    
    if let Some(providers) = info.get("supported_providers").and_then(|p| p.as_array()) {
        if let Some(provider_info) = providers.iter().find(|p| {
            p["name"].as_str().unwrap_or("") == provider
        }) {
            if let Some(models) = provider_info.get("models").and_then(|m| m.as_array()) {
                println!("📋 {} 的模型列表 ({} 个):\n", provider, models.len());
                display_model_selector(models);
            } else {
                println!("⚠️  未找到 {} 的模型", provider);
            }
        } else {
            println!("❌ 未找到 provider: {}", provider);
        }
    }

    Ok(())
}

fn display_model_selector(models: &[serde_json::Value]) {
    println!("┌─────────────────────────────────────────────────────────────┐");
    println!("│                     Model Selector                           │");
    println!("├─────────────────────────────────────────────────────────────┤");
    
    for (index, model) in models.iter().enumerate() {
        let id = model["id"].as_str().unwrap_or("");
        let name = model["name"].as_str().unwrap_or(id);
        let description = model["description"].as_str().unwrap_or("");
        
        println!("│ {:2}. {}", index + 1, format!("{:<20} {}", name, id));
        if !description.is_empty() {
            println!("│     └─ {}", description);
        }
    }
    
    println!("└─────────────────────────────────────────────────────────────┘");
    println!("\n请选择模型编号 (1-{}):", models.len());
}

