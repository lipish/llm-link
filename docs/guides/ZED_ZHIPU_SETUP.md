# Zed + 智谱 GLM 配置指南

本指南介绍如何在 Zed IDE 中使用智谱 GLM 模型(通过 llm-link)。

## 1. 启动 llm-link 服务

使用智谱作为后端启动 llm-link:

```bash
# 方式 1: 使用环境变量
export ZHIPU_API_KEY="your-api-key"
./target/release/llm-link --app zed --provider zhipu --model glm-4.6

# 方式 2: 直接传递 API key
./target/release/llm-link \
  --app zed \
  --provider zhipu \
  --model glm-4.6 \
  --llm-api-key "your-api-key"
```

服务启动后会监听 `http://localhost:11434` (Ollama 协议)。

## 2. 配置 Zed

编辑 Zed 配置文件 `~/.config/zed/settings.json`:

```json
{
  "language_models": {
    "ollama": {
      "api_url": "http://localhost:11434"
    }
  }
}
```

## 3. 在 Zed 中选择模型

重启 Zed 后,在 AI 助手面板中:

1. 点击模型选择器
2. 你会看到智谱的模型列表:
   - `glm-4.6` - 最新旗舰模型,200K 上下文,强大的编码能力 ⭐ 推荐
   - `glm-4.5` - 强大的推理和代码生成,128K 上下文
   - `glm-4.5-flash` - 免费模型,128K 上下文
   - `glm-4.5-air` - 同参数规模下最佳性能
   - `glm-4.5-airx` - 快速推理,性价比高
   - `glm-4.5-x` - 超快版本,128K 上下文

3. 选择你想使用的模型(推荐 `glm-4.6`)

## 4. 工具调用支持

智谱 GLM-4.6 和 GLM-4.5 支持工具调用(Function Calling)。在 Zed 中使用时:

- ✅ 代码补全
- ✅ 代码解释
- ✅ 重构建议
- ✅ 文档生成
- ✅ 工具调用(如文件操作、搜索等)

## 5. 验证配置

### 5.1 检查模型列表

```bash
curl http://localhost:11434/api/tags | jq '.models[] | .name'
```

应该看到:
```
"glm-4.6"
"glm-4.5"
"glm-4.5-x"
"glm-4.5-air"
"glm-4.5-airx"
"glm-4.5-flash"
```

### 5.2 测试工具调用

```bash
curl -X POST http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4.6",
    "messages": [{"role": "user", "content": "What is the weather in Beijing?"}],
    "stream": true,
    "tools": [{
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "Get the current weather",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {"type": "string", "description": "City name"}
          },
          "required": ["location"]
        }
      }
    }]
  }'
```

如果看到 `tool_calls` 字段,说明工具调用正常工作。

## 6. 常见问题

### Q: Zed 中看不到智谱模型?

**A:** 确保:
1. llm-link 使用 `--provider zhipu` 启动
2. Zed 配置中 `api_url` 指向 `http://localhost:11434`
3. 重启 Zed

### Q: 提示 "模型不存在"?

**A:** 检查:
1. 模型名称是否正确(如 `glm-4.6` 而不是 `glm-4-6`)
2. API key 是否有效
3. 查看 llm-link 日志确认错误信息

### Q: 工具调用不工作?

**A:** 
1. 确保使用 `glm-4.6` 或 `glm-4.5` (这些模型支持工具调用)
2. 检查 llm-link 版本是否包含工具调用支持
3. 查看日志中是否有 `tools_count` 信息

## 7. 性能优化

- **快速响应**: 使用 `glm-4.5-flash` 或 `glm-4.5-airx`
- **最佳质量**: 使用 `glm-4.6` 或 `glm-4.5`
- **成本优化**: 使用 `glm-4.5-flash` (免费)

## 8. 切换到其他 Provider

如果需要切换回 Volcengine 或其他 provider:

```bash
# Volcengine
./target/release/llm-link \
  --app zed \
  --provider volcengine \
  --model ep-your-endpoint-id \
  --llm-api-key "your-volcengine-key"

# OpenAI
./target/release/llm-link \
  --app zed \
  --provider openai \
  --model gpt-4o \
  --llm-api-key "your-openai-key"
```

Zed 会自动显示对应 provider 的模型列表。

