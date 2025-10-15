# LLM Link

A configurable LLM proxy service that provides unified access to multiple LLM providers through different API interfaces (Ollama, OpenAI-compatible, and Anthropic).

## Architecture

```
┌─────────────────┐
│   Ollama        │  ← Choose ONE backend
│   OpenAI        │
│   Anthropic     │
│   Aliyun        │
└─────────────────┘
          │
          ▼
┌─────────────────┐
│   LLM Link      │  ← Proxy Service
└─────────────────┘
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
┌─────┐ ┌─────┐ ┌─────┐
│ /v1 │ │/oll │ │/anth│  ← Multiple API formats
└─────┘ └─────┘ └─────┘
```

## Features

- **Single Backend, Multiple APIs**: Connect to ONE LLM provider (OpenAI, Anthropic, Ollama, or Aliyun) and expose it through multiple API formats simultaneously
- **API Format Compatibility**: Support for OpenAI-compatible, Ollama-compatible, and Anthropic-compatible API interfaces
- **Smart Client Adaptation**: Two-layer architecture with standard protocol support and client-specific optimizations
- **Flexible Streaming Formats**: Support for SSE, NDJSON, and JSON streaming formats with intelligent content negotiation
- **Zed.dev Integration**: Optimized compatibility with Zed editor and other modern development tools
- **Flexible Configuration**: YAML-based configuration with environment variable overrides
- **Unified Access**: Use any application that supports these API standards with your preferred LLM provider
- **Built with Rust**: Fast, memory-efficient, and production-ready

## Quick Start

### Installation

```bash
git clone <repository-url>
cd llm-link
cargo build --release
```

### Configuration

Copy the example configuration file:

```bash
cp configs/llm-link.example.yaml configs/llm-link.yaml
```

⚠️ **Security Note**: Replace all placeholder API keys (like `sk-your-zhipu-api-key-here`) with your actual API keys.

Edit `configs/llm-link.yaml` to configure your backend and API preferences:

```yaml
# Choose ONE LLM backend
llm_backend:
  type: "OpenAI"  # OR "Anthropic", "Ollama", "Aliyun"
  api_key: "your-openai-api-key-here"
  model: "gpt-3.5-turbo"

# Enable multiple API interfaces (all point to the same backend)
apis:
  ollama:
    enabled: true
    path: "/ollama"      # Ollama-compatible API
  openai:
    enabled: true
    path: "/v1"          # OpenAI-compatible API
  anthropic:
    enabled: true
    path: "/anthropic"   # Anthropic-compatible API
```

**Note**: All enabled API endpoints will proxy to the same backend provider configured above.

### Running the Service

Start with configuration file:
```bash
./target/release/llm-link -c configs/llm-link.yaml
```

Or use environment variables:
```bash
LLM_LINK_HOST=0.0.0.0
LLM_LINK_PORT=8080
LLM_LINK_LOG_LEVEL=info
./target/release/llm-link
```

## Client Adaptation Architecture

LLM Link features a two-layer architecture that provides both standard protocol support and client-specific optimizations:

### Layer 1: Standard Protocol Layer
Strict HTTP standard compliance with support for:
- **SSE (Server-Sent Events)**: `Accept: text/event-stream`
- **NDJSON (Newline-Delimited JSON)**: `Accept: application/x-ndjson`
- **JSON**: Default format

### Layer 2: Client Adaptation Layer
Optimized compatibility for specific clients:

#### Standard Adapter
- Pure HTTP standard compliance
- No client-specific modifications
- Default for all requests

#### Zed.dev Adapter
- Automatic `images` field injection for compatibility
- NDJSON format preference
- Optimized for Zed editor integration

### Configuration

Add client adapter configuration to your YAML file:

```yaml
# Client adapter configuration
client_adapters:
  # Default adapter when client cannot be detected
  default_adapter: "standard"

  # Force specific adapter (overrides detection)
  # force_adapter: "zed"

  # Zed.dev specific configuration
  zed:
    enabled: true
    force_images_field: true
    preferred_format: "ndjson"
```

### Usage

#### Method 1: Explicit Client Header
```bash
# Use standard mode
curl -H "X-LLM-Client: standard" ...

# Use Zed.dev adaptation
curl -H "X-LLM-Client: zed" ...
```

#### Method 2: Content Negotiation
```bash
# Request SSE format
curl -H "Accept: text/event-stream" ...

# Request NDJSON format
curl -H "Accept: application/x-ndjson" ...
```

#### Method 3: Configuration Override
Set `force_adapter: "zed"` in config to force Zed.dev mode for all requests.

## API Endpoints

### Ollama-compatible API

When enabled at `/ollama`:

- `POST /ollama/api/generate` - Generate completion
- `POST /ollama/api/chat` - Chat completion
- `GET /ollama/api/tags` - List available models
- `GET /ollama/api/show/:model` - Get model details

### OpenAI-compatible API

When enabled at `/v1`:

- `POST /v1/chat/completions` - Chat completion
- `GET /v1/models` - List available models

### Anthropic-compatible API

When enabled at `/anthropic`:

- `POST /anthropic/v1/messages` - Send messages
- `GET /anthropic/v1/models` - List available models

## Configuration Options

### Server Configuration

```yaml
server:
  host: "127.0.0.1"     # Bind address
  port: 8080            # Port number
  log_level: "info"     # Log level (trace, debug, info, warn, error)
```

### LLM Backend Configuration

#### OpenAI
```yaml
llm_backend:
  type: "OpenAI"
  api_key: "sk-..."
  base_url: "https://api.openai.com/v1"  # Optional
  model: "gpt-3.5-turbo"
```

#### Anthropic
```yaml
llm_backend:
  type: "Anthropic"
  api_key: "sk-ant-..."
  model: "claude-3-sonnet-20240229"
```

#### Ollama
```yaml
llm_backend:
  type: "Ollama"
  base_url: "http://localhost:11434"  # Optional
  model: "llama2"
```

#### Aliyun
```yaml
llm_backend:
  type: "Aliyun"
  api_key: "sk-..."
  model: "qwen-turbo"
```

### API Configuration

```yaml
apis:
  ollama:
    enabled: true
    path: "/ollama"
  openai:
    enabled: true
    path: "/v1"
    api_key_header: null  # Optional custom header
  anthropic:
    enabled: true
    path: "/anthropic"
    api_key_header: null  # Optional custom header
```

## Usage Examples

### Example: Ollama Backend with Multiple API Formats

Configure Ollama as the backend:

```yaml
llm_backend:
  type: "Ollama"
  base_url: "http://localhost:11434"
  model: "llama2"

apis:
  ollama:
    enabled: true
    path: "/ollama"
  openai:
    enabled: true
    path: "/v1"
  anthropic:
    enabled: true
    path: "/anthropic"
```

Now all three API formats work with the same Ollama instance:

#### Using with OpenAI-compatible clients
```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2",
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }'
```

#### Using with Ollama clients
```bash
curl -X POST http://localhost:8080/ollama/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2",
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }'
```

#### Using with Anthropic clients
```bash
curl -X POST http://localhost:8080/anthropic/v1/messages \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }'
```

**Result**: All three requests use different API formats but are processed by the same Ollama backend!

## Environment Variables

- `LLM_LINK_CONFIG` - Path to configuration file
- `LLM_LINK_HOST` - Override server host
- `LLM_LINK_PORT` - Override server port
- `LLM_LINK_LOG_LEVEL` - Override log level

## Health Check

Check service status:
```bash
curl http://localhost:8080/health
```

## Development

```bash
# Run in development mode
cargo run

# Run tests
cargo test

# Build for production
cargo build --release
```

## Testing

Test the API endpoints with the provided script:

```bash
./test_api.sh
```

This script tests:
- Model list endpoint (`GET /api/tags`)
- Non-streaming chat (`POST /api/chat` with `stream: false`)
- Streaming chat (`POST /api/chat` with `stream: true`)

Make sure llm-link is running before executing the test script.

## Zed.dev Integration

LLM Link provides optimized support for the Zed editor with automatic compatibility handling.

### Setup for Zed.dev

1. **Configure LLM Link with Zed adapter**:
```yaml
# configs/zed-config.yaml
server:
  host: "0.0.0.0"
  port: 11434

llm_backend:
  type: "YourProvider"  # OpenAI, Anthropic, Zhipu, etc.
  api_key: "${YOUR_API_KEY}"
  model: "your-model"

apis:
  ollama:
    enabled: true
    path: ""

client_adapters:
  default_adapter: "zed"  # Use Zed adapter by default
  zed:
    enabled: true
    force_images_field: true
    preferred_format: "ndjson"
```

2. **Start LLM Link**:
```bash
./target/release/llm-link --config configs/zed-config.yaml
```

3. **Configure Zed editor**:
In your Zed settings, set the Ollama endpoint to:
```json
{
  "language_models": {
    "ollama": {
      "api_url": "http://localhost:11434"
    }
  }
}
```

### Features for Zed.dev

- **Automatic Compatibility**: Ensures all responses include required fields
- **NDJSON Streaming**: Uses the preferred format for real-time responses
- **Error Handling**: Graceful fallback for unsupported operations
- **Performance Optimized**: Minimal overhead for fast responses

### Troubleshooting

If Zed.dev shows connection issues:

1. **Check LLM Link logs** for client detection:
```bash
# Look for these log messages
📡 Starting streaming response - Client: ZedDev, Format: NDJSON
```

2. **Force Zed adapter** if auto-detection fails:
```yaml
client_adapters:
  force_adapter: "zed"
```

3. **Test manually** with curl:
```bash
curl -H "X-LLM-Client: zed" \
     -H "Content-Type: application/json" \
     -d '{"model": "your-model", "messages": [{"role": "user", "content": "test"}], "stream": true}' \
     http://localhost:11434/api/chat
```

## Other IDE Integration

LLM Link's flexible architecture supports integration with various IDEs and tools that support Ollama-compatible APIs.

### VS Code with Continue

1. **Install Continue extension** from VS Code marketplace

2. **Configure Continue** in `~/.continue/config.json`:
```json
{
  "models": [
    {
      "title": "LLM Link",
      "provider": "ollama",
      "model": "your-model-name",
      "apiBase": "http://localhost:11434"
    }
  ]
}
```

3. **Start LLM Link**:
```bash
./target/release/llm-link --config configs/config-working.yaml
```

### Cursor IDE

1. **Open Cursor settings**

2. **Configure Ollama integration**:
   - Go to Settings → AI → Ollama
   - Set API URL: `http://localhost:11434`
   - Set Model: `your-model-name`

3. **Test the integration** using Cursor's AI features

### JetBrains IDEs (IntelliJ, PyCharm, etc.)

1. **Install AI Assistant plugin** or compatible Ollama plugin

2. **Configure the plugin**:
   - API Endpoint: `http://localhost:11434`
   - Model: `your-model-name`

3. **Use AI features** within your JetBrains IDE

### OpenAI Codex CLI

1. **Start LLM Link with OpenAI API enabled**:
```bash
./target/release/llm-link --config configs/config-openai-codex.yaml
```

2. **Configure OpenAI CLI**:
```bash
# Set API base URL
export OPENAI_API_BASE="http://localhost:11434/v1"
export OPENAI_API_KEY="dummy-key"  # Not required but CLI may expect it

# Use OpenAI CLI
openai api chat_completions.create \
  --model "glm-4-flash" \
  --message "user:Write a Python function to sort a list"
```

3. **Alternative: Standard port configuration**:
```bash
# Use port 8080 for OpenAI API
./target/release/llm-link --config configs/config-openai-standard-port.yaml

# Then configure CLI
export OPENAI_API_BASE="http://localhost:8080/v1"
```

### Codex CLI Integration

Codex CLI is a powerful command-line tool for AI-assisted coding. LLM Link provides full compatibility with Codex through its OpenAI-compatible API with Bearer token authentication.

#### **⚠️ Security Warning**

**NEVER commit real API keys to version control!** All configuration files use environment variables for security.

#### **Setup Steps**

1. **Set up environment variables first**:
   ```bash
   # Set your GLM API key (required for backend)
   export ZHIPU_API_KEY="your-real-zhipu-api-key"

   # Set your LLM Link API token (for Codex authentication)
   export LLM_LINK_API_KEY="your-secret-api-token"
   ```

2. **Configure LLM Link with API authentication**:

   **Option A: Standard HTTP port (recommended for Codex CLI)**
   ```bash
   # Start LLM Link on port 8080 with pure OpenAI API
   ./target/release/llm-link --config configs/config-codex-standard.yaml
   ```

   **Option B: HTTPS port (for tools expecting standard HTTPS)**
   ```bash
   # Start LLM Link on port 443 (requires sudo)
   sudo ./target/release/llm-link --config configs/config-codex-https-port.yaml
   ```

   **Option C: Dual API support (OpenAI + Ollama on port 11434)**
   ```bash
   # Start LLM Link with both APIs enabled
   ./target/release/llm-link --config configs/config-codex-env.yaml
   ```

2. **Configure Codex CLI**:

   Create or edit your Codex configuration file (usually `~/.config/codex/config.toml`):

   ```toml
   [model_providers.llm_link]
   # Name displayed in Codex UI
   name = "LLM Link - GLM Models"
   # Base URL for LLM Link's OpenAI-compatible API
   base_url = "http://localhost:8080/v1"  # Standard HTTP port
   # Environment variable containing the API token
   env_key = "LLM_LINK_API_KEY"

   # Alternative configurations:
   # For HTTPS port: base_url = "http://localhost:443/v1"
   # For dual API:   base_url = "http://localhost:11434/v1"

   [profiles.glm_4_flash]
   model = "glm-4-flash"
   model_provider = "llm_link"

   [profiles.glm_4_plus]
   model = "glm-4-plus"
   model_provider = "llm_link"

   [profiles.glm_4_long]
   model = "glm-4-long"
   model_provider = "llm_link"
   ```

3. **Set the API token environment variable**:
   ```bash
   # Set the same token that you configured in LLM Link
   export LLM_LINK_API_KEY="your-secret-api-token"
   ```

4. **Use Codex with LLM Link**:
   ```bash
   # Use the fast model for quick code generation
   codex --profile glm_4_flash "Write a Python function to calculate fibonacci numbers"

   # Use the enhanced model for complex tasks
   codex --profile glm_4_plus "Refactor this code to use async/await patterns"

   # Use the long context model for large codebases
   codex --profile glm_4_long "Analyze this entire codebase and suggest improvements"
   ```

#### **Available Models**

- **`glm-4-flash`** - Fast model, ideal for quick code completion and simple tasks
- **`glm-4-plus`** - Enhanced model with better reasoning for complex coding tasks
- **`glm-4`** - Standard model, balanced performance and quality
- **`glm-4-air`** - Lightweight model for basic tasks
- **`glm-4-long`** - Long context model for analyzing large codebases

#### **Authentication Flow**

1. **Codex** reads the API token from `LLM_LINK_API_KEY` environment variable
2. **Codex** sends requests to `http://localhost:11434/v1/chat/completions` with `Authorization: Bearer <token>` header
3. **LLM Link** validates the Bearer token against the configured `api_key`
4. **LLM Link** forwards the request to the GLM backend and returns the response

#### **Security Notes**

- ✅ **API tokens are validated** before processing requests
- ✅ **Environment variables** keep tokens out of configuration files
- ✅ **Bearer token authentication** follows OpenAI API standards
- ✅ **401 Unauthorized** responses for invalid or missing tokens

#### **Troubleshooting**

- **401 Unauthorized**: Check that `LLM_LINK_API_KEY` matches the token in LLM Link config
- **Connection refused**: Ensure LLM Link is running on the correct port (11434)
- **Model not found**: Verify the model name in your Codex profile matches available models

### Neovim with AI Plugins

For Neovim users with AI plugins like `ollama.nvim`:

```lua
-- In your Neovim config
require('ollama').setup({
  model = "your-model-name",
  url = "http://localhost:11434",
})
```

### Generic Ollama-Compatible Tools

Any tool that supports Ollama's API can work with LLM Link:

1. **Set the API endpoint** to `http://localhost:11434`
2. **Use any model name** configured in your LLM Link backend
3. **Enable streaming** for real-time responses

### Client Detection and Optimization

LLM Link automatically detects different clients and optimizes responses:

- **Automatic User-Agent detection** for known clients
- **Content negotiation** based on Accept headers
- **Streaming format optimization** (SSE, NDJSON, JSON)
- **Client-specific field injection** for compatibility

### Testing Your IDE Integration

1. **Check LLM Link logs** for client detection:
```bash
# Look for these log messages
📡 Starting streaming response - Client: [ClientType], Format: [Format]
```

2. **Test with curl** to verify functionality:
```bash
curl -H "User-Agent: YourIDE/1.0" \
     -H "Content-Type: application/json" \
     -d '{"model": "your-model", "messages": [{"role": "user", "content": "test"}]}' \
     http://localhost:11434/api/chat
```

3. **Enable debug logging** for troubleshooting:
```yaml
server:
  log_level: "debug"
```

## License

MIT License