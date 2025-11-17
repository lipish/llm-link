# Zed 中切换不同的 LLM Provider

本指南介绍如何在 Zed IDE 中快速切换不同的 LLM provider。

## 概述

llm-link 支持多个 LLM provider,每个 provider 都有自己的模型列表。当你切换 provider 时,Zed 会自动显示对应的模型列表。

## 支持的 Providers

- **Volcengine (火山引擎)** - Doubao Seed Code 等模型
- **Zhipu (智谱)** - GLM-4.6, GLM-4.5 等模型
- **OpenAI** - GPT-4o, GPT-4 等模型
- **Anthropic** - Claude 3.5 Sonnet 等模型
- **MiniMax** - MiniMax-M2 等模型

## 切换方法

### 方法 1: 使用脚本启动 (推荐)

#### 切换到 Volcengine

```bash
# 停止当前服务 (Ctrl+C)

# 启动 Volcengine
bash scripts/start-zed-seed-code.sh "$VOLCENGINE_API_KEY"
```

#### 切换到智谱 GLM

```bash
# 停止当前服务 (Ctrl+C)

# 启动智谱
./target/release/llm-link \
  --app zed \
  --provider zhipu \
  --model glm-4.6 \
  --llm-api-key "$ZHIPU_API_KEY"
```

### 方法 2: 直接使用命令行

#### Volcengine

```bash
./target/release/llm-link \
  --app zed \
  --provider volcengine \
  --model doubao-seed-code-preview-latest \
  --llm-api-key "$VOLCENGINE_API_KEY"
```

#### 智谱 GLM

```bash
./target/release/llm-link \
  --app zed \
  --provider zhipu \
  --model glm-4.6 \
  --llm-api-key "$ZHIPU_API_KEY"
```

#### OpenAI

```bash
./target/release/llm-link \
  --app zed \
  --provider openai \
  --model gpt-4o \
  --llm-api-key "$OPENAI_API_KEY"
```

#### Anthropic

```bash
./target/release/llm-link \
  --app zed \
  --provider anthropic \
  --model claude-3-5-sonnet-20241022 \
  --llm-api-key "$ANTHROPIC_API_KEY"
```

## Zed 配置

Zed 的配置保持不变,只需要指向 llm-link 的地址:

`~/.config/zed/settings.json`:
```json
{
  "language_models": {
    "ollama": {
      "api_url": "http://localhost:11434"
    }
  }
}
```

## 切换后的操作

1. **重启 Zed** (可选,但推荐)
2. **打开 AI 助手面板**
3. **点击模型选择器** - 你会看到新 provider 的模型列表
4. **选择你想使用的模型**

## 各 Provider 的模型列表

### Volcengine

- `doubao-seed-code-preview-latest` - Seed Code 预览版
- `doubao-seed-1.6` - Seed 1.6
- `doubao-seed-1.6-thinking` - Seed 1.6 思考版

### 智谱 GLM

- `glm-4.6` - 最新旗舰,200K 上下文 ⭐
- `glm-4.5` - 强大推理,128K 上下文
- `glm-4.5-flash` - 免费模型
- `glm-4.5-air` - 最佳性能
- `glm-4.5-airx` - 高性价比

### OpenAI

- `gpt-4o` - 最新多模态模型 ⭐
- `gpt-4-turbo` - GPT-4 Turbo
- `gpt-4` - GPT-4
- `gpt-3.5-turbo` - GPT-3.5

### Anthropic

- `claude-3-5-sonnet-20241022` - 最新 Claude 3.5 ⭐
- `claude-3-opus-20240229` - Claude 3 Opus
- `claude-3-sonnet-20240229` - Claude 3 Sonnet

## 工具调用支持

以下 provider 和模型支持工具调用 (Function Calling):

- ✅ **Volcengine**: Seed Code 系列
- ✅ **智谱**: GLM-4.6, GLM-4.5
- ✅ **OpenAI**: GPT-4o, GPT-4, GPT-3.5-turbo
- ✅ **Anthropic**: Claude 3.5, Claude 3

## 验证切换是否成功

### 检查模型列表

```bash
curl http://localhost:11434/api/tags | jq '.models[] | .name'
```

### 测试工具调用

```bash
# Volcengine
bash tests/test_volcengine_tools.sh

# 智谱
bash tests/test_ollama_tools.sh
```

## 常见问题

### Q: 切换 provider 后 Zed 还显示旧的模型列表?

**A:** 重启 Zed,或者在 Zed 中重新打开 AI 助手面板。

### Q: 如何同时使用多个 provider?

**A:** 目前 llm-link 一次只能启动一个 provider。如果需要同时使用多个,可以:
1. 在不同端口启动多个 llm-link 实例
2. 在 Zed 中配置多个 Ollama 服务器

### Q: 切换 provider 需要修改 Zed 配置吗?

**A:** 不需要!只要 llm-link 监听的地址不变 (默认 `http://localhost:11434`),Zed 配置就不需要修改。

## 性能对比

| Provider | 速度 | 质量 | 成本 | 工具调用 |
|----------|------|------|------|----------|
| Volcengine Seed Code | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ |
| 智谱 GLM-4.6 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ✅ |
| OpenAI GPT-4o | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ✅ |
| Anthropic Claude 3.5 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ | ✅ |

## 推荐配置

- **日常编码**: Volcengine Seed Code 或智谱 GLM-4.5-flash (免费)
- **复杂任务**: 智谱 GLM-4.6 或 OpenAI GPT-4o
- **最佳质量**: Anthropic Claude 3.5 Sonnet
- **成本优化**: 智谱 GLM-4.5-flash (免费)

