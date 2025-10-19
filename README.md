# LLM Link

🚀 **A user-friendly LLM proxy service with built-in support for popular AI coding tools**

LLM Link provides zero-configuration access to LLM providers through multiple API formats, with optimized built-in support for Codex CLI, Zed, and Claude Code.

## ✨ Key Features

- **🎯 Application-Oriented**: Built-in configurations for popular AI coding tools
- **⚡ Zero Configuration**: One-command startup for common use cases
- **🔄 Multi-Protocol**: Simultaneous OpenAI, Ollama, and Anthropic API support
- **🔀 Provider Override**: Switch between LLM providers via command-line (OpenAI, Anthropic, Zhipu, Aliyun, Ollama)
- **🛠️ CLI-First**: Simple command-line interface with helpful guidance
- **🔧 Smart Adaptation**: Automatic client detection and optimization
- **🚀 Production Ready**: Built with Rust for performance and reliability

## 🎯 Supported Applications

| Application | Protocol | Port | Authentication | Status |
|-------------|----------|------|----------------|---------|
| **Codex CLI** | OpenAI API | 8088 | Bearer Token | ✅ Ready |
| **Zed** | Ollama API | 11434 | None | ✅ Ready |
| **Claude Code** | Anthropic API | 8089 | API Key | ✅ Ready |

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/lipish/llm-link.git
cd llm-link
cargo build --release
```

### 🎯 Application Mode (Recommended)

**Step 1: Set up environment variables**
```bash
# Required for all applications (choose your provider)
export ZHIPU_API_KEY="your-zhipu-api-key"
# OR
export OPENAI_API_KEY="sk-xxx"
# OR
export ANTHROPIC_API_KEY="sk-ant-xxx"

# Required for Codex CLI (choose one method)
export LLM_LINK_API_KEY="your-auth-token"
# OR use CLI parameter: --api-key "your-auth-token"
```

**Step 2: Start for your application**
```bash
# For Codex CLI
./target/release/llm-link --app codex-cli --api-key "your-auth-token"

# For Zed
./target/release/llm-link --app zed

# For Claude Code
export ANTHROPIC_API_KEY="your-anthropic-key"
./target/release/llm-link --app claude-code
```

### 📋 Get Help and Information

```bash
# List all supported applications
./target/release/llm-link --list-apps

# Get detailed setup guide for specific application
./target/release/llm-link --app-info codex-cli
./target/release/llm-link --app-info zed
./target/release/llm-link --app-info claude-code

# Show all CLI options
./target/release/llm-link --help
```

### 🔧 Protocol Mode (Advanced)

For custom protocol combinations:

```bash
# Support multiple protocols simultaneously
./target/release/llm-link --protocols ollama,openai --api-key "your-key"
```

### 🔄 Provider Override

Switch between different LLM providers without changing configuration:

```bash
# Use OpenAI GPT-4 instead of default
export OPENAI_API_KEY="sk-xxx"
./target/release/llm-link --app codex-cli \
  --provider openai \
  --model gpt-4

# Use Anthropic Claude
export ANTHROPIC_API_KEY="sk-ant-xxx"
./target/release/llm-link --app codex-cli \
  --provider anthropic \
  --model claude-3-5-sonnet-20241022

# Use Ollama local models
./target/release/llm-link --app codex-cli \
  --provider ollama \
  --model llama2

# Use Zhipu GLM models
export ZHIPU_API_KEY="your-key"
./target/release/llm-link --app codex-cli \
  --provider zhipu \
  --model glm-4-flash

# Use Aliyun Qwen models
export ALIYUN_API_KEY="your-key"
./target/release/llm-link --app codex-cli \
  --provider aliyun \
  --model qwen-max
```

**Supported Providers:**
- `openai` - OpenAI GPT models (default: `gpt-4`)
- `anthropic` - Anthropic Claude models (default: `claude-3-5-sonnet-20241022`)
- `zhipu` - Zhipu GLM models (default: `glm-4-flash`)
- `aliyun` - Aliyun Qwen models (default: `qwen-max`)
- `ollama` - Ollama local models (default: `llama2`)

## ⚙️ Environment Variables

### Required Variables

```bash
# LLM Provider API Keys (choose based on your provider)
export ZHIPU_API_KEY="your-zhipu-api-key"           # For Zhipu GLM models
export OPENAI_API_KEY="sk-xxx"                      # For OpenAI GPT models
export ANTHROPIC_API_KEY="sk-ant-xxx"               # For Anthropic Claude models
export ALIYUN_API_KEY="your-aliyun-key"             # For Aliyun Qwen models

# LLM Link Authentication (required for Codex CLI)
export LLM_LINK_API_KEY="your-auth-token"           # Bearer token for API access
```

### Optional Variables

```bash
# Ollama Configuration
export OLLAMA_BASE_URL="http://localhost:11434"     # Ollama server URL

# Logging
export LLM_LINK_LOG_LEVEL="info"                    # Log level: debug, info, warn, error
export RUST_LOG="debug"                             # Rust logging (for development)
```

### Using .env File

Create a `.env` file in the project root:

```bash
# .env
ZHIPU_API_KEY=your-zhipu-api-key
LLM_LINK_API_KEY=your-auth-token
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx
ALIYUN_API_KEY=your-aliyun-key
```

**Note**: The `.env` file is ignored by git for security. Never commit API keys to version control.

## 🎯 Application Setup Guides

### Codex CLI Integration

1. **Start LLM Link**:
   ```bash
   # Default: Zhipu GLM-4-Flash
   export ZHIPU_API_KEY="your-zhipu-api-key"
   ./target/release/llm-link --app codex-cli --api-key "your-auth-token"

   # Or use OpenAI GPT-4
   export OPENAI_API_KEY="sk-xxx"
   ./target/release/llm-link --app codex-cli --api-key "your-auth-token" \
     --provider openai --model gpt-4

   # Or use Anthropic Claude
   export ANTHROPIC_API_KEY="sk-ant-xxx"
   ./target/release/llm-link --app codex-cli --api-key "your-auth-token" \
     --provider anthropic
   ```

2. **Configure Codex CLI** (`~/.codex/config.toml`):
   ```toml
   [model_providers.llm_link]
   name = "LLM Link"
   base_url = "http://localhost:8088/v1"
   env_key = "LLM_LINK_API_KEY"

   [profiles.default]
   model = "glm-4-flash"  # Or gpt-4, claude-3-5-sonnet-20241022, etc.
   model_provider = "llm_link"
   ```

3. **Use Codex CLI**:
   ```bash
   export LLM_LINK_API_KEY="your-auth-token"
   codex --profile default "Write a Python function"
   ```

💡 **Tip**: You can switch providers without changing Codex configuration - just restart llm-link with different `--provider` and `--model` flags!

### Zed Integration

1. **Start LLM Link**:
   ```bash
   export ZHIPU_API_KEY="your-zhipu-api-key"
   ./target/release/llm-link --app zed
   ```

2. **Configure Zed** (`~/.config/zed/settings.json`):
   ```json
   {
     "language_models": {
       "llm-link": {
         "api_url": "http://localhost:11434"
       }
     }
   }
   ```

3. **Use in Zed**: Open Zed and use the AI assistant features

### Claude Code Integration

1. **Start LLM Link**:
   ```bash
   export ANTHROPIC_API_KEY="your-anthropic-key"
   ./target/release/llm-link --app claude-code
   ```

2. **Configure Claude Code**: Follow Claude Code's configuration guide to point to `http://localhost:8089`

## 🔧 Advanced Usage

### Multiple Applications Simultaneously

You can run multiple LLM Link instances for different applications:

```bash
# Terminal 1: Codex CLI (port 8088)
./target/release/llm-link --app codex-cli --api-key "token1"

# Terminal 2: Zed (port 11434)
./target/release/llm-link --app zed

# Terminal 3: Claude Code (port 8089)
./target/release/llm-link --app claude-code
```

### API Endpoints by Application

| Application | Base URL | Key Endpoints |
|-------------|----------|---------------|
| **Codex CLI** | `http://localhost:8088` | `/v1/chat/completions`, `/v1/models` |
| **Zed** | `http://localhost:11434` | `/api/chat`, `/api/tags` |
| **Claude Code** | `http://localhost:8089` | `/anthropic/v1/messages`, `/anthropic/v1/models` |

## 🛠️ CLI Reference

### Application Commands

```bash
# List all supported applications
./target/release/llm-link --list-apps

# Get application setup guide
./target/release/llm-link --app-info <app-name>

# Start in application mode
./target/release/llm-link --app <app-name> [options]
```

### CLI Options

```bash
./target/release/llm-link [OPTIONS]

Options:
  -a, --app <APP>              Application mode (codex-cli, zed, claude-code)
      --list-apps              List all supported applications
      --app-info <APP>         Show application information and setup guide
      --protocols <PROTOCOLS>  Protocol mode (ollama,openai,anthropic)
      --api-key <API_KEY>      API key for authentication (overrides env var)
      --provider <PROVIDER>    Override LLM provider (openai, anthropic, zhipu, aliyun, ollama)
      --model <MODEL>          Override LLM model name
      --llm-api-key <KEY>      LLM provider API key (overrides provider-specific env vars)
      --host <HOST>            Host to bind to
  -p, --port <PORT>            Port to bind to
      --log-level <LEVEL>      Log level [default: info]
  -h, --help                   Print help
```

## 🧪 Testing Your Setup

### Quick API Tests

```bash
# Test Codex CLI setup
curl -H "Authorization: Bearer your-token" \
     http://localhost:8088/v1/models

# Test Zed setup
curl http://localhost:11434/api/tags

# Test Claude Code setup
curl http://localhost:8089/health
```

### Health Check

```bash
# Check service status
curl http://localhost:8088/health  # Codex CLI
curl http://localhost:11434/health # Zed
curl http://localhost:8089/health  # Claude Code
```

## 🔍 Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   ```bash
   # Check what's required for your app
   ./target/release/llm-link --app-info codex-cli
   ```

2. **Port Already in Use**
   ```bash
   # Find what's using the port
   lsof -i :8088
   # Kill the process
   kill -9 <PID>
   ```

3. **Authentication Errors**
   ```bash
   # Verify your API keys are set correctly
   echo $ZHIPU_API_KEY
   echo $LLM_LINK_API_KEY
   ```

## 🏗️ Architecture

### System Overview

```
External Clients (Codex CLI, Zed, Claude Code)
    ↓
API Layer (HTTP API endpoints)
  • HTTP Request Parsing
  • Format Conversion (OpenAI ↔ Ollama ↔ LLM)
  • Authentication & Authorization
    ↓
Adapter Layer (Client-specific adaptations)
  • Standard: No special handling
  • Zed: Add images field
  • OpenAI: finish_reason correction
    ↓
Service Layer (Business logic)
  • Model Selection & Validation
  • Default Model Fallback
    ↓
LLM Layer (LLM communication)
  • LLM Connector Wrapper
  • Stream Management
  • Error Handling
    ↓
LLM Providers (OpenAI, Anthropic, Zhipu, Aliyun, Ollama)
```

### Core Modules

#### 1. API Layer (`src/api/`)

Handles different protocol HTTP requests and responses.

**Modules:**
- `openai.rs` - OpenAI API compatible interface
- `ollama.rs` - Ollama API compatible interface
- `anthropic.rs` - Anthropic API compatible interface (placeholder)
- `convert.rs` - Format conversion utilities
- `mod.rs` - Module exports and common handlers

**Responsibilities:**
- HTTP request parsing
- Format conversion (OpenAI ↔ Ollama ↔ LLM)
- Client type detection
- Authentication and authorization
- Response formatting

#### 2. Adapter Layer (`src/adapters.rs`)

Handles client-specific response adaptations.

**Adapter Types:**
- `Standard` - Standard Ollama client
  - Preferred format: NDJSON
  - Special handling: None
- `Zed` - Zed editor
  - Preferred format: NDJSON
  - Special handling: Add `images` field
- `OpenAI` - OpenAI API client (including Codex CLI)
  - Preferred format: SSE
  - Special handling: finish_reason correction

**Responsibilities:**
- Client type detection (via HTTP headers, User-Agent, configuration)
- Determine preferred streaming format (SSE/NDJSON/JSON)
- Apply client-specific response adaptations

#### 3. Service Layer (`src/service.rs`)

Business logic layer between API and LLM layers.

**Responsibilities:**
- Business logic processing
- Model selection and validation
- Default model fallback
- Delegating to LLM layer methods

#### 4. LLM Layer (`src/llm/`)

LLM communication layer, encapsulates interaction with LLM providers.

**Modules:**
- `mod.rs` - Client struct and constructor
- `types.rs` - Type definitions (Model, Response, Usage)
- `chat.rs` - Non-streaming chat
- `stream.rs` - Streaming chat
- `models.rs` - Model management

**Responsibilities:**
- Encapsulate llm-connector library
- Unified request/response interface
- Stream response management
- Error handling

#### 5. Configuration (`src/settings.rs`)

Application configuration management.

**Configuration Structure:**
```rust
Settings {
    server: ServerSettings,
    llm_backend: LlmBackendSettings,
    apis: ApiSettings,
    client_adapters: ClientAdapterSettings
}
```

#### 6. Application Support (`src/apps/`)

Built-in application configuration generators.

**Supported Applications:**
- Codex CLI - OpenAI API mode
- Zed - Ollama API mode
- Claude Code - Anthropic API mode

**Features:**
- Zero-configuration startup
- Application-specific optimizations
- Automatic protocol selection

### Request Flow

```
1. External Client Request
   ↓
2. API Layer (openai/ollama endpoints)
   ├─ HTTP Request Parsing
   ├─ Format Conversion (API → LLM)
   └─ Client Detection
   ↓
3. Service Layer
   ├─ Business Logic
   └─ Model Selection
   ↓
4. LLM Layer
   ├─ LLM Connector Wrapper
   └─ Request Formatting
   ↓
5. LLM Provider
```

### Response Flow

```
1. LLM Provider Response
   ↓
2. LLM Layer
   ├─ Stream Processing
   └─ Error Handling
   ↓
3. Service Layer
   └─ Business Logic
   ↓
4. Adapter Layer
   └─ Client-specific Adaptations
      • Zed: Add images field
      • OpenAI: finish_reason correction
      • Standard: No special handling
   ↓
5. API Layer
   ├─ Format Conversion (LLM → API)
   └─ HTTP Response Formatting
   ↓
6. External Client
```

### Design Principles

#### 1. Client Auto-Detection

**Detection Priority:**
1. Force adapter setting (`force_adapter`)
2. Explicit client identifier (`x-client` header)
3. User-Agent auto-detection
4. Default adapter setting

**Supported Client Types:**
- `Standard` - Standard Ollama client
- `Zed` - Zed editor
- `OpenAI` - OpenAI API client (including Codex CLI)

**Detection Example:**
```rust
// 1. Configuration force
force_adapter: "zed"

// 2. Header specification
x-client: zed

// 3. User-Agent detection
User-Agent: Zed/1.0.0  → Zed
User-Agent: OpenAI/1.0 → OpenAI
```

#### 2. Application-First Design

Built-in configurations for popular applications, zero manual configuration needed.

**Benefits:**
- One-command startup
- Automatic protocol selection
- Optimized for each application
- Helpful error messages

#### 3. Asynchronous Processing

Uses Tokio async runtime for high concurrency support.

### Performance Considerations

- **Streaming Response**: Real-time data transmission
- **Zero-Copy**: Minimize data copying
- **Async Processing**: High concurrency support

## 🚀 Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/lipish/llm-link.git
cd llm-link

# Build for development
cargo build

# Build for production
cargo build --release

# Run tests
cargo test
```

### Project Structure

```
llm-link/
├── src/
│   ├── main.rs              # Application entry point
│   ├── settings.rs          # Configuration definitions
│   ├── service.rs           # Business logic layer
│   ├── adapters.rs          # Client adapters
│   ├── api/                 # HTTP API layer
│   │   ├── mod.rs          # AppState, common endpoints
│   │   ├── convert.rs      # Format conversion utilities
│   │   ├── ollama.rs       # Ollama API endpoints
│   │   ├── openai.rs       # OpenAI API endpoints
│   │   └── anthropic.rs    # Anthropic API endpoints
│   ├── llm/                 # LLM communication layer
│   │   ├── mod.rs          # Client struct
│   │   ├── types.rs        # Type definitions
│   │   ├── chat.rs         # Non-streaming chat
│   │   ├── stream.rs       # Streaming chat
│   │   └── models.rs       # Model management
│   ├── apps/                # Application config generators
│   └── models/              # Model configurations
├── docs/                    # Documentation
├── tests/                   # Test scripts
├── Cargo.toml              # Rust dependencies
├── README.md               # This file
└── CHANGELOG.md            # Version history
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📚 Documentation

- [Refactoring History](docs/REFACTORING.md) - Recent refactoring and improvements
- [Provider Override](docs/PROVIDER_OVERRIDE.md) - Switch between LLM providers
- [Changelog](CHANGELOG.md) - Version history and updates

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Support

If you find LLM Link helpful, please consider giving it a star on GitHub!

---

**Made with ❤️ for the AI coding community**

