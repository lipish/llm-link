# Zed IDE Integration Guide

## 🎯 Overview

LLM Link provides seamless integration with Zed IDE by exposing an Ollama-compatible API while allowing you to use any supported LLM provider as the backend.

## 🏗️ Architecture

```
┌─────────────┐
│   Zed IDE   │
└──────┬──────┘
       │ Ollama API Format
       │ (http://localhost:11434)
       ↓
┌─────────────────────────────────┐
│      LLM Link Proxy             │
│  ┌───────────────────────────┐  │
│  │   Ollama API Layer        │  │ ← Receives Ollama format requests
│  │   - /api/chat             │  │
│  │   - /api/tags             │  │
│  │   - /api/generate         │  │
│  └───────────┬───────────────┘  │
│              │                   │
│  ┌───────────▼───────────────┐  │
│  │   Format Converter        │  │ ← Converts between formats
│  └───────────┬───────────────┘  │
│              │                   │
│  ┌───────────▼───────────────┐  │
│  │   LLM Backend             │  │ ← Connects to actual LLM
│  │   (Aliyun/Zhipu/OpenAI)   │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
       │
       ↓
┌─────────────────────┐
│  LLM Provider API   │
│  - Aliyun Qwen      │
│  - Zhipu GLM        │
│  - OpenAI GPT       │
│  - Anthropic Claude │
└─────────────────────┘
```

## 🔧 Configuration

### Start LLM Link for Zed

```bash
# Using Aliyun Qwen
./llm-link --app zed --provider aliyun --model qwen-max

# Using Zhipu GLM
./llm-link --app zed --provider zhipu --model glm-4-flash

# Using OpenAI
./llm-link --app zed --provider openai --model gpt-4

# Using Anthropic Claude
./llm-link --app zed --provider anthropic --model claude-3-5-sonnet-20241022
```

### Configure Zed IDE

Edit your Zed settings file (`~/.config/zed/settings.json`):

```json
{
  "language_models": {
    "ollama": {
      "api_url": "http://localhost:11434"
    }
  }
}
```

## 📋 Understanding the Logs

When you start LLM Link with `--app zed --provider aliyun`, you'll see:

```
🚀 Starting in zed mode
🔄 Overriding LLM provider to: aliyun
🔄 Using model: qwen-max
🌐 Server will bind to 0.0.0.0:11434
🦙 Ollama API enabled on path: 
🔓 Ollama API key authentication: DISABLED
```

### Why "Ollama API enabled" when using Aliyun?

This is **correct behavior**! Here's why:

1. **Frontend Protocol**: Zed IDE communicates using Ollama API format
2. **Backend Provider**: LLM Link forwards requests to Aliyun (or any other provider)
3. **Format Translation**: LLM Link automatically converts between Ollama and provider formats

**Think of it as**:
- **Ollama API** = The "language" Zed speaks
- **Aliyun/Zhipu/OpenAI** = The actual AI service doing the work
- **LLM Link** = The translator between them

## 🔄 Request Flow Example

### 1. Zed sends Ollama format request:

```json
POST http://localhost:11434/api/chat
{
  "model": "qwen-max",
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "stream": true
}
```

### 2. LLM Link converts to Aliyun format:

```json
POST https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions
{
  "model": "qwen-max",
  "messages": [
    {"role": "user", "content": "Hello"}
  ],
  "stream": true
}
Headers: {
  "Authorization": "Bearer sk-xxx",
  "Content-Type": "application/json"
}
```

### 3. Aliyun responds, LLM Link converts back to Ollama format

### 4. Zed receives Ollama format response

## ✅ Supported Features

- ✅ Chat completions
- ✅ Streaming responses
- ✅ Model listing
- ✅ Multi-turn conversations
- ✅ System prompts
- ✅ Temperature and other parameters

## 🎯 Supported Providers

| Provider | Model Examples | API Key Required |
|----------|---------------|------------------|
| **Aliyun** | qwen-max, qwen-plus, qwen-turbo | Yes (ALIYUN_API_KEY) |
| **Zhipu** | glm-4-flash, glm-4-plus | Yes (ZHIPU_API_KEY) |
| **OpenAI** | gpt-4, gpt-3.5-turbo | Yes (OPENAI_API_KEY) |
| **Anthropic** | claude-3-5-sonnet | Yes (ANTHROPIC_API_KEY) |
| **Ollama** | llama2, mistral, etc. | No (local) |

## 🚀 Quick Start

### 1. Set up API key

```bash
# For Aliyun
export ALIYUN_API_KEY="sk-your-key-here"

# For Zhipu
export ZHIPU_API_KEY="your-key-here"

# For OpenAI
export OPENAI_API_KEY="sk-your-key-here"
```

### 2. Start LLM Link

```bash
./llm-link --app zed --provider aliyun --model qwen-max
```

### 3. Configure Zed

Add to `~/.config/zed/settings.json`:

```json
{
  "language_models": {
    "ollama": {
      "api_url": "http://localhost:11434"
    }
  }
}
```

### 4. Use in Zed

- Open Zed IDE
- Use the AI assistant features
- Zed will automatically use your configured LLM provider through LLM Link!

## 🔍 Troubleshooting

### Issue: "Ollama API enabled" but I'm using Aliyun

**This is normal!** Ollama API is the protocol Zed uses to communicate. Your backend is still Aliyun.

### Issue: Connection refused

Make sure LLM Link is running on port 11434:
```bash
curl http://localhost:11434/api/tags
```

### Issue: No models showing up

Check that your API key is valid and the service is running.

## 📚 See Also

- [Quick Start Guide](QUICK_START.md)
- [Main README](../README.md)
- [Changelog](../CHANGELOG.md)

