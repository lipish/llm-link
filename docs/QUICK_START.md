# LLM Link 快速开始

## 🚀 基础使用

### 默认配置（Zhipu GLM-4-Flash）
```bash
export ZHIPU_API_KEY="your-zhipu-api-key"
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli
```

💡 **说明**：
- `--model` 参数是**可选的**，每个 provider 都有默认模型
- 不指定 `--provider` 时，使用应用默认配置（Codex CLI 默认使用 Zhipu）

## 🔄 切换 Provider

### OpenAI GPT-4
```bash
export OPENAI_API_KEY="sk-xxx"
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --provider openai
# 默认使用 gpt-4，也可以指定其他模型：
# ./target/release/llm-link --app codex-cli --provider openai --model gpt-4o
```

### Anthropic Claude
```bash
export ANTHROPIC_API_KEY="sk-ant-xxx"
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --provider anthropic
# 默认使用 claude-3-5-sonnet-20241022
```

### Aliyun Qwen
```bash
export ALIYUN_API_KEY="your-aliyun-key"
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --provider aliyun
# 默认使用 qwen-max，也可以指定：--model qwen-turbo
```

### Ollama 本地模型
```bash
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --provider ollama --model llama2
# Ollama 不需要 API key，但需要指定模型名称
```

### 只更换模型（保持当前 Provider）
```bash
export ZHIPU_API_KEY="your-zhipu-api-key"
export LLM_LINK_API_KEY="your-auth-token"
./target/release/llm-link --app codex-cli --model glm-4
# 使用 Zhipu provider，但切换到 glm-4 模型
```

## 📋 支持的 Provider

| Provider | 默认模型 | API Key 环境变量 | 说明 |
|----------|---------|-----------------|------|
| `openai` | `gpt-4` | `OPENAI_API_KEY` | OpenAI GPT 系列 |
| `anthropic` | `claude-3-5-sonnet-20241022` | `ANTHROPIC_API_KEY` | Anthropic Claude 系列 |
| `zhipu` | `glm-4-flash` | `ZHIPU_API_KEY` | 智谱 GLM 系列 |
| `aliyun` | `qwen-max` | `ALIYUN_API_KEY` | 阿里云通义千问系列 |
| `ollama` | `llama2` | - | 本地 Ollama 模型 |

## 🔧 命令行参数

```bash
-a, --app <APP>              # 应用模式（codex-cli, zed, claude-code）
    --protocols <PROTOCOLS>  # 协议模式（逗号分隔：openai,ollama,anthropic）
    --list-apps              # 列出所有支持的应用
    --app-info <APP>         # 显示应用配置信息
    --api-key <API_KEY>      # LLM Link 认证密钥（覆盖 LLM_LINK_API_KEY）
    --provider <PROVIDER>    # 覆盖 LLM provider（可选）
    --model <MODEL>          # 覆盖模型名称（可选）
    --llm-api-key <KEY>      # LLM provider API key（覆盖环境变量）
    --host <HOST>            # 服务器地址
-p, --port <PORT>            # 服务器端口
    --log-level <LEVEL>      # 日志级别 [默认: info]
-h, --help                   # 显示帮助信息
```

💡 **提示**：
- `--provider` 和 `--model` 都是**可选的**
- 不指定时使用应用默认配置
- 可以只指定 `--provider`（使用该 provider 的默认模型）
- 可以只指定 `--model`（保持当前 provider，切换模型）

## 📚 更多文档

- [完整 README](../README.md) - 包含完整的功能说明和架构文档
- [版本历史](../CHANGELOG.md) - 查看更新和变更记录

