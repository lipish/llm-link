# LLM Link 快速开始

## 🚀 基础使用

### 默认配置（Zhipu）
```bash
ZHIPU_API_KEY=xxx \
LLM_LINK_API_KEY=xxx \
./target/release/llm-link --app codex-cli
```

## 🔄 切换 Provider

### OpenAI GPT-4
```bash
OPENAI_API_KEY=sk-xxx \
LLM_LINK_API_KEY=xxx \
./target/release/llm-link --app codex-cli \
  --provider openai \
  --model gpt-4
```

### Anthropic Claude
```bash
ANTHROPIC_API_KEY=sk-ant-xxx \
LLM_LINK_API_KEY=xxx \
./target/release/llm-link --app codex-cli \
  --provider anthropic
```

### Ollama 本地模型
```bash
LLM_LINK_API_KEY=xxx \
./target/release/llm-link --app codex-cli \
  --provider ollama \
  --model llama2
```

### 只更换模型
```bash
ZHIPU_API_KEY=xxx \
LLM_LINK_API_KEY=xxx \
./target/release/llm-link --app codex-cli \
  --model glm-4
```

## 📋 支持的 Provider

| Provider | 默认模型 | API Key 环境变量 |
|----------|---------|-----------------|
| `openai` | `gpt-4` | `OPENAI_API_KEY` |
| `anthropic` | `claude-3-5-sonnet-20241022` | `ANTHROPIC_API_KEY` |
| `zhipu` | `glm-4-flash` | `ZHIPU_API_KEY` |
| `ollama` | `llama2` | - |

## 🔧 命令行参数

```bash
--app <APP>              # 应用模式（codex-cli, zed-dev, etc.）
--provider <PROVIDER>    # 覆盖 provider
--model <MODEL>          # 覆盖 model
--llm-api-key <KEY>      # 覆盖 API key
--host <HOST>            # 服务器地址
--port <PORT>            # 服务器端口
--log-level <LEVEL>      # 日志级别
```

## 📚 更多文档

- [Provider Override 详细文档](docs/PROVIDER_OVERRIDE.md)
- [完整功能说明](PROVIDER_OVERRIDE_FEATURE.md)
- [测试脚本](tests/test_provider_override.sh)

