# Model List Management

LLM Link implements intelligent model management with API integration and configuration fallbacks.

## 🎯 Design Philosophy

**Hybrid Approach**: Combine real-time API data (where available) with curated configuration files to provide accurate and comprehensive model lists.

## 🔧 How It Works

1. **Ollama Special Handling**: Uses `ollama.models()` API to get actually installed models
2. **Configuration Fallback**: For other providers or when APIs fail, uses curated model lists from `configs/models.yaml`
3. **Data Source Transparency**: All model information includes source documentation links
4. **Graceful Degradation**: System always works even if APIs are unavailable

## 🏗️ Architecture

- **llm-connector**: Basic library for LLM communication (no model management)
- **llm-link**: Model management, availability checking, and configuration
- **Configuration Files**: Curated by llm-link team with official data sources

## 📋 Model Sources

### Ollama (API-First)
- **Primary**: `ollama.models()` API - gets actually installed models
- **Fallback**: Configuration file with popular models
- **Benefit**: Only shows models you can actually use

### Other Providers (Embedded Data)
- **Source**: `src/models/models.yaml` embedded in binary
- **Data Sources**: Official provider documentation (see file header)
- **Updates**: Maintained by llm-link team, requires rebuild to update

## 📁 Directory Structure

### Core Model Data
- **`src/models/models.yaml`**: Embedded model data (part of binary)
- **`src/models/mod.rs`**: Model configuration loading logic

### File Structure
```yaml
# src/models/models.yaml (embedded in binary)
# Data sources documented at top of file
openai:
  models:
    - id: "gpt-4o"
      name: "GPT-4o"
      description: "GPT-4 Omni model with multimodal capabilities"
    # ... more models

anthropic:
  models:
    - id: "claude-3-5-sonnet-20241022"
      name: "Claude 3.5 Sonnet"
      description: "Latest Claude 3.5 Sonnet model"
    # ... more models
```

## 🎯 Why This Hybrid Approach?

### Ollama Special Case
- **Local Installation**: Ollama models are locally installed, so API can tell us exactly what's available
- **Dynamic**: Users install/remove models frequently
- **Accurate**: No point showing models that aren't installed

### Other Providers
- **Remote APIs**: Models are hosted remotely, availability is generally stable
- **Rich Metadata**: Embedded configuration provides descriptions and categorization
- **Curated Lists**: Maintained with official data sources for accuracy
- **Embedded Data**: No external file dependencies, always available

### Benefits of Hybrid Approach
- **Accuracy**: Ollama shows only installed models, others show curated lists
- **Reliability**: Embedded data ensures system always works
- **No Dependencies**: Model data embedded in binary, no external files needed
- **Transparency**: Data sources are documented and verifiable

## 🔄 API Endpoints

Model lists are available through standard API endpoints:

### Ollama API
```bash
curl http://localhost:11434/api/tags
```

### OpenAI API  
```bash
curl -H "Authorization: Bearer your-token" http://localhost:8088/v1/models
```

## 📝 Example Response

```json
{
  "models": [
    {
      "name": "glm-4-flash",
      "model": "glm-4-flash", 
      "modified_at": "2024-10-17T02:00:00Z",
      "size": 1000000,
      "digest": "sha256:...",
      "details": {
        "parent_model": "",
        "format": "gguf",
        "family": "glm",
        "families": ["glm"],
        "parameter_size": "7B",
        "quantization_level": "Q4_K_M"
      }
    }
  ]
}
```

## 🧪 Testing Configuration

Use the built-in test tool to verify model configuration:

```bash
cargo run --bin test_models
```

This displays all configured models for each provider and verifies the configuration file loads correctly.

## ✏️ Updating Models

### Modifying Model Lists
1. Edit `src/models/models.yaml` (embedded data)
2. Follow the existing YAML structure
3. Include meaningful descriptions for user experience
4. Rebuild the binary to embed new data

### Adding New Models
```yaml
provider_name:
  models:
    - id: "new-model-id"
      name: "Human Readable Name"
      description: "Clear description of model capabilities"
```

### Data Source Updates
- Update model lists based on official provider documentation
- Include source URLs in file header for verification
- Test with `cargo run --bin test_models` after changes

## 🚀 Benefits

- **Ollama Accuracy**: Shows only actually installed models via API
- **Rich Metadata**: Embedded data provides descriptions and categorization
- **Data Transparency**: Sources documented for verification
- **Zero Dependencies**: No external configuration files needed
- **Always Available**: Model data built into binary
- **Simple Architecture**: No configuration file complexity

## 🔧 Implementation Details

The model listing logic is implemented in `src/llm/models.rs`:

```rust
pub async fn list_models(&self) -> Result<Vec<Model>> {
    // Special handling for Ollama - get actual installed models
    if provider_name == "ollama" {
        if let Some(ollama_client) = self.llm_client.as_ollama() {
            match ollama_client.models().await {
                Ok(ollama_models) => {
                    // Return actual installed models
                    return Ok(models_from_api);
                }
                Err(e) => {
                    // Fall back to configuration file
                }
            }
        }
    }

    // For other providers, use embedded configuration
    let model_infos = self.models_config.get_models_for_provider(provider_name);
    // Convert and return embedded models
}
```

## 📊 Data Sources

Model information is sourced from official documentation:

- **Anthropic**: [Claude Models Overview](https://docs.claude.com/en/docs/about-claude/models/overview)
- **Ollama**: [Ollama Model Search](https://ollama.com/search) + Local API
- **Aliyun**: [Model Studio Models](https://help.aliyun.com/zh/model-studio/models)
- **Zhipu**: [BigModel Platform](https://bigmodel.cn/)
- **OpenAI**: Official documentation and community reports

All sources are documented in the configuration file header for transparency and verification.
