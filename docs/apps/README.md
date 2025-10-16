# LLM Link - Application Support

LLM Link provides optimized configurations for popular AI coding tools and editors. Instead of manually configuring protocols and endpoints, you can use pre-built application profiles.

## 🚀 Quick Start

### Using the Application Launcher

```bash
# Start for Codex CLI
./scripts/start-app.sh codex-cli

# Start for Zed.dev
./scripts/start-app.sh zed-dev

# Start for Claude Code
./scripts/start-app.sh claude-code
```

### Manual Configuration

```bash
# Use application-specific config files
./target/release/llm-link --config configs/apps/codex-cli.yaml
./target/release/llm-link --config configs/apps/zed-dev.yaml
./target/release/llm-link --config configs/apps/claude-code.yaml
```

## 📱 Supported Applications

### 1. Codex CLI
- **Description**: GitHub Codex CLI tool for AI-powered coding assistance
- **Port**: 8088
- **Protocol**: OpenAI API
- **Authentication**: Bearer Token required
- **Configuration**: `configs/apps/codex-cli.yaml`

**Setup:**
```bash
# Set environment variables
export ZHIPU_API_KEY="your-zhipu-api-key"
export LLM_LINK_API_KEY="your-auth-token"

# Start LLM Link
./scripts/start-app.sh codex-cli

# Configure Codex CLI
# ~/.config/codex/config.toml
[model_providers.llm_link]
name = "LLM Link - GLM Models"
base_url = "http://localhost:8088/v1"
env_key = "LLM_LINK_API_KEY"
```

### 2. Zed.dev
- **Description**: Zed editor with AI assistant integration
- **Port**: 11434
- **Protocol**: Ollama API
- **Authentication**: Not required
- **Configuration**: `configs/apps/zed-dev.yaml`

**Setup:**
```bash
# Set environment variables
export ZHIPU_API_KEY="your-zhipu-api-key"

# Start LLM Link
./scripts/start-app.sh zed-dev

# Configure Zed.dev
# ~/.config/zed/settings.json
{
  "language_models": {
    "llm-link": {
      "api_url": "http://localhost:11434"
    }
  }
}
```

### 3. Claude Code
- **Description**: Anthropic Claude for code generation and analysis
- **Port**: 8089
- **Protocol**: Anthropic API
- **Authentication**: API Key required
- **Configuration**: `configs/apps/claude-code.yaml`

**Setup:**
```bash
# Set environment variables
export ZHIPU_API_KEY="your-zhipu-api-key"
export ANTHROPIC_API_KEY="your-anthropic-key"

# Start LLM Link
./scripts/start-app.sh claude-code
```

## 🛠️ Application Launcher Features

### Get Application Information
```bash
./scripts/start-app.sh codex-cli --info
./scripts/start-app.sh zed-dev --info
./scripts/start-app.sh claude-code --info
```

### Check Environment Variables
```bash
./scripts/start-app.sh codex-cli --check-env
./scripts/start-app.sh zed-dev --check-env
./scripts/start-app.sh claude-code --check-env
```

### Show Help
```bash
./scripts/start-app.sh --help
```

## 📋 Configuration Comparison

| Application | Port | Protocol | Auth | Env Vars | Optimizations |
|-------------|------|----------|------|----------|---------------|
| **Codex CLI** | 8088 | OpenAI | Bearer Token | `ZHIPU_API_KEY`, `LLM_LINK_API_KEY` | Code generation, SSE streaming |
| **Zed.dev** | 11434 | Ollama | None | `ZHIPU_API_KEY` | NDJSON streaming, images field |
| **Claude Code** | 8089 | Anthropic | API Key | `ZHIPU_API_KEY`, `ANTHROPIC_API_KEY` | Code analysis, longer context |

## 🎯 Benefits of Application Profiles

### ✅ Simplified Setup
- No need to understand protocol differences
- Pre-configured optimal settings
- One-command startup

### ✅ Application-Specific Optimizations
- **Codex CLI**: Optimized for code generation with SSE streaming
- **Zed.dev**: Includes required `images` field and NDJSON format
- **Claude Code**: Configured for code analysis with extended context

### ✅ Reduced Configuration Errors
- Eliminates common setup mistakes
- Provides working examples
- Includes validation and error checking

### ✅ Easy Switching
- Switch between applications without reconfiguration
- Run multiple applications simultaneously on different ports
- Isolated configurations prevent conflicts

## 🔧 Advanced Usage

### Running Multiple Applications
```bash
# Terminal 1: Start for Codex CLI
./scripts/start-app.sh codex-cli

# Terminal 2: Start for Zed.dev (different port)
./scripts/start-app.sh zed-dev

# Terminal 3: Start for Claude Code (different port)
./scripts/start-app.sh claude-code
```

### Custom Application Profiles
You can create custom application profiles by:

1. Creating a new config file in `configs/apps/`
2. Adding the application to `scripts/start-app.sh`
3. Documenting the setup in this directory

## 📚 Further Reading

- [Codex CLI Setup Guide](./codex-cli.md)
- [Zed.dev Integration Guide](./zed-dev.md)
- [Claude Code Configuration](./claude-code.md)
- [Creating Custom Profiles](./custom-profiles.md)
