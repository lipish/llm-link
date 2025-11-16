# LLM Link

[![Crates.io](https://img.shields.io/crates/v/llm-link.svg)](https://crates.io/crates/llm-link)
[![Documentation](https://docs.rs/llm-link/badge.svg)](https://docs.rs/llm-link)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/crates/d/llm-link.svg)](https://crates.io/crates/llm-link)

🚀 **A user-friendly LLM proxy service with built-in support for popular AI coding tools**

LLM Link provides zero-configuration access to LLM providers through multiple API formats, with optimized built-in support for Codex CLI, Zed, and Claude Code.

## ✨ Key Features

- **🎯 Application-Oriented**: Built-in configurations for popular AI coding tools
- **⚡ Zero Configuration**: One-command startup for common use cases
- **🔄 Multi-Protocol**: Simultaneous OpenAI, Ollama, and Anthropic API support
- **🔀 9 LLM Providers**: OpenAI, Anthropic, Zhipu, Aliyun, Volcengine, Tencent, Longcat, Moonshot, Ollama
- **📡 Dynamic Model Discovery**: REST API to query all supported providers and models
- **📦 Rust Library**: Use as a crate for direct access to provider and model information
- **🔥 Hot-Reload Configuration**: Update API keys and switch providers without restart
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

#### Option 0: Install via Homebrew (macOS)

```bash
# Run the tap command once per machine so Homebrew knows where the formula lives
brew tap lipish/llm-link
brew install llm-link
```

> 📝 如果要取消可执行 `brew untap lipish/llm-link`，之后重新 tap 再安装即可。

#### Option 1: Install from crates.io (Recommended)

```bash
cargo install llm-link
```

#### Option 1.5: Install via pip (macOS / Linux)

```bash
pip install pyllmlink
# First run downloads the matching prebuilt binary into ~/.cache/llm-link
```

> 🐍 安装包名为 `pyllmlink`，安装后仍提供 `llm-link` CLI。`LLM_LINK_CACHE` 可重定向缓存目录，`LLM_LINK_DOWNLOAD_BASE` 可指向自建 release 镜像。

#### Option 2: Build from source

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
- `volcengine` - Volcengine Doubao models (default: `doubao-pro-32k`)
- `tencent` - Tencent Hunyuan models (default: `hunyuan-lite`)
- `longcat` - LongCat models (default: `LongCat-Flash-Chat`)
- `moonshot` - Moonshot Kimi models (default: `kimi-k2-turbo-preview`)
- `ollama` - Ollama local models (default: `llama2`)

### Volcengine Doubao: Logical Models vs Endpoint IDs

Volcengine Ark 对 Doubao 模型采用「逻辑模型名」和「接入点 ID (ep-xxxx)」两层概念：

- 在 Ark 控制台 / 文档中看到的 `doubao-seed-1.6`、`doubao-seed-code-preview-latest` 等是**逻辑模型名**。
- 通过 OpenAI 兼容接口调用时，通常需要使用你账号下创建的 **接入点 ID**（例如 `ep-20251115213103-t9sf2`）作为 `model`。

llm-link 的处理方式是：

- 对外协议层（/api/chat、/api/tags、Zed 等）仍使用逻辑模型名，方便阅读与配置。
- 在发送请求给 Volcengine 之前，由 Normalizer 层的 `ModelResolver` 将逻辑名映射为真正的 `ep-...`。

映射规则（优先级从高到低）：

1. **本地覆盖文件** `model-overrides.yaml`（仓库根目录，可选，本地配置，已加入 `.gitignore`）：

   ```yaml
   volcengine:
     doubao-seed-code-preview-latest: "ep-your-seedcode-endpoint-id"
     doubao-seed-1.6-thinking: "ep-your-thinking-endpoint-id"
   ```

   如果存在该文件且命中 provider+逻辑名，则总是使用这里配置的 `ep-...`。

2. **Volcengine 默认规则**（无 overrides 时）：

   - 如果请求中的 `model` 本身就是 `ep-...`，则直接透传。
   - 否则（逻辑名），使用配置中的默认模型（通常来自 CLI `--model ep-...`）。

3. **其他 Provider**：

   - 目前保持简单策略：使用请求中的 `model`（为空时回退到默认模型）。

推荐实践：

- 想要**一个进程只用一个 Doubao endpoint**：

  ```bash
  cargo run -- \
    --protocols ollama \
    --provider volcengine \
    --model ep-your-default-endpoint \
    --llm-api-key "$ARK_API_KEY"
  ```

  然后在客户端中使用逻辑名（例如 `doubao-seed-code-preview-latest`），llm-link 会自动映射到默认 `ep-...`。

- 想要**在同一进程中为多个 Doubao 逻辑模型配置不同 endpoint**：

  在根目录创建 `model-overrides.yaml`（可从 `examples/model-overrides.example.yaml` 拷贝），按需要为每个逻辑名指定对应的 `ep-...`，无需修改代码或提交配置。

**💡 Discover All Models:**
```bash
# Query all supported providers and their models via API
curl http://localhost:11434/api/info | jq '.supported_providers'
```

See [API Documentation](docs/API_PROVIDERS_MODELS.md) for details.

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

## 📦 As a Rust Library

Besides running as a standalone service, llm-link can also be used as a Rust library to access provider and model information directly in your applications.

### Add Dependency

Add llm-link to your `Cargo.toml`:

```toml
[dependencies]
llm-link = "0.3.4"
```

### Get Providers and Models

Use the library APIs to access supported providers and their models without starting a service:

```rust
use llm_link::models::ModelsConfig;
use llm_link::provider::ProviderRegistry;

fn main() {
    println!("🚀 LLM Link Providers & Models");
    println!("================================");
    
    // Get all supported providers
    let providers = ProviderRegistry::list_providers();
    println!("📋 Supported providers ({}):", providers.len());
    for provider in &providers {
        println!("  • {}", provider);
    }
    
    // Load models configuration
    let models_config = ModelsConfig::load_with_fallback();
    
    // Get models for specific providers
    for provider in &providers {
        let models = models_config.get_models_for_provider(provider);
        if !models.is_empty() {
            println!("\n🔹 {} ({} models):", provider, models.len());
            for model in models.iter().take(3) {
                println!("    • {} - {}", model.name, model.id);
            }
            if models.len() > 3 {
                println!("    ... and {} more models", models.len() - 3);
            }
        }
    }
    
    // Get provider information
    if let Some(info) = ProviderRegistry::get_provider_info("openai") {
        println!("\n📊 OpenAI Provider Info:");
        println!("  Default Model: {}", info.default_model);
        println!("  Environment Variable: {}", info.env_var);
        println!("  Requires API Key: {}", info.requires_api_key);
    }
}
```

### Library Features

- **🔍 Provider Discovery**: List all available LLM providers
- **📋 Model Information**: Get detailed model specifications for each provider
- **⚡ No Network Overhead**: Direct access without HTTP requests
- **🛠️ Type Safe**: Full Rust type safety and compile-time checks
- **🔄 Dynamic Loading**: Automatically loads from embedded configuration

### Use Cases

- **Model Selection UI**: Build dynamic interfaces for model selection
- **Configuration Tools**: Create setup utilities for different providers
- **Monitoring Applications**: Track available models and providers
- **Integration Libraries**: Build higher-level abstractions on top of llm-link

### Example

Check out the [library usage example](examples/library_usage.rs) for a complete demonstration of how to use llm-link as a library.

Run the example with:
```bash
cargo run --example library_usage
```

## 📡 API Endpoints

LLM Link provides REST APIs for service management and model discovery:

### Get Provider and Model Information

```bash
# Get all supported providers and their models
curl http://localhost:11434/api/info

# Example response:
{
  "service": "llm-link",
  "version": "0.3.2",
  "current_provider": "zhipu",
  "current_model": "glm-4-flash",
  "supported_providers": [
    {
      "name": "zhipu",
      "models": [
        {
          "id": "glm-4.6",
          "name": "GLM-4.6",
          "description": "Latest flagship model with 200K context"
        },
        ...
      ]
    },
    ...
  ]
}
```

### Query Specific Provider Models

```bash
# Get Zhipu models
curl -s http://localhost:11434/api/info | jq '.supported_providers[] | select(.name == "zhipu")'

# List all provider names
curl -s http://localhost:11434/api/info | jq -r '.supported_providers[].name'

# Count models per provider
curl -s http://localhost:11434/api/info | jq -r '.supported_providers[] | "\(.name): \(.models | length) models"'
```

### Hot-Reload Configuration

```bash
# Update API key without restart
curl -X POST http://localhost:11434/api/config/update-key \
  -H "Content-Type: application/json" \
  -d '{"provider": "zhipu", "api_key": "new-api-key"}'

# Switch provider
curl -X POST http://localhost:11434/api/config/switch-provider \
  -H "Content-Type: application/json" \
  -d '{"provider": "openai", "model": "gpt-4"}'
```

📚 **Full API Documentation**: See [API_PROVIDERS_MODELS.md](docs/API_PROVIDERS_MODELS.md)

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

2. **Configure Claude Code**:

   Create or edit the Claude Code settings file at `~/.claude/settings.json`:

   ```json
   {
     "env": {
       "ANTHROPIC_AUTH_TOKEN": "your-auth-token",
       "ANTHROPIC_BASE_URL": "http://localhost:8089",
       "API_TIMEOUT_MS": "300000"
     }
   }
   ```

   **Configuration Options:**
   - `ANTHROPIC_AUTH_TOKEN`: Your authentication token (can be any value when using LLM Link)
   - `ANTHROPIC_BASE_URL`: Point to LLM Link's Claude Code endpoint (`http://localhost:8089`)
   - `API_TIMEOUT_MS`: Request timeout in milliseconds (optional, default: 300000)

3. **Using Different LLM Providers with Claude Code**:

   You can use any supported LLM provider with Claude Code by configuring LLM Link:

   ```bash
   # Use OpenAI GPT-4 with Claude Code
   export OPENAI_API_KEY="sk-xxx"
   ./target/release/llm-link --app claude-code \
     --provider openai \
     --model gpt-4

   # Use Zhipu GLM models with Claude Code
   export ZHIPU_API_KEY="your-zhipu-key"
   ./target/release/llm-link --app claude-code \
     --provider zhipu \
     --model glm-4-flash

   # Use Aliyun Qwen models with Claude Code
   export ALIYUN_API_KEY="your-aliyun-key"
   ./target/release/llm-link --app claude-code \
     --provider aliyun \
     --model qwen-max

   # Use local Ollama models with Claude Code
   ./target/release/llm-link --app claude-code \
     --provider ollama \
     --model llama2
   ```

   **Note**: The Claude Code settings file (`~/.claude/settings.json`) remains the same regardless of which LLM provider you use. LLM Link handles the provider switching transparently.

## 🔧 Advanced Usage

### Runtime Configuration Updates

LLM Link provides APIs for runtime configuration management, enabling desktop applications and process managers to update provider settings without manual restarts.

#### Configuration Management APIs

```bash
# Get current configuration
GET http://localhost:11434/api/config/current

# Get health status and instance ID (for restart verification)
GET http://localhost:11434/api/health

# Validate API key before applying
POST http://localhost:11434/api/config/validate
{
  "provider": "zhipu",
  "api_key": "your-api-key"
}

# Prepare configuration for restart
POST http://localhost:11434/api/config/update
{
  "provider": "zhipu",
  "api_key": "your-api-key",
  "model": "glm-4-flash"
}
```

#### Integration Flow

When integrating LLM Link into desktop applications or process managers:

1. **Validate Configuration**: Call `/api/config/validate` to verify the API key
2. **Prepare Update**: Call `/api/config/update` to get restart parameters and current `instance_id`
3. **Restart Process**: Kill current process and start with new environment variables
4. **Verify Success**: Poll `/api/health` until `instance_id` changes and configuration matches

**Example Response**:
```json
{
  "status": "success",
  "current_instance_id": 1729900000,
  "env_vars": {
    "ZHIPU_API_KEY": "your-api-key"
  },
  "cli_args": {
    "provider": "zhipu",
    "model": "glm-4-flash"
  }
}
```

**Restart Verification**:
```bash
# After restart, verify new instance
GET /api/health
{
  "status": "ok",
  "instance_id": 1729900050,  // Changed - restart successful
  "provider": "zhipu",         // Config applied
  "model": "glm-4-flash"
}
```

**Complete Documentation**:
- 📖 [Configuration Update API](./docs/CONFIG_UPDATE_API.md) - Full API reference and examples
- 📖 [Restart Verification Guide](./docs/RESTART_VERIFICATION.md) - TypeScript/Python integration examples

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

## 🔥 Hot-Reload Configuration

**New in v0.3.0**: Update API keys and switch providers without restarting the service!

Perfect for desktop applications like **z-agent** where users need to change settings through a UI.

### 🚀 Quick Examples

```bash
# Check current configuration
curl http://localhost:11434/api/config/current

# Update API key for OpenAI (no restart needed!)
curl -X POST http://localhost:11434/api/config/update-key \
  -H "Content-Type: application/json" \
  -d '{"provider": "openai", "api_key": "sk-..."}'

# Switch to Anthropic instantly
curl -X POST http://localhost:11434/api/config/switch-provider \
  -H "Content-Type: application/json" \
  -d '{"provider": "anthropic", "model": "claude-3-5-sonnet-20241022", "api_key": "sk-ant-..."}'

# Validate API key before using
curl -X POST http://localhost:11434/api/config/validate-key \
  -H "Content-Type: application/json" \
  -d '{"provider": "ollama", "api_key": ""}'
```

### 🔧 Hot-Reload API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/config/current` | GET | Get current provider, model, and hot-reload status |
| `/api/config/update-key` | POST | Update API key for specific provider |
| `/api/config/switch-provider` | POST | Switch to different LLM provider |
| `/api/config/validate-key` | POST | Validate API key and get model list |

### ✨ Features

- **🔄 Zero Downtime**: Configuration changes without service restart
- **🔒 Secure**: API keys are safely masked in logs
- **✅ Validation**: Test API keys before applying changes
- **🧵 Thread Safe**: Concurrent requests handled safely
- **📋 Model Discovery**: Get available models during validation

### 📚 Integration Examples

**JavaScript/TypeScript:**
```javascript
const client = new LlmLinkClient('http://localhost:11434');

// Check if hot-reload is supported
const config = await client.getCurrentConfig();
if (config.supports_hot_reload) {
  // Update API key
  await client.updateApiKey('openai', 'sk-...');

  // Switch provider
  await client.switchProvider('anthropic', 'claude-3-5-sonnet-20241022', 'sk-ant-...');
}
```

**Python:**
```python
client = LlmLinkClient('http://localhost:11434')

# Validate and update
validation = client.validate_api_key('openai', 'sk-...')
if validation['status'] == 'valid':
    client.update_api_key('openai', 'sk-...')
```

📖 **Complete Documentation**: [Hot-Reload API Guide](./HOT_RELOAD_API.md)

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

# Test Claude Code API endpoint
curl -X POST http://localhost:8089/v1/messages \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-auth-token" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 100,
    "messages": [
      {"role": "user", "content": "Hello, world!"}
    ]
  }'
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
   echo $ANTHROPIC_API_KEY
   ```

4. **Claude Code Configuration Issues**
   ```bash
   # Check Claude Code settings file
   cat ~/.claude/settings.json

   # Verify the settings format is correct
   # Should contain: ANTHROPIC_AUTH_TOKEN, ANTHROPIC_BASE_URL

   # Test if LLM Link is accessible from Claude Code
   curl -H "x-api-key: your-auth-token" http://localhost:8089/health
   ```

5. **Provider Switching Issues**
   ```bash
   # When switching providers, make sure to:
   # 1. Stop the current LLM Link instance
   # 2. Set the correct API key for the new provider
   # 3. Start LLM Link with the new provider

   # Example: Switch from Anthropic to OpenAI
   # Stop current instance (Ctrl+C)
   export OPENAI_API_KEY="sk-xxx"
   ./target/release/llm-link --app claude-code --provider openai --model gpt-4
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

#### 4. Normalizer Layer (`src/normalizer/`)

Protocol normalization and LLM communication layer, encapsulates interaction with LLM providers.

**Modules:**
- `mod.rs` - Unified client struct and constructor
- `types.rs` - Type definitions (Model, Response, Usage)
- `chat.rs` - Non-streaming chat
- `stream.rs` - Streaming chat
- `models.rs` - Model management

**Responsibilities:**
- Encapsulate llm-connector library
- Normalize requests/responses across different provider protocols
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
4. Normalizer Layer
   ├─ LLM Connector Wrapper
   └─ Request Formatting
   ↓
5. LLM Provider
```

### Response Flow

```
1. LLM Provider Response
   ↓
2. Normalizer Layer
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
│   ├── normalizer/         # Protocol normalization and LLM communication layer
│   │   ├── mod.rs          # Unified client struct
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

- [📖 Documentation Center](docs/README.md) - Complete documentation index
- [🚀 Quick Start](docs/guides/QUICK_START.md) - Quick getting started guide
- [🔌 Application Integration](docs/guides/INTEGRATION.md) - Zed, Claude Code, Codex CLI integration
- [⚙️ Configuration Guide](docs/guides/CONFIGURATION.md) - Detailed configuration instructions
- [📡 API Documentation](docs/api/) - API interface documentation
- [📋 Changelog](CHANGELOG.md) - Version history and updates

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ⭐ Support

If you find LLM Link helpful, please consider giving it a star on GitHub!

---

**Made with ❤️ for the AI coding**
