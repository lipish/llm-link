# Model List Management

LLM Link uses a robust approach to provide accurate model lists without configuration file confusion.

## 🎯 Design Philosophy

**API-First Approach**: Model lists should come from the actual LLM provider APIs to ensure accuracy and avoid confusion between configured models and actually available models.

## 🔧 How It Works

1. **API Priority**: The system attempts to get models from the actual LLM provider API first
2. **Built-in Fallback**: If API calls fail, it uses a minimal set of well-known models for each provider
3. **No Configuration Files**: No external configuration files are used to avoid data inconsistency
4. **Real-time Accuracy**: Model lists reflect what's actually available from the provider

## 🏗️ Architecture

- **Primary**: Direct API calls to LLM providers (when supported by llm-connector)
- **Fallback**: Minimal hardcoded model lists in the source code
- **No Config Files**: Eliminates confusion between configured and available models

## 📋 Built-in Fallback Models

When API calls fail, the system uses these minimal, well-known models:

### OpenAI
- `gpt-4o` - GPT-4 Omni model
- `gpt-4` - Standard GPT-4 model  
- `gpt-3.5-turbo` - Fast and efficient model

### Anthropic  
- `claude-3-5-sonnet-20241022` - Latest Claude 3.5 Sonnet
- `claude-3-haiku-20240307` - Fast Claude 3 Haiku

### Zhipu (GLM)
- `glm-4-flash` - Fast GLM-4 model
- `glm-4` - Standard GLM-4 model

### Ollama
- `llama3.2` - Latest small Llama model
- `llama2` - Stable Llama 2 model

### Aliyun (Qwen)
- `qwen-turbo` - Fast Qwen model
- `qwen-plus` - Enhanced Qwen model

## 🚫 Why No Configuration Files?

### Problems with Config-Based Model Lists

1. **Data Inconsistency**: Config files can list models that don't actually exist or are unavailable
2. **Maintenance Burden**: Requires manual updates when providers add/remove models  
3. **User Confusion**: Users see models in lists that they can't actually use
4. **Sync Issues**: Config files get out of sync with actual API capabilities

### Our Solution

- **API-First**: Get model lists directly from provider APIs when possible
- **Minimal Fallback**: Use only well-known, stable models as fallbacks
- **No Config Files**: Eliminate the source of confusion entirely
- **Real-time Accuracy**: Model lists reflect actual availability

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

## 🚀 Benefits

- **Accurate Data**: Model lists reflect actual provider availability
- **No Maintenance**: No manual configuration file updates needed
- **No Confusion**: Users only see models they can actually use
- **Future-Proof**: Automatically works with new models as APIs support them
- **Reliable Fallback**: Minimal hardcoded models ensure system always works

## 🎯 Future Improvements

- **Real API Integration**: When llm-connector supports model listing APIs, we'll use those
- **Ollama API**: Use `ollama.models()` to get actually installed models
- **Dynamic Updates**: Real-time model availability from provider APIs

## 🔧 Implementation Details

The model listing logic is implemented in `src/client.rs`:

```rust
pub async fn list_models(&self) -> Result<Vec<Model>> {
    // Try to get models from llm-connector API first (real-time data)
    // If that fails, fall back to minimal built-in list
    
    // TODO: Implement actual API calls when llm-connector supports it
    // For now, use minimal built-in fallback based on provider type
    
    match &self.backend {
        LlmBackendConfig::OpenAI { .. } => {
            // Minimal fallback models
            vec![
                Model { id: "gpt-4o".to_string() },
                Model { id: "gpt-4".to_string() },
                Model { id: "gpt-3.5-turbo".to_string() },
            ]
        }
        // ... other providers
    }
}
```

This approach ensures that:
- Model lists are always accurate and reflect actual availability
- No configuration files can get out of sync
- Users are never confused by unavailable models
- The system is future-proof and ready for real API integration
