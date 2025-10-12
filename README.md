# LLM Link

A configurable LLM proxy service that provides unified access to multiple LLM providers through different API interfaces (Ollama, OpenAI-compatible, and Anthropic).

## Features

- **Multiple Backend Support**: Connect to OpenAI, Anthropic, Ollama, or Aliyun LLM services
- **Multiple API Interfaces**: Expose Ollama, OpenAI-compatible, and Anthropic APIs simultaneously
- **Flexible Configuration**: YAML-based configuration with environment variable overrides
- **Unified Interface**: Use any application that supports these API standards with your preferred LLM provider
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
cp llm-link.yaml.example llm-link.yaml
```

Edit `llm-link.yaml` to configure your backend and API preferences:

```yaml
# Choose your LLM backend
llm_backend:
  type: "OpenAI"
  api_key: "your-openai-api-key-here"
  model: "gpt-3.5-turbo"

# Enable API interfaces
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

### Running the Service

Start with configuration file:
```bash
./target/release/llm-link -c llm-link.yaml
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

### Using with OpenAI-compatible clients

```bash
curl -X POST http://localhost:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }'
```

### Using with Ollama clients

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

### Using with Anthropic clients

```bash
curl -X POST http://localhost:8080/anthropic/v1/messages \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-sonnet-20240229",
    "max_tokens": 1024,
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }'
```

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

## License

MIT License