# 在 Zed 中使用 llm-link

llm-link 完全兼容 Zed IDE,支持工具调用(Function Calling)和所有主流 LLM provider。

## 快速开始

### 1. 编译 llm-link

```bash
cargo build --release
```

### 2. 启动服务

#### 使用智谱 GLM (推荐)

```bash
./target/release/llm-link \
  --app zed \
  --provider zhipu \
  --model glm-4.6 \
  --llm-api-key "$ZHIPU_API_KEY"
```

#### 使用 Volcengine Seed Code

```bash
./target/release/llm-link \
  --app zed \
  --provider volcengine \
  --model doubao-seed-code-preview-latest \
  --llm-api-key "$VOLCENGINE_API_KEY"

# 或使用脚本
bash scripts/start-zed-seed-code.sh "$VOLCENGINE_API_KEY"
```

#### 使用 OpenAI

```bash
./target/release/llm-link \
  --app zed \
  --provider openai \
  --model gpt-4o \
  --llm-api-key "$OPENAI_API_KEY"
```

### 3. 配置 Zed

编辑 `~/.config/zed/settings.json`:

```json
{
  "language_models": {
    "ollama": {
      "api_url": "http://localhost:11434"
    }
  }
}
```

### 4. 在 Zed 中使用

1. 重启 Zed (或重新打开 AI 助手面板)
2. 点击模型选择器
3. 选择你想使用的模型
4. 开始使用!

## 支持的功能

### ✅ 工具调用 (Function Calling)

所有主流模型都支持工具调用:

- **Volcengine**: Seed Code 系列
- **智谱**: GLM-4.6, GLM-4.5 系列
- **OpenAI**: GPT-4o, GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude 3.5, Claude 3 系列

在 Zed 中,工具调用用于:
- 代码补全
- 代码解释
- 重构建议
- 文档生成
- 文件操作
- 搜索功能

### ✅ 流式响应

所有模型都支持流式响应,实时显示生成的内容。

### ✅ 多模型切换

只需重启 llm-link 并指定不同的 provider,Zed 会自动显示新的模型列表。

## 可用模型

### Volcengine (火山引擎)

- `doubao-seed-code-preview-latest` - Seed Code 预览版 ⭐
- `doubao-seed-1.6` - Seed 1.6
- `doubao-seed-1.6-thinking` - Seed 1.6 思考版
- `doubao-seed-1.6-vision` - Seed 1.6 视觉版
- `doubao-seed-1.6-lite` - Seed 1.6 轻量版
- `doubao-seed-1.6-flash` - Seed 1.6 快速版

### 智谱 GLM

- `glm-4.6` - 最新旗舰,200K 上下文 ⭐
- `glm-4.5` - 强大推理,128K 上下文
- `glm-4.5-flash` - 免费模型,128K 上下文
- `glm-4.5-air` - 最佳性能
- `glm-4.5-airx` - 高性价比
- `glm-4.5-x` - 超快版本

### OpenAI

- `gpt-4o` - 最新多模态模型 ⭐
- `gpt-4o-mini` - 经济实惠的小模型
- `gpt-4-turbo` - GPT-4 Turbo
- `gpt-4` - 最强 GPT-4
- `gpt-3.5-turbo` - 快速高效

### Anthropic

- `claude-3-5-sonnet-20241022` - 最新 Claude 3.5 ⭐
- `claude-3-5-haiku-20241022` - 快速 Claude 3.5
- `claude-3-opus-20240229` - 最强 Claude 3
- `claude-3-sonnet-20240229` - 平衡 Claude 3
- `claude-3-haiku-20240307` - 快速 Claude 3

## 验证配置

### 检查模型列表

```bash
curl http://localhost:11434/api/tags | jq '.models[] | {name: .name, tags: .tags}'
```

### 检查工具支持

```bash
curl -X POST http://localhost:11434/api/show \
  -H "Content-Type: application/json" \
  -d '{"name": "glm-4.6"}' | jq '.capabilities'
```

应该返回 `["tools"]`。

### 运行完整测试

```bash
bash tests/test_zed_compatibility.sh
```

## 故障排除

### Zed 显示 "tools unsupported"

1. 确保使用最新版本的 llm-link
2. 重启 llm-link 服务
3. 重启 Zed
4. 检查 `/api/show` 响应是否包含 `capabilities: ["tools"]`

### Zed 看不到模型列表

1. 确保 llm-link 正在运行: `curl http://localhost:11434/api/tags`
2. 检查 Zed 配置中的 `api_url` 是否正确
3. 重启 Zed

### 切换 provider 后模型列表没变

1. 确保已经重启 llm-link 服务
2. 在 Zed 中重新打开 AI 助手面板
3. 或者重启 Zed

## 更多文档

- [Zed + 智谱配置指南](docs/guides/ZED_ZHIPU_SETUP.md)
- [Zed 切换 Provider 指南](docs/guides/ZED_SWITCH_PROVIDERS.md)
- [工具调用检测修复说明](docs/fixes/zed-tools-detection.md)
- [Ollama 工具调用支持修复](docs/fixes/ollama-tools-support.md)

