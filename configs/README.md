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
- **`config-working.yaml`** - Working development configuration with client adapters
- **`config-multi-provider.yaml`** - Multi-provider setup with examples for all supported LLM providers
- **`config-env-vars.yaml`** - Configuration using environment variables
- **`config-codex.yaml`** - Pure OpenAI API on port 8088 for Codex CLI

## Usage

### Using Default Configuration
```bash
# Automatically finds ./configs/llm-link.yaml
./llm-link
```

### Using Specific Configuration
```bash
# Use a specific config file
./llm-link -c configs/config-working.yaml
```

### Using Environment Variable
```bash
# Set config path via environment variable
export LLM_LINK_CONFIG=configs/config-working.yaml
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
- **Client Adapters**: Smart client-specific optimizations (Zed.dev, etc.)

## Configuration Examples

### For Development
- Use `config-working.yaml` for development with client adapters enabled

### For IDE Integration
- `config-working.yaml` includes client adapter support for Zed.dev and other IDEs
- Automatic client detection via User-Agent headers
- Optimized streaming formats for different clients

### For Codex CLI Integration
- `config-codex.yaml` provides pure OpenAI API on port 8088
- Bearer token authentication with environment variables
- No Ollama protocol interference for maximum compatibility

### For Production
- Copy `config-working.yaml` and modify for your production environment
- Enable client adapters for better IDE compatibility
- Use `config-codex.yaml` as a template for pure OpenAI API deployment

## Client Adapter System

LLM Link features a two-layer architecture for enhanced IDE compatibility:

### Layer 1: Standard Protocol Layer
- **SSE (Server-Sent Events)**: `Accept: text/event-stream`
- **NDJSON (Newline-Delimited JSON)**: `Accept: application/x-ndjson`
- **JSON**: Default format

### Layer 2: Client Adaptation Layer
- **Standard Adapter**: Pure HTTP standard compliance
- **Zed.dev Adapter**: Optimized for Zed editor with automatic `images` field injection

### Configuration Example
```yaml
# Client adapter configuration
client_adapters:
  # Default adapter when client cannot be detected
  default_adapter: "standard"

  # Zed.dev specific configuration
  zed:
    enabled: true
    force_images_field: true
    preferred_format: "ndjson"
```

### Usage Methods
1. **Explicit Client Header**: `X-LLM-Client: zed`
2. **User-Agent Detection**: Automatic detection of `Zed/` User-Agent
3. **Configuration Override**: Force specific adapter for all requests

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
