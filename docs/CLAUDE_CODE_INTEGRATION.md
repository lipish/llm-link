# Claude Code Integration Guide

## 🎯 Overview

This guide shows how to use **Claude Code** (or any Anthropic API compatible client) with llm-link, allowing you to use different LLM providers as the backend while maintaining Anthropic API compatibility.

## 🏗️ Architecture

```
Claude Code Client
    ↓
http://localhost:8089 (Anthropic API format)
    ↓
llm-link (API Layer)
    ↓
Format Conversion
    ↓
LLM Backend (Zhipu/OpenAI/Aliyun/etc)
```

## 🚀 Quick Start

### Using Zhipu GLM-4 as Backend

#### Step 1: Set up API Key

```bash
export ZHIPU_API_KEY="your-zhipu-api-key"
```

#### Step 2: Start llm-link

```bash
# Using glm-4-flash (recommended for speed)
llm-link --app claude-code --provider zhipu --model glm-4-flash

# Or using glm-4-plus (more capable)
llm-link --app claude-code --provider zhipu --model glm-4-plus

# Or using glm-4 (standard)
llm-link --app claude-code --provider zhipu --model glm-4
```

#### Step 3: Configure Claude Code

Point your Claude Code client to:
```
API Endpoint: http://localhost:8089
API Key: (not required, but can be set via --api-key if needed)
```

## 📋 Supported Models

### Zhipu AI Models

| Model | Description | Best For |
|-------|-------------|----------|
| `glm-4-flash` | Fast and cost-effective | Quick responses, coding assistance |
| `glm-4-plus` | Enhanced capabilities | Complex tasks, detailed analysis |
| `glm-4` | Standard model | General purpose |
| `glm-4-air` | Lightweight | Simple queries |

**Note**: Zhipu doesn't have a model called "glm-4.6". Use `glm-4-flash`, `glm-4-plus`, or `glm-4` instead.

### Other Providers

You can also use other providers as backend:

#### OpenAI
```bash
export OPENAI_API_KEY="sk-xxx"
llm-link --app claude-code --provider openai --model gpt-4
```

#### Aliyun Qwen
```bash
export ALIYUN_API_KEY="sk-xxx"
llm-link --app claude-code --provider aliyun --model qwen-max
```

#### Anthropic (Direct)
```bash
export ANTHROPIC_API_KEY="sk-ant-xxx"
llm-link --app claude-code --provider anthropic --model claude-3-5-sonnet-20241022
```

#### Volcengine
```bash
export VOLCENGINE_API_KEY="xxx"
llm-link --app claude-code --provider volcengine --model doubao-pro-32k
```

#### Tencent Hunyuan
```bash
export TENCENT_API_KEY="xxx"
llm-link --app claude-code --provider tencent --model hunyuan-lite
```

## 🔧 Configuration Options

### Basic Usage

```bash
llm-link --app claude-code --provider <provider> --model <model>
```

### With API Key Authentication

If your Claude Code client requires authentication:

```bash
llm-link --app claude-code --provider zhipu --model glm-4-flash --api-key "your-auth-token"
```

Or set environment variable:
```bash
export LLM_LINK_API_KEY="your-auth-token"
llm-link --app claude-code --provider zhipu --model glm-4-flash
```

### Custom Configuration File

Create `config.yaml`:
```yaml
server:
  host: "0.0.0.0"
  port: 8089

llm_backend:
  provider: zhipu
  api_key: "your-zhipu-api-key"
  model: "glm-4-flash"

apis:
  anthropic:
    enabled: true
    path: ""
    api_key: "optional-auth-token"
```

Then run:
```bash
llm-link --config config.yaml
```

## 🧪 Testing

### Test with curl

#### Non-streaming Request
```bash
curl -X POST http://localhost:8089/v1/messages \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "你好，请用一句话介绍你自己"
      }
    ]
  }'
```

#### Streaming Request
```bash
curl -N -X POST http://localhost:8089/v1/messages \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "用一句话介绍北京"
      }
    ],
    "stream": true
  }'
```

## 📊 Provider Comparison

| Provider | Speed | Cost | Chinese Support | Recommended Model |
|----------|-------|------|-----------------|-------------------|
| **Zhipu** | ⚡⚡⚡ | 💰 | ✅ Excellent | glm-4-flash |
| **Aliyun** | ⚡⚡⚡ | 💰 | ✅ Excellent | qwen-max |
| **OpenAI** | ⚡⚡ | 💰💰💰 | ✅ Good | gpt-4 |
| **Anthropic** | ⚡⚡ | 💰💰 | ✅ Good | claude-3-5-sonnet |
| **Volcengine** | ⚡⚡⚡ | 💰 | ✅ Excellent | doubao-pro-32k |
| **Tencent** | ⚡⚡⚡ | 💰 | ✅ Excellent | hunyuan-lite |

## 🎯 Use Cases

### 1. Cost Optimization
Use cheaper Chinese providers (Zhipu, Aliyun) instead of Anthropic:
```bash
# Instead of paying for Claude
llm-link --app claude-code --provider zhipu --model glm-4-flash
```

### 2. Speed Optimization
Use fast models for quick responses:
```bash
llm-link --app claude-code --provider zhipu --model glm-4-flash
```

### 3. Quality Optimization
Use more capable models for complex tasks:
```bash
llm-link --app claude-code --provider aliyun --model qwen-max
```

### 4. Local Development
Use Ollama for offline development:
```bash
llm-link --app claude-code --provider ollama --model llama2
```

## 🔍 Troubleshooting

### Issue: Connection Refused

**Solution**: Make sure llm-link is running:
```bash
curl http://localhost:8089/health
```

### Issue: API Key Error

**Solution**: Check your API key is set:
```bash
echo $ZHIPU_API_KEY
```

### Issue: Model Not Found

**Solution**: Use correct model name for the provider:
- Zhipu: `glm-4-flash`, `glm-4-plus`, `glm-4`
- Aliyun: `qwen-max`, `qwen-plus`, `qwen-turbo`
- OpenAI: `gpt-4`, `gpt-3.5-turbo`

### Issue: Empty Response

**Solution**: Check server logs for errors:
```bash
llm-link --app claude-code --provider zhipu --model glm-4-flash --log-level debug
```

## 📚 See Also

- [Quick Start Guide](QUICK_START.md)
- [Model Marketplace](MODEL_MARKETPLACE.md)
- [Zed Integration](ZED_INTEGRATION.md)
- [Main README](../README.md)

## 💡 Tips

1. **Use glm-4-flash for coding**: It's fast and cost-effective
2. **Use qwen-max for complex tasks**: Better reasoning capabilities
3. **Set up environment variables**: Easier than passing API keys every time
4. **Monitor logs**: Use `--log-level info` to see what's happening
5. **Test with curl first**: Verify the setup before using Claude Code

## 🎉 Example Session

```bash
# 1. Set up API key
export ZHIPU_API_KEY="your-api-key-here"

# 2. Start llm-link
llm-link --app claude-code --provider zhipu --model glm-4-flash

# Output:
# 🚀 Starting in claude-code mode
# 🔄 Overriding LLM provider to: zhipu
# 🔄 Using model: glm-4-flash
# 🎉 LLM Link proxy is listening on 0.0.0.0:8089
# 📡 Ready to accept connections!

# 3. Test with curl (in another terminal)
curl -X POST http://localhost:8089/v1/messages \
  -H "Content-Type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'

# 4. Configure your Claude Code client to use http://localhost:8089
```

---

**Ready to use Claude Code with any LLM provider!** 🚀

