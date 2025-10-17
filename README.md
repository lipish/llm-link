# LLM Link

🚀 **A user-friendly LLM proxy service with built-in support for popular AI coding tools**

LLM Link provides zero-configuration access to LLM providers through multiple API formats, with optimized built-in support for Codex CLI, Zed.dev, Claude Code, and more.

## ✨ Key Features

- **🎯 Application-Oriented**: Built-in configurations for popular AI coding tools
- **⚡ Zero Configuration**: One-command startup for common use cases
- **🔄 Multi-Protocol**: Simultaneous OpenAI, Ollama, and Anthropic API support
- **🛠️ CLI-First**: Simple command-line interface with helpful guidance
- **🔧 Smart Adaptation**: Automatic client detection and optimization
- **🚀 Production Ready**: Built with Rust for performance and reliability

## 🎯 Supported Applications

| Application | Protocol | Port | Authentication | Status |
|-------------|----------|------|----------------|---------|
| **Codex CLI** | OpenAI API | 8088 | Bearer Token | ✅ Ready |
| **Zed.dev** | Ollama API | 11434 | None | ✅ Ready |
| **Claude Code** | Anthropic API | 8089 | API Key | ✅ Ready |
| **Dual Mode** | OpenAI + Ollama | 11434 | Mixed | ✅ Ready |

## 🚀 Quick Start

### Installation

```bash
git clone https://github.com/your-repo/llm-link.git
cd llm-link
cargo build --release
```

### 🎯 Application Mode (Recommended)

**Step 1: Set up environment variables**
```bash
# Required for all applications
export ZHIPU_API_KEY="your-zhipu-api-key"

# Required for Codex CLI and Dual mode (choose one method)
export LLM_LINK_API_KEY="your-auth-token"
# OR use CLI parameter: --api-key "your-auth-token"
```

**Step 2: Start for your application**
```bash
# For Codex CLI
./target/release/llm-link --app codex-cli --api-key "your-auth-token"

# For Zed.dev
./target/release/llm-link --app zed-dev

# For Claude Code
export ANTHROPIC_API_KEY="your-anthropic-key"
./target/release/llm-link --app claude-code

# For maximum compatibility (both OpenAI and Ollama)
./target/release/llm-link --app dual --api-key "your-auth-token"
```

### 📋 Get Help and Information

```bash
# List all supported applications
./target/release/llm-link --list-apps

# Get detailed setup guide for specific application
./target/release/llm-link --app-info codex-cli
./target/release/llm-link --app-info zed-dev
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

## 🎯 Application Setup Guides

### Codex CLI Integration

1. **Start LLM Link**:
   ```bash
   export ZHIPU_API_KEY="your-zhipu-api-key"
   ./target/release/llm-link --app codex-cli --api-key "your-auth-token"
   ```

2. **Configure Codex CLI** (`~/.config/codex/config.toml`):
   ```toml
   [model_providers.llm_link]
   name = "LLM Link - GLM Models"
   base_url = "http://localhost:8088/v1"
   env_key = "LLM_LINK_API_KEY"

   [profiles.glm_4_flash]
   model = "glm-4-flash"
   model_provider = "llm_link"
   ```

3. **Use Codex CLI**:
   ```bash
   export LLM_LINK_API_KEY="your-auth-token"
   codex --profile glm_4_flash "Write a Python function"
   ```

### Zed.dev Integration

1. **Start LLM Link**:
   ```bash
   export ZHIPU_API_KEY="your-zhipu-api-key"
   ./target/release/llm-link --app zed-dev
   ```

2. **Configure Zed.dev** (`~/.config/zed/settings.json`):
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

## 🔧 Advanced Usage

### Multiple Applications Simultaneously

You can run multiple LLM Link instances for different applications:

```bash
# Terminal 1: Codex CLI (port 8088)
./target/release/llm-link --app codex-cli --api-key "token1"

# Terminal 2: Zed.dev (port 11434)
./target/release/llm-link --app zed-dev

# Terminal 3: Claude Code (port 8089)
./target/release/llm-link --app claude-code
```

### API Endpoints by Application

| Application | Base URL | Key Endpoints |
|-------------|----------|---------------|
| **Codex CLI** | `http://localhost:8088` | `/v1/chat/completions`, `/v1/models` |
| **Zed.dev** | `http://localhost:11434` | `/api/chat`, `/api/tags` |
| **Claude Code** | `http://localhost:8089` | `/anthropic/messages`, `/anthropic/models` |
| **Dual Mode** | `http://localhost:11434` | All OpenAI + Ollama endpoints |

### Environment Variables

| Variable | Required For | Description |
|----------|--------------|-------------|
| `ZHIPU_API_KEY` | All applications | Your Zhipu GLM API key |
| `LLM_LINK_API_KEY` | Codex CLI, Dual mode | Authentication token (or use `--api-key`) |
| `ANTHROPIC_API_KEY` | Claude Code | Your Anthropic API key |

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
  -a, --app <APP>              Application mode (codex-cli, zed-dev, claude-code, dual)
      --list-apps              List all supported applications
      --app-info <APP>         Show application information and setup guide
      --api-key <API_KEY>      API key for authentication (overrides env var)
  -c, --config <CONFIG>        Configuration file path
      --host <HOST>            Host to bind to
  -p, --port <PORT>            Port to bind to
      --log-level <LEVEL>      Log level [default: info]
  -h, --help                   Print help
```

### Configuration Files (Advanced)

For custom setups, configuration files are available in `configs/`:

- `codex-cli.yaml` - Codex CLI configuration
- `zed-dev.yaml` - Zed.dev configuration
- `claude-code.yaml` - Claude Code configuration
- `config-dual-protocol.yaml` - Dual protocol configuration

## 🧪 Testing Your Setup

### Quick API Tests

```bash
# Test Codex CLI setup
curl -H "Authorization: Bearer your-token" \
     http://localhost:8088/v1/models

# Test Zed.dev setup
curl http://localhost:11434/api/tags

# Test dual protocol setup
curl -H "Authorization: Bearer your-token" \
     http://localhost:11434/v1/models
curl http://localhost:11434/ollama/api/tags
```

### Health Check

```bash
# Check service status
curl http://localhost:8088/health  # Codex CLI
curl http://localhost:11434/health # Zed.dev / Dual
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

## 🚀 Development

### Building from Source

```bash
# Clone the repository
git clone https://github.com/your-repo/llm-link.git
cd llm-link

# Build for development
cargo build

# Build for production
cargo build --release

# Run tests
cargo test
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🌟 Features

### Smart Client Detection
- Automatic detection of Codex CLI, Zed.dev, and other clients
- Protocol-specific optimizations for each application
- Seamless compatibility without manual configuration

### Multiple Protocol Support
- **OpenAI API**: Compatible with ChatGPT, Codex CLI, and OpenAI SDK
- **Ollama API**: Compatible with Zed.dev, Ollama CLI, and Ollama ecosystem
- **Anthropic API**: Compatible with Claude Code and Anthropic clients

### Built-in Security
- Bearer token authentication for OpenAI API
- Environment variable support for secure key management
- CLI parameter override for flexible deployment

### Production Ready
- Built with Rust for performance and reliability
- Comprehensive error handling and logging
- Health check endpoints for monitoring

## 🔗 Other IDE Integration

LLM Link works with any tool that supports OpenAI or Ollama APIs:

### VS Code with Continue
```json
{
  "models": [
    {
      "title": "LLM Link",
      "provider": "ollama",
      "model": "glm-4-flash",
      "apiBase": "http://localhost:11434"
    }
  ]
}
```

### Cursor IDE
- Set API URL: `http://localhost:11434`
- Use any GLM model name

### JetBrains IDEs
- Install Ollama plugin
- Configure endpoint: `http://localhost:11434`

### Neovim
```lua
require('ollama').setup({
  model = "glm-4-flash",
  url = "http://localhost:11434",
})
```

## 📚 Available Models

| Model | Description | Best For |
|-------|-------------|----------|
| `glm-4-flash` | Fast model | Quick code completion |
| `glm-4-plus` | Enhanced model | Complex coding tasks |
| `glm-4` | Standard model | Balanced performance |
| `glm-4-air` | Lightweight model | Basic tasks |
| `glm-4-long` | Long context model | Large codebases |

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Support

If you find LLM Link helpful, please consider giving it a star on GitHub!

---

**Made with ❤️ for the AI coding community**