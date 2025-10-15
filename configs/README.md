# Configuration Files

This directory contains all configuration files for llm-link.

## Configuration File Discovery

llm-link automatically searches for configuration files in the following order:

1. **Environment Variable**: `LLM_LINK_CONFIG` (if set)
2. **Default Locations** (in order):
   - `./configs/llm-link.yaml`
   - `./configs/config.yaml`
   - `./configs/llm-link.yml`
   - `./configs/config.yml`
3. **Backward Compatibility** (fallback):
   - `./llm-link.yaml`
   - `./config.yaml`
   - `./llm-link.yml`
   - `./config.yml`
4. **Environment Variables/Defaults** (if no file found)

## Configuration Files

### Main Configuration
- **`llm-link.yaml`** - Main configuration file (auto-discovered)
- **`llm-link.example.yaml`** - Template configuration file

### Example Configurations
- **`config-debug.yaml`** - Debug configuration with detailed logging
- **`config-glm-ollama.yaml`** - Zhipu GLM with Ollama API compatibility (with authentication)
- **`config-glm-ollama-noauth.yaml`** - Zhipu GLM with Ollama API compatibility (no authentication)
- **`config-zed-final.yaml`** - Final Zed.dev configuration

## Usage

### Using Default Configuration
```bash
# Automatically finds ./configs/llm-link.yaml
./llm-link
```

### Using Specific Configuration
```bash
# Use a specific config file
./llm-link -c configs/config-debug.yaml
```

### Using Environment Variable
```bash
# Set config path via environment variable
export LLM_LINK_CONFIG=configs/config-debug.yaml
./llm-link
```

## Creating Your Configuration

1. Copy the example configuration:
   ```bash
   cp configs/llm-link.example.yaml configs/llm-link.yaml
   ```

2. Edit the configuration to match your setup:
   ```bash
   nano configs/llm-link.yaml
   ```

3. Run llm-link (it will automatically find your config):
   ```bash
   ./llm-link
   ```

## Configuration Structure

See `llm-link.example.yaml` for a complete example with all available options including:

- **Server Settings**: Host, port, logging
- **API Configuration**: Ollama API settings
- **Backend Configuration**: LLM provider settings (OpenAI, Anthropic, Zhipu, Aliyun, Ollama)
- **Authentication**: API key settings
- **Model Configuration**: Available models and routing

## Configuration Examples

### For Development
- Use `config-debug.yaml` for development and troubleshooting with detailed logging

### For Zed.dev Integration
- Use `config-zed-final.yaml` for Zed.dev integration

### For Production
- Use `config-glm-ollama.yaml` for production with authentication
- Use `config-glm-ollama-noauth.yaml` for simple setups without authentication

## Security Tips

⚠️ **IMPORTANT: API Key Security**

- **Never commit real API keys to version control**
- All example configs use placeholder API keys like `sk-your-zhipu-api-key-here`
- Replace placeholders with your actual API keys before use

### Recommended Security Practices

1. **Use Environment Variables**
   ```bash
   # Copy the example file
   cp .env.example .env

   # Edit .env with your real API keys
   nano .env

   # Reference in config files
   api_key: "${ZHIPU_API_KEY}"
   ```

2. **Use Local Config Files**
   ```bash
   # Create personal config (ignored by git)
   cp configs/llm-link.example.yaml configs/config-personal.yaml
   # Edit with real API keys
   ```

3. **Production Deployment**
   - Use environment variables or secure secret management
   - Never store API keys in config files in production
   - Consider using authentication for your llm-link service
