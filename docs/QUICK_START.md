# LLM Link 快速开始

## 🚀 基础使用

⚠️ **重要**：必须指定 `--provider` 和对应的 API key！

### 使用 OpenAI GPT-4
```bash
export OPENAI_API_KEY="sk-xxx"
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --provider openai
# 默认使用 gpt-4，也可以指定其他模型：
# ./target/release/llm-link --app codex-cli --provider openai --model gpt-4o
```

### 使用 Anthropic Claude
```bash
export ANTHROPIC_API_KEY="sk-ant-xxx"
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --provider anthropic
# 默认使用 claude-3-5-sonnet-20241022
```

### 使用 Zhipu GLM
```bash
export ZHIPU_API_KEY="your-zhipu-api-key"
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --provider zhipu
# 默认使用 glm-4-flash，也可以指定：--model glm-4
```

### 使用 Aliyun Qwen
```bash
export ALIYUN_API_KEY="your-aliyun-key"
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --provider aliyun
# 默认使用 qwen-max，也可以指定：--model qwen-turbo
```

### 使用 Ollama 本地模型
```bash
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --provider ollama --model llama2
# Ollama 不需要 API key，但必须指定模型名称
```

## 🔄 切换模型

### 指定不同的模型（同一 Provider）
```bash
# 使用 OpenAI 的 GPT-4o 而不是默认的 GPT-4
export OPENAI_API_KEY="sk-xxx"
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --provider openai --model gpt-4o

# 使用 Zhipu 的 GLM-4 而不是默认的 GLM-4-Flash
export ZHIPU_API_KEY="your-key"
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --provider zhipu --model glm-4
```

## 📋 支持的 Provider

| Provider | 默认模型 | API Key 环境变量 | 是否必需 |
|----------|---------|-----------------|---------|
| `openai` | `gpt-4` | `OPENAI_API_KEY` | ✅ 必需 |
| `anthropic` | `claude-3-5-sonnet-20241022` | `ANTHROPIC_API_KEY` | ✅ 必需 |
| `zhipu` | `glm-4-flash` | `ZHIPU_API_KEY` | ✅ 必需 |
| `aliyun` | `qwen-max` | `ALIYUN_API_KEY` | ✅ 必需 |
| `ollama` | `llama2` | - | ❌ 不需要 API key |

⚠️ **注意**：
- **`--provider` 参数是必需的**，必须明确指定使用哪个 LLM provider
- **对应的 API key 也是必需的**（Ollama 除外）
- **`--model` 参数是可选的**，不指定时使用该 provider 的默认模型

## 🔧 命令行参数

```bash
-a, --app <APP>              # 应用模式（codex-cli, zed, claude-code）
    --protocols <PROTOCOLS>  # 协议模式（逗号分隔：openai,ollama,anthropic）
    --list-apps              # 列出所有支持的应用
    --app-info <APP>         # 显示应用配置信息
    --api-key <API_KEY>      # LLM Link 认证密钥（覆盖 LLM_LINK_API_KEY）
    --provider <PROVIDER>    # 指定 LLM provider（必需）
    --model <MODEL>          # 指定模型名称（可选，使用 provider 默认模型）
    --llm-api-key <KEY>      # LLM provider API key（覆盖环境变量）
    --host <HOST>            # 服务器地址
-p, --port <PORT>            # 服务器端口
    --log-level <LEVEL>      # 日志级别 [默认: info]
-h, --help                   # 显示帮助信息
```

💡 **参数说明**：
- **`--provider`**：**必需**，指定 LLM provider（openai, anthropic, zhipu, aliyun, ollama）
- **`--model`**：**可选**，指定模型名称，不指定时使用该 provider 的默认模型
- **API Key**：**必需**（Ollama 除外），通过环境变量或 `--llm-api-key` 提供
- **`LLM_LINK_API_KEY`**：**必需**（用于 Codex CLI 认证），通过环境变量或 `--api-key` 提供

## 📚 更多文档

- [完整 README](../README.md) - 包含完整的功能说明和架构文档
- [版本历史](../CHANGELOG.md) - 查看更新和变更记录

