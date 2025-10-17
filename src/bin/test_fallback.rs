use llm_link::models::ModelsConfig;

fn main() {
    println!("Testing fallback behavior...");
    
    // Test loading from file (should work)
    println!("\n🔧 Testing file loading:");
    match ModelsConfig::load_from_file("configs/models.yaml") {
        Ok(config) => {
            let openai_models = config.get_models_for_provider("openai");
            println!("✅ Loaded from file: {} OpenAI models", openai_models.len());
        }
        Err(e) => {
            println!("❌ Failed to load from file: {}", e);
        }
    }
    
    // Test loading from non-existent file (should fail)
    println!("\n🔧 Testing non-existent file:");
    match ModelsConfig::load_from_file("configs/non-existent.yaml") {
        Ok(_) => {
            println!("❌ Unexpectedly loaded from non-existent file");
        }
        Err(e) => {
            println!("✅ Expected failure: {}", e);
        }
    }
    
    // Test load_with_fallback (should always work)
    println!("\n🔧 Testing load_with_fallback:");
    let config = ModelsConfig::load_with_fallback();
    let openai_models = config.get_models_for_provider("openai");
    println!("✅ Fallback loaded: {} OpenAI models", openai_models.len());
    
    // Test default configuration (embedded)
    println!("\n🔧 Testing default configuration:");
    let default_config = ModelsConfig::default();
    let default_openai_models = default_config.get_models_for_provider("openai");
    println!("✅ Default config: {} OpenAI models", default_openai_models.len());
    
    println!("\n✅ All fallback tests completed!");
}
