# Zed 工具调用检测修复

## 问题描述

在 Zed 中使用 llm-link (Ollama 协议) 时,即使模型支持工具调用,Zed 仍然显示 "tools unsupported"。

## 根本原因

通过查看 Zed 源代码 (`/Users/mac-m4/github/zed/crates/ollama/src/ollama.rs`),发现 Zed 通过以下两种方式检测模型是否支持工具调用:

1. **`/api/tags` 端点**: 检查模型的 `tags` 数组是否包含 `"tools"`
2. **`/api/show` 端点**: 检查模型的 `capabilities` 数组是否包含 `"tools"`

Zed 的关键代码:
```rust
// 从 /api/show 响应中获取 capabilities
pub fn supports_tools(&self) -> bool {
    self.capabilities
        .as_ref()
        .is_some_and(|capabilities| capabilities.contains(&"tools".into()))
}
```

llm-link 之前的实现中:
- `/api/tags` 响应没有包含 `tags` 字段
- `/api/show` 响应没有包含 `capabilities` 字段

导致 Zed 无法识别模型的工具调用能力。

## 解决方案

### 1. 在模型配置中添加 `supports_tools` 字段

更新 `src/models/models.yaml`,为每个模型添加 `supports_tools` 标记:

```yaml
zhipu:
  models:
    - id: "glm-4.6"
      name: "GLM-4.6"
      description: "Latest flagship model with 200K context, advanced coding ability"
      supports_tools: true  # 新增
```

### 2. 更新 ModelInfo 结构体

在 `src/models/mod.rs` 中添加 `supports_tools` 字段:

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelInfo {
    pub id: String,
    pub name: String,
    pub description: String,
    #[serde(default)]
    pub supports_tools: bool,  // 新增
}
```

### 3. 在 `/api/tags` 响应中包含 `tags` 字段

更新 `src/api/ollama.rs`,在模型信息中添加 `tags` 数组:

```rust
// Build model tags - include "tools" if model supports it
let mut tags = Vec::new();
if m.supports_tools {
    tags.push("tools");
}

serde_json::json!({
    "name": m.id,
    "model": m.id,
    // ... other fields ...
    "tags": tags  // 新增
})
```

### 4. 在 `/api/show` 响应中包含 `capabilities` 字段

更新 `src/api/ollama.rs` 的 `show_handler` 函数:

```rust
// Find the model and check if it supports tools
let mut capabilities = Vec::new();
if let Some(model_info) = provider_models.iter().find(|m| m.id == model_name) {
    if model_info.supports_tools {
        capabilities.push("tools");
    }
}

// Return model details in Ollama format
let response = json!({
    // ... other fields ...
    "capabilities": capabilities,  // 新增
    "details": { /* ... */ }
});
```

## 验证

### 1. 检查 `/api/tags` 响应

```bash
curl http://localhost:11434/api/tags | jq '.models[] | {name: .name, tags: .tags}'
```

成功响应示例:

```json
{
  "name": "glm-4.6",
  "tags": ["tools"]
}
```

### 2. 检查 `/api/show` 响应

```bash
curl -X POST http://localhost:11434/api/show \
  -H "Content-Type: application/json" \
  -d '{"name": "glm-4.6"}' | jq '{capabilities, details}'
```

成功响应示例:

```json
{
  "capabilities": ["tools"],
  "details": {
    "family": "glm",
    "families": ["glm"],
    "format": "gguf",
    "parameter_size": "7B",
    "parent_model": "",
    "quantization_level": "Q4_K_M"
  }
}
```

### 3. 运行完整测试

```bash
bash tests/test_zed_compatibility.sh
```

### 在 Zed 中验证

1. 启动 llm-link:
   ```bash
   ./target/release/llm-link \
     --app zed \
     --provider zhipu \
     --model glm-4.6 \
     --llm-api-key "$ZHIPU_API_KEY"
   ```

2. 在 Zed 中打开 AI 助手面板
3. 选择模型 - 应该不再显示 "tools unsupported"
4. 工具调用功能应该正常工作

## 支持工具调用的模型

### Volcengine
- ✅ doubao-seed-1.6
- ✅ doubao-seed-code-preview-latest
- ✅ doubao-seed-1.6-vision
- ✅ doubao-seed-1.6-lite
- ✅ doubao-seed-1.6-flash
- ✅ doubao-seed-1.6-thinking
- ❌ doubao-seed-translation (不支持)

### 智谱 GLM
- ✅ glm-4.6
- ✅ glm-4.5
- ✅ glm-4.5-x
- ✅ glm-4.5-air
- ✅ glm-4.5-airx
- ✅ glm-4.5-flash

### OpenAI
- ✅ gpt-4o
- ✅ gpt-4o-mini
- ✅ gpt-4-turbo
- ✅ gpt-4
- ✅ gpt-3.5-turbo
- ❌ o1-preview (不支持)
- ❌ o1-mini (不支持)

### Anthropic
- ✅ claude-3-5-sonnet-20241022
- ✅ claude-3-5-haiku-20241022
- ✅ claude-3-opus-20240229
- ✅ claude-3-sonnet-20240229
- ✅ claude-3-haiku-20240307

## 相关文件

- `src/models/models.yaml` - 模型配置
- `src/models/mod.rs` - ModelInfo 结构体
- `src/api/ollama.rs` - Ollama API 实现
- `docs/guides/ZED_ZHIPU_SETUP.md` - Zed + 智谱配置指南
- `docs/guides/ZED_SWITCH_PROVIDERS.md` - Zed 切换 Provider 指南

## 参考

- [Zed LLM Providers Documentation](https://zed.dev/docs/ai/llm-providers)
- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)

