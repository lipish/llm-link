# LLM Link

🚀 **A user-friendly LLM proxy service with built-in support for popular AI coding tools**

LLM Link provides zero-configuration access to LLM providers through multiple API formats, with optimized built-in support for Codex CLI, Zed.dev, Claude Code, and more.

## ✨ Key Features

- **🎯 Application-Oriented**: Built-in configurations for popular AI coding tools
- **⚡ Zero Configuration**: One-command startup for common use cases
- **🔄 Multi-Protocol**: Simultaneous OpenAI, Ollama, and Anthropic API support
- **🔀 Provider Override**: Switch between LLM providers via command-line (OpenAI, Anthropic, Zhipu, Ollama)
- **🛠️ CLI-First**: Simple command-line interface with helpful guidance
- **🔧 Smart Adaptation**: Automatic client detection and optimization
- **🔀 XML to JSON Conversion**: Intelligent conversion of Zhipu XML function calls for standard clients
- **🎯 Smart Tool Calls**: Automatic `finish_reason` correction for streaming tool_calls (perfect for Codex)
- **🚀 Production Ready**: Built with Rust for performance and reliability

## 🎯 Supported Applications

| Application | Protocol | Port | Authentication | Status | Special Features |
|-------------|----------|------|----------------|---------|------------------|
| **Codex CLI** | OpenAI API | 8088 | Bearer Token | ✅ Ready | 🎯 Auto finish_reason fix |
| **Zed.dev** | Ollama API | 11434 | None | ✅ Ready | - |
| **Claude Code** | Anthropic API | 8089 | API Key | ✅ Ready | - |
| **Dual Mode** | OpenAI + Ollama | 11434 | Mixed | ✅ Ready | - |

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

### 🔄 Provider Override (New!)

Switch between different LLM providers without changing configuration:

```bash
# Use OpenAI GPT-4 instead of default Zhipu
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

# Just change the model (keep default provider)
./target/release/llm-link --app codex-cli \
  --model glm-4
```

**Supported Providers:**
- `openai` - OpenAI GPT models (default: `gpt-4`)
- `anthropic` - Anthropic Claude models (default: `claude-3-5-sonnet-20241022`)
- `zhipu` - Zhipu GLM models (default: `glm-4-flash`)
- `ollama` - Ollama local models (default: `llama2`)

📚 **See [Provider Override Documentation](docs/PROVIDER_OVERRIDE.md) for more details**

## ⚙️ Environment Variables

LLM Link uses environment variables for API keys and configuration. You can set them in your shell or create a `.env` file in the project root.

### Required Variables

```bash
# LLM Provider API Keys (choose based on your provider)
export ZHIPU_API_KEY="your-zhipu-api-key"           # For Zhipu GLM models
export OPENAI_API_KEY="sk-xxx"                      # For OpenAI GPT models
export ANTHROPIC_API_KEY="sk-ant-xxx"               # For Anthropic Claude models

# LLM Link Authentication (required for Codex CLI and some apps)
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

2. **Configure Codex CLI** (`~/.config/codex/config.toml`):
   ```toml
   [model_providers.llm_link]
   name = "LLM Link"
   base_url = "http://localhost:8088/v1"
   env_key = "LLM_LINK_API_KEY"

   [profiles.default]
   model = "glm-4-flash"  # Or gpt-4, claude-3-5-sonnet-20241022, etc.
   model_provider = "llm_link"
   ```

3. **Enjoy Perfect Tool Calling** 🎯:
   - LLM Link automatically fixes `finish_reason` for streaming tool_calls
   - Codex will correctly execute tools instead of just displaying text
   - You'll see both the LLM's thinking process AND tool execution

4. **Use Codex CLI**:
   ```bash
   export LLM_LINK_API_KEY="your-auth-token"
   codex --profile default "Write a Python function"
   ```

💡 **Tip**: You can switch providers without changing Codex configuration - just restart llm-link with different `--provider` and `--model` flags!

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

## 🎯 Smart Tool Calls for Codex

### The Problem

When using streaming mode with tool calls, some LLMs (like GLM-4.6) return:
1. First: Explanatory text ("I'll help you check the project...")
2. Then: Tool calls (function to execute)
3. Finally: `finish_reason: "stop"` ❌ (should be `"tool_calls"`)

This causes Codex to display the text but **not execute the tool**, because Codex checks `finish_reason` to decide whether to execute tools.

### The Solution

LLM Link automatically detects and fixes this issue:

```rust
// Automatic fix in llm-link
if (response contains tool_calls) {
    finish_reason = "tool_calls"  // ✅ Corrected
} else {
    finish_reason = "stop"
}
```

### The Result

✅ **Perfect Experience**:
- Users see the LLM's thinking process: "I'll help you check the project..."
- Tools are correctly executed: `shell` command runs
- Real-time streaming preserved
- No configuration needed

**Before Fix**:
```
› check the project
• I'll explore the project structure...
(nothing happens - tool not executed)
```

**After Fix**:
```
› check the project
• I'll explore the project structure...
(tool executes, files are listed)
```

### Technical Details

- **Detection**: Monitors `delta.tool_calls` in streaming chunks
- **Correction**: Sets `finish_reason: "tool_calls"` in final chunk
- **Compatibility**: Works with all clients that check `finish_reason`
- **Documentation**: See [docs/streaming-tool-calls-fix.md](docs/streaming-tool-calls-fix.md)

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
      --provider <PROVIDER>    Override LLM provider (openai, anthropic, zhipu, ollama)
      --model <MODEL>          Override LLM model name
      --llm-api-key <KEY>      LLM provider API key (overrides provider-specific env vars)
  -c, --config <CONFIG>        Configuration file path
      --host <HOST>            Host to bind to
  -p, --port <PORT>            Port to bind to
      --log-level <LEVEL>      Log level [default: info]
  -h, --help                   Print help
```

**New in v0.1.1:** Provider and model override support! See [Provider Override Documentation](docs/PROVIDER_OVERRIDE.md) for details.

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

### Intelligent Response Adaptation
- **XML to JSON Conversion**: Automatically converts Zhipu XML function calls to JSON for standard clients
- **Client-Specific Handling**: Different behavior for Codex, Zed.dev, OpenAI, and Zhipu native clients
- **Zero-Overhead**: Only converts when necessary, preserves original format for native clients
- See [Zhipu XML Conversion Guide](docs/ZHIPU_XML_CONVERSION.md) for details

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

## 📁 Project Structure

```
llm-link/
├── src/                    # Source code
├── docs/                   # Documentation
│   ├── issues/            # Issue tracking and investigation
│   ├── ARCHITECTURE.md
│   ├── PROVIDER_OVERRIDE.md
│   └── ...
├── tests/                  # Test scripts
├── logs/                   # Log files (gitignored)
├── Cargo.toml             # Rust dependencies
├── README.md              # This file
└── CHANGELOG.md           # Version history
```

## 📖 Documentation

### Core Documentation
- [Architecture Overview](docs/ARCHITECTURE.md) - System architecture and design decisions
- [Application Support Guide](docs/APPLICATION_SUPPORT.md) - Detailed application integration guide
- [Model Configuration](docs/MODEL_CONFIGURATION.md) - Model setup and configuration

### Features
- [Provider Override](docs/PROVIDER_OVERRIDE.md) - Switch between LLM providers via command-line ⭐ New!
- [Zhipu XML Conversion](docs/ZHIPU_XML_CONVERSION.md) - XML to JSON conversion feature

### Quick References
- [Quick Start Guide](docs/QUICK_START.md) - Fast reference for common use cases
- [Provider Override Feature](docs/PROVIDER_OVERRIDE_FEATURE.md) - Feature implementation details
- [Changelog](CHANGELOG.md) - Version history and updates

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Support

If you find LLM Link helpful, please consider giving it a star on GitHub!

---

**Made with ❤️ for the AI coding community**