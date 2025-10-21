# LLM Provider Model Marketplace

This document lists the official model marketplaces for each supported LLM provider. Use these links to find available models, pricing, and documentation.

## 📋 Supported Providers

### 1. OpenAI

**Provider**: `openai`

**Model Marketplace**: https://platform.openai.com/docs/models

**Popular Models**:
- `gpt-4` - Most capable GPT-4 model
- `gpt-4-turbo` - Faster and cheaper GPT-4
- `gpt-3.5-turbo` - Fast and cost-effective
- `gpt-4o` - Multimodal GPT-4

**API Key**: `OPENAI_API_KEY`

**Example**:
```bash
export OPENAI_API_KEY="sk-xxx"
./llm-link --app zed --provider openai --model gpt-4
```

---

### 2. Anthropic Claude

**Provider**: `anthropic`

**Model Marketplace**: https://docs.anthropic.com/claude/docs/models-overview

**Popular Models**:
- `claude-3-5-sonnet-20241022` - Most intelligent model
- `claude-3-opus-20240229` - Powerful for complex tasks
- `claude-3-sonnet-20240229` - Balanced performance
- `claude-3-haiku-20240307` - Fast and compact

**API Key**: `ANTHROPIC_API_KEY`

**Example**:
```bash
export ANTHROPIC_API_KEY="sk-ant-xxx"
./llm-link --app zed --provider anthropic --model claude-3-5-sonnet-20241022
```

---

### 3. Zhipu AI (智谱 AI)

**Provider**: `zhipu`

**Model Marketplace**: https://open.bigmodel.cn/dev/api#glm-4

**Popular Models**:
- `glm-4-flash` - Fast and cost-effective
- `glm-4-plus` - Enhanced capabilities
- `glm-4` - Standard model
- `glm-4-air` - Lightweight version

**API Key**: `ZHIPU_API_KEY`

**Example**:
```bash
export ZHIPU_API_KEY="xxx.yyy"
./llm-link --app zed --provider zhipu --model glm-4-flash
```

---

### 4. Aliyun Qwen (阿里云通义千问)

**Provider**: `aliyun`

**Model Marketplace**: https://help.aliyun.com/zh/dashscope/developer-reference/model-square

**Popular Models**:
- `qwen-max` - Most capable model
- `qwen-plus` - Balanced performance
- `qwen-turbo` - Fast and efficient
- `qwen-long` - Long context support

**API Key**: `ALIYUN_API_KEY`

**Example**:
```bash
export ALIYUN_API_KEY="sk-xxx"
./llm-link --app zed --provider aliyun --model qwen-max
```

---

### 5. Volcengine (火山引擎)

**Provider**: `volcengine`

**Model Marketplace**: https://console.volcengine.com/ark/region:ark+cn-beijing/model?vendor=Bytedance&view=DEFAULT_VIEW

**Popular Models**:
- `doubao-pro-32k` - Doubao Pro with 32k context
- `doubao-lite-32k` - Lightweight Doubao
- `doubao-pro-4k` - Standard Doubao Pro
- Check the marketplace for the latest models

**API Key**: `VOLCENGINE_API_KEY`

**Example**:
```bash
export VOLCENGINE_API_KEY="xxx"
./llm-link --app zed --provider volcengine --model doubao-pro-32k
```

**Note**: Volcengine models are also known as "Doubao" (豆包).

---

### 6. Tencent Hunyuan (腾讯混元)

**Provider**: `tencent`

**Model Marketplace**: https://hunyuan.tencent.com/modelSquare/home/list

**Popular Models**:
- `hunyuan-lite` - Lightweight model
- `hunyuan-standard` - Standard model
- `hunyuan-pro` - Professional model
- Check the marketplace for the latest models

**API Key**: `TENCENT_API_KEY`

**Example**:
```bash
export TENCENT_API_KEY="xxx"
./llm-link --app zed --provider tencent --model hunyuan-lite
```

---

### 7. Ollama (Local)

**Provider**: `ollama`

**Model Marketplace**: https://ollama.com/library

**Popular Models**:
- `llama2` - Meta's Llama 2
- `mistral` - Mistral AI
- `codellama` - Code-specialized Llama
- `qwen` - Qwen models (local)

**API Key**: Not required (local deployment)

**Example**:
```bash
# No API key needed
./llm-link --app zed --provider ollama --model llama2
```

**Note**: Requires Ollama to be running locally on http://localhost:11434

---

## 🔄 Version Sync

This document should be updated when:
- A new provider is added to llm-connector
- Provider model lists are significantly updated
- New major models are released

**Last Updated**: 2025-10-19 (llm-connector v0.4.20)

**Changes in v0.4.20**:
- ✅ Added Volcengine (火山引擎) provider
- ✅ Added Tencent Hunyuan (腾讯混元) provider
- ✅ Fixed Aliyun streaming response issues

---

## 📚 See Also

- [Quick Start Guide](QUICK_START.md)
- [Zed Integration Guide](ZED_INTEGRATION.md)
- [Main README](../README.md)
- [Changelog](../CHANGELOG.md)

---

## 🔗 Quick Reference

| Provider | Marketplace URL | API Key Env Var |
|----------|----------------|-----------------|
| OpenAI | https://platform.openai.com/docs/models | `OPENAI_API_KEY` |
| Anthropic | https://docs.anthropic.com/claude/docs/models-overview | `ANTHROPIC_API_KEY` |
| Zhipu | https://open.bigmodel.cn/dev/api#glm-4 | `ZHIPU_API_KEY` |
| Aliyun | https://help.aliyun.com/zh/dashscope/developer-reference/model-square | `ALIYUN_API_KEY` |
| Volcengine | https://console.volcengine.com/ark/region:ark+cn-beijing/model | `VOLCENGINE_API_KEY` |
| Tencent | https://hunyuan.tencent.com/modelSquare/home/list | `TENCENT_API_KEY` |
| Ollama | https://ollama.com/library | N/A (local) |

