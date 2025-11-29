# 应用集成指南

本指南介绍如何将 LLM Link 与各种 AI 编码工具集成，让您可以使用任何支持的 LLM 提供商作为后端。

## 🎯 支持的应用

| 应用 | 协议 | 端口 | 认证 | 状态 |
|------|------|------|------|------|
| **Codex CLI** | OpenAI API | 8088 | Bearer Token | ✅ 就绪 |
| **Zed** | Ollama API | 11434 | 无需认证 | ✅ 就绪 |

## 🏗️ 架构概览

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   编码工具       │    │   LLM Link      │    │   LLM 提供商     │
│                 │    │                 │    │                 │
│ • Codex CLI     │───▶│ • 协议转换       │───▶│ • OpenAI        │
│ • Zed IDE       │    │ • 格式适配       │    │ • Anthropic     │
│                 │    │ • 路由分发       │    │ • Zhipu         │
│                 │    │                 │    │ • Aliyun        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📱 Zed IDE 集成

### 快速开始

#### 1. 启动 LLM Link

```bash
# 使用智谱 GLM-4
./llm-link --app zed --provider zhipu --model glm-4-flash

# 使用阿里云通义千问
./llm-link --app zed --provider aliyun --model qwen-max

# 使用 OpenAI
./llm-link --app zed --provider openai --model gpt-4

# 使用 Anthropic Claude
./llm-link --app zed --provider anthropic --model claude-3-5-sonnet-20241022
```

#### 2. 配置 Zed IDE

编辑 Zed 设置文件 (`~/.config/zed/settings.json`):

```json
{
  "language_models": {
    "ollama": {
      "api_url": "http://localhost:11434"
    }
  }
}
```

#### 3. 使用 Zed AI 助手

- 打开 Zed IDE
- 使用 AI 助手功能
- Zed 将自动通过 LLM Link 使用您配置的 LLM 提供商！

### 理解日志输出

当您运行 `--app zed --provider zhipu` 时，会看到：

```
🚀 Starting in zed mode
🔄 Overriding LLM provider to: zhipu
🔄 Using model: glm-4-flash
🌐 Server will bind to 0.0.0.0:11434
🦙 Ollama API enabled on path: 
🔓 Ollama API key authentication: DISABLED
```

**为什么显示 "Ollama API enabled" 但使用的是智谱？**

这是正确的行为！因为：
- **前端协议**：Zed IDE 使用 Ollama API 格式通信
- **后端提供商**：LLM Link 将请求转发到智谱（或其他提供商）
- **格式转换**：LLM Link 自动在 Ollama 和提供商格式之间转换

## 💻 Codex CLI 集成

### 快速开始

#### 1. 启动 LLM Link

```bash
# 使用 OpenAI GPT-4
export OPENAI_API_KEY="sk-xxx"
./llm-link --app codex-cli --provider openai

# 使用智谱 GLM-4
export ZHIPU_API_KEY="your-key-here"
./llm-link --app codex-cli --provider zhipu --model glm-4-flash

# 使用阿里云通义千问
export ALIYUN_API_KEY="sk-xxx"
./llm-link --app codex-cli --provider aliyun --model qwen-max
```

#### 2. 配置 Codex CLI

Codex CLI 将自动连接到 `http://localhost:8088` 并使用 OpenAI API 格式。

## 🎯 使用场景推荐

### 1. 成本优化

使用更便宜的中国提供商替代昂贵的西方模型：

```bash
# 使用智谱替代 Claude
llm-link --app claude-code --provider zhipu --model glm-4-flash

# 使用阿里云替代 OpenAI
llm-link --app codex-cli --provider aliyun --model qwen-turbo
```

### 2. 速度优化

使用快速模型获得即时响应：

```bash
llm-link --app zed --provider zhipu --model glm-4-flash
```

### 3. 质量优化

使用能力更强的模型处理复杂任务：

```bash
llm-link --app claude-code --provider aliyun --model qwen-max
```

### 4. 本地开发

使用 Ollama 进行离线开发：

```bash
llm-link --app zed --provider ollama --model llama2
```

## 📊 提供商对比

| 提供商 | 速度 | 成本 | 中文支持 | 推荐模型 |
|--------|------|------|----------|----------|
| **智谱** | ⚡⚡⚡ | 💰 | ✅ 优秀 | glm-4-flash |
| **阿里云** | ⚡⚡⚡ | 💰 | ✅ 优秀 | qwen-max |
| **OpenAI** | ⚡⚡ | 💰💰💰 | ✅ 良好 | gpt-4 |
| **Anthropic** | ⚡⚡ | 💰💰 | ✅ 良好 | claude-3-5-sonnet |
| **火山引擎** | ⚡⚡⚡ | 💰 | ✅ 优秀 | doubao-pro-32k |
| **腾讯混元** | ⚡⚡⚡ | 💰 | ✅ 优秀 | hunyuan-lite |

## 🔧 高级配置

### 使用 API Key 认证

如果您的客户端需要认证：

```bash
llm-link --app zed --provider zhipu --model glm-4-flash --api-key "your-auth-token"
```

或设置环境变量：
```bash
export LLM_LINK_API_KEY="your-auth-token"
llm-link --app claude-code --provider zhipu --model glm-4-flash
```

### 自定义配置文件

创建 `config.yaml`：
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

然后运行：
```bash
llm-link --config config.yaml
```

## 🧪 测试连接

### 测试 Zed 集成

```bash
curl http://localhost:11434/api/tags
```

### 测试 Codex CLI 集成

```bash
curl -X POST http://localhost:8088/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "model": "gpt-4",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

## 🔍 故障排除

### 连接被拒绝

确保 LLM Link 正在运行：
```bash
# Zed
curl http://localhost:11434/health

# Codex CLI
curl http://localhost:8088/health
```

### API Key 错误

检查环境变量是否设置：
```bash
echo $ZHIPU_API_KEY
echo $OPENAI_API_KEY
echo $ALIYUN_API_KEY
```

### 模型未找到

使用正确的模型名称：
- 智谱：`glm-4-flash`, `glm-4-plus`, `glm-4`
- 阿里云：`qwen-max`, `qwen-plus`, `qwen-turbo`
- OpenAI：`gpt-4`, `gpt-3.5-turbo`
- Anthropic：`claude-3-5-sonnet-20241022`

### 响应为空

检查服务器日志：
```bash
llm-link --app zed --provider zhipu --model glm-4-flash --log-level debug
```

## 💡 使用技巧

1. **编码任务使用 glm-4-flash**：快速且经济
2. **复杂任务使用 qwen-max**：更好的推理能力
3. **设置环境变量**：比每次传递 API Key 更方便
4. **监控日志**：使用 `--log-level info` 查看运行状态
5. **先用 curl 测试**：在使用编码工具前验证设置

## 📚 相关文档

- [快速开始指南](QUICK_START.md)
- [模型市场](../api/PROVIDERS.md)
- [热重载 API](../api/HOT_RELOAD.md)
- [主 README](../../README.md)

---

**准备好在您喜欢的编码工具中使用任何 LLM 提供商了！** 🚀
