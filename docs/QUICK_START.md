# LLM Link - Quick Start Guide

## 🚀 Installation

```bash
git clone https://github.com/your-repo/llm-link.git
cd llm-link
cargo build --release
```

## 🎯 Usage Modes

### Application Mode (Recommended)

For specific tools with optimized configurations:

```bash
# Codex CLI
export ZHIPU_API_KEY="your-zhipu-key"
./target/release/llm-link --app codex-cli --api-key "your-auth-token"

# Zed.dev
export ZHIPU_API_KEY="your-zhipu-key"
./target/release/llm-link --app zed-dev

# Claude Code
export ZHIPU_API_KEY="your-zhipu-key"
export ANTHROPIC_API_KEY="your-anthropic-key"
./target/release/llm-link --app claude-code
```

### Protocol Mode (Flexible)

For custom protocol combinations:

```bash
# Two protocols
./target/release/llm-link --protocols openai,ollama --api-key "your-token"

# All three protocols
./target/release/llm-link --protocols openai,ollama,anthropic --api-key "your-token"
```

## 📋 Get Help

```bash
# List all applications
./target/release/llm-link --list-apps

# Get setup guide for specific app
./target/release/llm-link --app-info codex-cli

# Show all options
./target/release/llm-link --help
```

## 🧪 Testing

```bash
# Test the API
./test_api.sh

# Manual tests
curl http://localhost:11434/ollama/api/tags
curl -H "Authorization: Bearer your-token" http://localhost:8088/v1/models
```

## 🔧 Configuration Files (Advanced)

For custom setups, use configuration files:

```bash
./target/release/llm-link --config configs/codex-cli.yaml
./target/release/llm-link --config configs/zed-dev.yaml
./target/release/llm-link --config configs/claude-code.yaml
```

## 📚 Available Models

- `glm-4-flash` - Fast model for quick tasks
- `glm-4-plus` - Enhanced model for complex tasks
- `glm-4` - Standard model
- `glm-4-air` - Lightweight model
- `glm-4-long` - Long context model
