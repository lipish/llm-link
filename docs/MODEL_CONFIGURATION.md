# Model Configuration Guide

LLM Link now supports configurable model lists through a YAML configuration file, eliminating the need to modify code when adding or removing models.

## 📁 Configuration File

The model configuration is stored in `configs/models.yaml`. This file contains comprehensive lists of popular models for all supported providers.

### File Structure

```yaml
openai:
  models:
    - id: "gpt-4"
      name: "GPT-4"
      description: "Most capable GPT-4 model"
    # ... more models

anthropic:
  models:
    - id: "claude-3-5-sonnet-20241022"
      name: "Claude 3.5 Sonnet"
      description: "Latest Claude 3.5 Sonnet model"
    # ... more models

# Similar structure for zhipu, ollama, aliyun
```

## 🔧 How It Works

1. **Automatic Loading**: The system automatically loads `configs/models.yaml` when starting
2. **Fallback Support**: If the file is missing, it falls back to built-in models from `src/models.yaml`
3. **Provider Mapping**: Models are automatically mapped to the correct provider based on your backend configuration
4. **API Integration**: The model list is exposed through the standard API endpoints

## 📁 File Structure

- **`configs/models.yaml`** - User-editable comprehensive model configuration
- **`src/models.yaml`** - Built-in minimal model configuration (embedded in binary)

## 📋 Supported Providers

### OpenAI
- GPT-4 series (GPT-4, GPT-4 Turbo, GPT-4o, GPT-4o Mini)
- GPT-3.5 series (GPT-3.5 Turbo, GPT-3.5 Turbo 16K)

### Anthropic
- Claude 3.5 series (Sonnet, Haiku)
- Claude 3 series (Opus, Sonnet, Haiku)

### Zhipu (GLM)
- GLM-4 series (Flash, Plus, Standard, Air, Long)
- Version-specific models (GLM-4-0520)

### Ollama
- Llama series (3.2, 3.1, 3, 2)
- Specialized models (Code Llama, DeepSeek Coder)
- Other popular models (Mistral, Mixtral, Qwen, Phi-3)

### Aliyun (Qwen)
- Qwen series (Turbo, Plus, Max, Max Long Context)
- Qwen 2.5 series (72B, 32B, 14B)

## ✏️ Customizing Models

### Adding New Models

1. Edit `configs/models.yaml`
2. Add your model to the appropriate provider section:

```yaml
openai:
  models:
    # ... existing models
    - id: "your-new-model"
      name: "Your New Model"
      description: "Description of your model"
```

3. Restart the service - no code changes needed!

### Removing Models

Simply delete or comment out the model entry in the YAML file.

### Modifying Descriptions

Update the `name` and `description` fields to provide better user experience.

## 🧪 Testing Configuration

Use the built-in test tool to verify your configuration:

```bash
cargo run --bin test_models
```

This will display all configured models for each provider.

## 🔄 API Endpoints

The configured models are available through standard API endpoints:

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

- **No Code Changes**: Add/remove models without touching source code
- **Easy Maintenance**: Update model lists through simple YAML editing
- **Comprehensive Coverage**: Includes popular models for all providers
- **Graceful Fallback**: Works even if configuration file is missing
- **Rich Metadata**: Includes descriptions for better user experience

## 🔧 Troubleshooting

### Configuration Not Loading
- Ensure `configs/models.yaml` exists in the project root
- Check YAML syntax with a validator
- Review logs for parsing errors

### Models Not Appearing
- Verify the provider name matches your backend configuration
- Check that the model ID is correctly formatted
- Ensure the YAML structure follows the expected format

### Fallback Behavior
If the configuration file is missing or invalid, the system will use built-in models from `src/models.yaml`:
- OpenAI: gpt-4, gpt-3.5-turbo
- Anthropic: claude-3-5-sonnet
- Zhipu: glm-4-flash, glm-4
- Ollama: llama3.2, llama2
- Aliyun: qwen-turbo

The built-in configuration is minimal but ensures the system always works.
