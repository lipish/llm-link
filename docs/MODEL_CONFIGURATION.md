# Model Configuration Guide

LLM Link supports configurable model lists through YAML configuration files, eliminating the need to modify code when adding or removing models.

## 📁 Configuration Files

The system uses a two-tier configuration approach:

1. **Built-in models** (`src/models.yaml`) - Minimal essential models embedded in the binary
2. **User configuration** (`configs/models.yaml`) - Optional comprehensive model lists (create if needed)

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

1. **Automatic Loading**: The system tries to load `configs/models.yaml` when starting
2. **Graceful Fallback**: If the file is missing, it uses built-in models from `src/models.yaml`
3. **Provider Mapping**: Models are automatically mapped to the correct provider based on your backend configuration
4. **API Integration**: The model list is exposed through the standard API endpoints

## 📁 File Structure

- **`src/models.yaml`** - Built-in minimal model configuration (embedded in binary)
- **`configs/models.yaml`** - Optional user-editable comprehensive model configuration

## 📋 Built-in Models (src/models.yaml)

The system includes the latest and most popular models for each provider (updated 2025-01-17):

### OpenAI
- **GPT-5 series**: gpt-5, gpt-5-mini (latest)
- **GPT-4 series**: gpt-4o, gpt-4o-mini, gpt-4-turbo
- **GPT-3.5 series**: gpt-3.5-turbo

### Anthropic
- **Claude 4.5 series**: claude-sonnet-4-5, claude-haiku-4-5 (latest)
- **Claude 4 series**: claude-opus-4-1, claude-sonnet-4
- **Claude 3.7 series**: claude-3-7-sonnet

### Zhipu (GLM)
- **GLM-4 series**: glm-4.6 (latest), glm-4-flash, glm-4-plus, glm-4, glm-4-air, glm-4-long

### Ollama
- **Trending 2025**: gpt-oss, qwen3-vl, deepseek-r1, qwen3-coder, gemma3, qwen3
- **Meta Llama**: llama3.1, llama3.2, codellama
- **Others**: mistral, codellama

### Aliyun (Qwen)
- **Qwen series**: qwen-turbo, qwen-plus, qwen-max, qwen-max-longcontext
- **Qwen 2.5 series**: qwen2.5-72b-instruct, qwen2.5-32b-instruct

## 🔗 Data Sources

Model information is gathered from official sources:
- **Anthropic**: [Claude Models Overview](https://docs.claude.com/en/docs/about-claude/models/overview)
- **Ollama**: [Ollama Model Search](https://ollama.com/search)
- **Aliyun**: [Model Studio Models](https://help.aliyun.com/zh/model-studio/models)
- **Zhipu**: [BigModel Platform](https://bigmodel.cn/)
- **OpenAI**: Official documentation and community reports

## ✏️ Customizing Models

### Creating Custom Configuration

1. Create `configs/models.yaml` (copy from `src/models.yaml` as a starting point)
2. Add your models to the appropriate provider section:

```yaml
openai:
  models:
    # Built-in models
    - id: "gpt-4"
      name: "GPT-4"
      description: "Most capable GPT-4 model"
    # Your custom models
    - id: "gpt-4-turbo"
      name: "GPT-4 Turbo"
      description: "Latest GPT-4 Turbo model"
    - id: "your-custom-model"
      name: "Your Custom Model"
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
- **OpenAI**: gpt-5, gpt-5-mini, gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo
- **Anthropic**: claude-sonnet-4-5, claude-haiku-4-5, claude-opus-4-1, claude-sonnet-4, claude-3-7-sonnet
- **Zhipu**: glm-4.6, glm-4-flash, glm-4-plus, glm-4, glm-4-air, glm-4-long
- **Ollama**: gpt-oss, qwen3-vl, deepseek-r1, qwen3-coder, gemma3, qwen3, llama3.1, llama3.2, mistral, codellama
- **Aliyun**: qwen-turbo, qwen-plus, qwen-max, qwen-max-longcontext, qwen2.5-72b-instruct, qwen2.5-32b-instruct

The built-in configuration includes the latest and most popular models, ensuring excellent out-of-the-box experience.
