use llm_link::models::ModelsConfig;

fn main() {
    println!("Testing models configuration...");
    
    // Test loading configuration
    let config = ModelsConfig::load_with_fallback();
    
    // Test different providers
    let providers = ["openai", "anthropic", "zhipu", "ollama", "aliyun"];
    
    for provider in providers {
        println!("\n🔧 {} models:", provider.to_uppercase());
        let models = config.get_models_for_provider(provider);
        for model in models {
            println!("  - {} ({})", model.id, model.description);
        }
    }
    
    println!("\n✅ Models configuration test completed!");
}
