# LLM Link

[![Crates.io](https://img.shields.io/crates/v/llm-link.svg)](https://crates.io/crates/llm-link)
[![Documentation](https://docs.rs/llm-link/badge.svg)](https://docs.rs/llm-link)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/crates/d/llm-link.svg)](https://crates.io/crates/llm-link)

🚀 **A user-friendly LLM proxy service with built-in support for popular AI coding tools**

LLM Link provides zero-configuration access to LLM providers through multiple API formats, with optimized built-in support for popular AI applications.

## ✨ Key Features

- **🎯 Application-Oriented**: Built-in configurations for popular AI coding tools
- **⚡ Zero Configuration**: One-command startup for common use cases
- **🔄 Multi-Protocol**: Simultaneous OpenAI, Ollama, and Anthropic API support
- **🔀 9 LLM Providers**: OpenAI, Anthropic, Zhipu, Aliyun, Volcengine, Tencent, Longcat, Moonshot, Ollama
- **📡 Dynamic Model Discovery**: REST API to query all supported providers and models
- ** Hot-Reload Configuration**: Update API keys and switch providers without restart
- ** Production Ready**: Built with Rust for performance and reliability

## 🎯 Supported Applications

| Application | Protocol | Port | Authentication | Status |
|-------------|----------|------|----------------|---------|
| **Codex CLI** | OpenAI API | 8088 | Bearer Token | ✅ Ready |
| **Zed** | Ollama API | 11434 | None | ✅ Ready |
| **Aider** | OpenAI API | 8090 | Bearer Token | ✅ Ready |
| **OpenHands** | OpenAI API | 8091 | Bearer Token | ✅ Ready |

� **[Full Application Documentation →](https://lipish.github.io/llm-link/docs/apps)**

## � Quick Start

### Installation

```bash
# Install from crates.io (Recommended)
cargo install llm-link

# Or via Homebrew (macOS)
brew tap lipish/llm-link && brew install llm-link

# Or via pip (macOS / Linux)
pip install pyllmlink
```

� **[Complete Installation Guide →](https://lipish.github.io/llm-link/docs/quick-start)**

### Basic Usage

```bash
# For Codex CLI
./llm-link --app codex-cli --api-key "your-auth-token"

# For Zed
./llm-link --app zed

# For Aider (using open-source models)
./llm-link --app aider --provider zhipu --model glm-4.6 --api-key "your-zhipu-key"

# For OpenHands
./llm-link --app openhands --provider anthropic --model claude-3-5-sonnet --api-key "your-anthropic-key"
```

📚 **[Detailed Configuration Guide →](https://lipish.github.io/llm-link/docs)**

## 📋 Help & Information

```bash
# List all supported applications
./llm-link --list-apps

# Get detailed setup guide for specific application
./llm-link --app-info aider

# List available models for a provider
./llm-link --provider zhipu --list-models
```

## 🌐 Protocol Mode

Use multiple protocols simultaneously for maximum flexibility:

```bash
./llm-link --protocols openai,ollama,anthropic --provider zhipu --model glm-4.6
```

� **[Protocol Mode Documentation →](https://lipish.github.io/llm-link/docs/protocols)**

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Tools      │    │   LLM Link      │    │   LLM Providers │
│                 │    │                 │    │                 │
│ • Codex CLI     │───▶│ • Protocol      │───▶│ • OpenAI        │
│ • Zed IDE       │    │   Conversion    │    │ • Anthropic     │
│ • Aider         │    │ • Format        │    │ • Zhipu         │
│ • OpenHands     │    │   Adaptation    │    │ • Aliyun        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

📚 **[Architecture Documentation →](https://lipish.github.io/llm-link/docs/architecture)**

## 🔧 Advanced Usage

### Custom Configuration

```bash
# Custom port and host
./llm-link --app aider --provider zhipu --model glm-4.6 --port 8095 --host 0.0.0.0

# With authentication
./llm-link --app aider --provider zhipu --model glm-4.6 --auth-key "your-secret-token"
```

### Environment Variables

```bash
# Provider API keys
export ZHIPU_API_KEY="your-zhipu-api-key"
export OPENAI_API_KEY="sk-xxx"
export ANTHROPIC_API_KEY="sk-ant-xxx"

# LLM Link authentication
export LLM_LINK_API_KEY="your-auth-token"
```

📚 **[Advanced Configuration →](https://lipish.github.io/llm-link/docs)**

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:8090/health

# Test OpenAI API
curl -X POST http://localhost:8090/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{"model": "glm-4.6", "messages": [{"role": "user", "content": "Hello!"}]}'
```

📚 **[Testing & Troubleshooting →](https://lipish.github.io/llm-link/docs)**

## 📚 Full Documentation

🌐 **[Complete Documentation Site →](https://lipish.github.io/llm-link/)**

- **[Getting Started](https://lipish.github.io/llm-link/docs/quick-start)** - Installation and basic setup
- **[Application Guides](https://lipish.github.io/llm-link/docs/apps)** - Detailed integration for each tool
- **[Configuration](https://lipish.github.io/llm-link/docs)** - Advanced configuration options
- **[Architecture](https://lipish.github.io/llm-link/docs/architecture)** - System design and internals
- **[API Reference](https://lipish.github.io/llm-link/api)** - REST API documentation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Documentation Site](https://lipish.github.io/llm-link/)
- [Crates.io](https://crates.io/crates/llm-link)
- [GitHub Repository](https://github.com/lipish/llm-link)
- [API Reference](https://lipish.github.io/llm-link/api)
