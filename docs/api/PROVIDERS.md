# API: Providers and Models

## 📡 获取支持的 Providers 和 Models

llm-link 提供了 `/api/info` 端点来获取所有支持的 LLM providers 和它们的 models。

### API 端点

```bash
GET /api/info
```

### 示例请求

```bash
# 根据你的应用端口选择
curl http://localhost:11434/api/info  # Zed (默认)
curl http://localhost:8088/api/info   # Codex CLI
curl http://localhost:8089/api/info   # Claude Code
```

### 响应格式

```json
{
  "service": "llm-link",
  "version": "0.3.1",
  "current_provider": "zhipu",
  "current_model": "glm-4-flash",
  "supported_providers": [
    {
      "name": "openai",
      "models": [
        {
          "id": "gpt-4o",
          "name": "GPT-4o",
          "description": "GPT-4 Omni - Multimodal flagship model"
        },
        ...
      ]
    },
    ...
  ],
  "api_endpoints": {
    "ollama": {
      "path": "",
      "enabled": true,
      "auth_required": false
    }
  }
}
```

## 📋 支持的 Providers

llm-link 支持以下 9 个 LLM providers：

| Provider | Models Count | Description |
|----------|--------------|-------------|
| **openai** | 7 | OpenAI GPT models |
| **anthropic** | 5 | Anthropic Claude models |
| **zhipu** | 6 | Zhipu GLM models |
| **aliyun** | 8 | Aliyun Qwen models |
| **volcengine** | 6 | Volcengine Doubao models |
| **tencent** | 10 | Tencent Hunyuan models |
| **longcat** | 2 | LongCat models |
| **moonshot** | 3 | Moonshot Kimi models |
| **ollama** | Dynamic | Local Ollama models |

## 🔍 查询特定 Provider 的 Models

### 使用 jq 过滤

```bash
# 查看 Zhipu 的所有 models
curl -s http://localhost:11434/api/info | \
  jq '.supported_providers[] | select(.name == "zhipu")'

# 只显示 model IDs
curl -s http://localhost:11434/api/info | \
  jq -r '.supported_providers[] | select(.name == "zhipu") | .models[] | .id'

# 统计每个 provider 的 model 数量
curl -s http://localhost:11434/api/info | \
  jq -r '.supported_providers[] | "\(.name): \(.models | length) models"'
```

### 示例输出

```bash
# Zhipu models
glm-4.6
glm-4.5
glm-4.5-x
glm-4.5-air
glm-4.5-airx
glm-4.5-flash
```

## 📝 Models 配置文件

所有 models 的定义存储在 `src/models/models.yaml` 文件中。

### 配置文件结构

```yaml
openai:
  models:
    - id: "gpt-4o"
      name: "GPT-4o"
      description: "GPT-4 Omni - Multimodal flagship model"
    - id: "gpt-4"
      name: "GPT-4"
      description: "Most capable GPT-4 model"

zhipu:
  models:
    - id: "glm-4.6"
      name: "GLM-4.6"
      description: "Latest flagship model with 200K context"
    - id: "glm-4.5"
      name: "GLM-4.5"
      description: "Strong performance with powerful reasoning"
```

### 添加新的 Provider

要添加新的 provider，只需在 `models.yaml` 中添加新的条目：

```yaml
new_provider:
  models:
    - id: "model-id"
      name: "Model Name"
      description: "Model description"
```

**无需修改代码**！`ModelsConfig` 使用 `HashMap` 动态加载所有 providers。

## 🔧 技术实现

### 动态 Provider 支持

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ModelsConfig {
    #[serde(flatten)]
    pub providers: HashMap<String, ProviderModels>,
}
```

使用 `#[serde(flatten)]` 和 `HashMap`，配置系统可以：
- ✅ 支持任意数量的 providers
- ✅ 无需修改代码即可添加新 provider
- ✅ 自动从 `models.yaml` 加载所有配置
- ✅ 提供 fallback 到默认配置

### 加载流程

1. 尝试从嵌入的 `models.yaml` 加载配置
2. 如果失败，使用硬编码的默认配置
3. 通过 `/api/info` 端点暴露所有 providers 和 models

## 📚 相关文档

- [Model Marketplace](./MODEL_MARKETPLACE.md) - 各 provider 的官方文档链接
- [Quick Start](./QUICK_START.md) - 快速开始指南
- [Configuration](../README.md#configuration) - 配置说明

## 🎯 使用场景

这个 API 可以用于：

1. **动态 UI 生成** - 根据可用 models 生成选择界面
2. **服务发现** - 发现 llm-link 支持的所有 providers
3. **模型验证** - 验证用户选择的 model 是否可用
4. **文档生成** - 自动生成支持的 models 列表
5. **监控和调试** - 查看当前配置和可用资源

