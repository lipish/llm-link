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

## License

MIT License