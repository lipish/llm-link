# 无需 API Key 启动服务

## 🎯 功能说明

从 v0.3.2 开始，llm-link 支持在没有 API key 的情况下启动服务，然后通过热重载 API 动态设置 API key。

## ✨ 使用场景

1. **容器化部署** - 先启动服务，再通过配置管理系统注入 API key
2. **开发测试** - 快速启动服务进行测试，无需预先配置所有 API keys
3. **动态配置** - 在运行时根据需要切换不同的 providers 和 API keys
4. **安全性** - 避免在启动脚本或环境变量中硬编码 API keys

## 🚀 启动方式

### 方式 1: 无 API Key 启动（推荐）

```bash
# 直接启动，无需设置 API key
./llm-link --app zed --provider zhipu

# 服务会显示警告但正常启动
# ⚠️  Starting without API key for provider 'zhipu'
# ⚠️  Set ZHIPU_API_KEY environment variable or use --llm-api-key
# ⚠️  Or update API key dynamically via: POST /api/config/update-key
# ⚠️  LLM requests will fail until API key is configured
```

### 方式 2: 启动后动态设置 API Key

```bash
# 1. 启动服务（无 API key）
./llm-link --app zed --provider zhipu

# 2. 通过 API 设置 API key
curl -X POST http://localhost:11434/api/config/update-key \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "zhipu",
    "api_key": "your-actual-api-key-here"
  }'

# 3. 现在可以正常使用 LLM 服务了
```

### 方式 3: 传统方式（环境变量）

```bash
# 设置环境变量后启动
export ZHIPU_API_KEY="your-api-key"
./llm-link --app zed --provider zhipu
```

### 方式 4: 命令行参数

```bash
# 通过命令行参数传递 API key
./llm-link --app zed --provider zhipu --llm-api-key "your-api-key"
```

## 📡 热重载 API

### 更新 API Key

```bash
POST /api/config/update-key
Content-Type: application/json

{
  "provider": "zhipu",
  "api_key": "your-new-api-key"
}
```

**响应：**
```json
{
  "status": "success",
  "message": "API key updated successfully",
  "provider": "zhipu",
  "restart_required": false
}
```

### 切换 Provider

```bash
POST /api/config/switch-provider
Content-Type: application/json

{
  "provider": "openai",
  "model": "gpt-4",
  "api_key": "your-openai-api-key"  // 可选，如果已设置可省略
}
```

## ⚠️ 注意事项

### 1. LLM 请求会失败

在设置 API key 之前，所有 LLM 请求都会失败：

```bash
# 没有 API key 时的错误
curl http://localhost:11434/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "glm-4-flash", "messages": [{"role": "user", "content": "Hello"}]}'

# 返回错误（因为没有有效的 API key）
```

### 2. Ollama Provider 例外

Ollama provider 不需要 API key，可以直接使用：

```bash
# Ollama 无需 API key
./llm-link --app zed --provider ollama
```

### 3. 支持的 Providers

以下 providers 支持无 API key 启动：

- ✅ **openai** - 可无 key 启动，需后续设置
- ✅ **anthropic** - 可无 key 启动，需后续设置
- ✅ **zhipu** - 可无 key 启动，需后续设置
- ✅ **aliyun** - 可无 key 启动，需后续设置
- ✅ **volcengine** - 可无 key 启动，需后续设置
- ✅ **tencent** - 可无 key 启动，需后续设置
- ✅ **longcat** - 可无 key 启动，需后续设置
- ✅ **moonshot** - 可无 key 启动，需后续设置
- ✅ **ollama** - 无需 API key

## 🔒 安全最佳实践

### 1. 使用环境变量（生产环境）

```bash
# 从安全存储加载 API keys
export ZHIPU_API_KEY=$(vault read -field=api_key secret/zhipu)
./llm-link --app zed --provider zhipu
```

### 2. 使用配置文件

```bash
# 从加密配置文件读取
export ZHIPU_API_KEY=$(cat /secure/config/zhipu.key)
./llm-link --app zed --provider zhipu
```

### 3. 使用热重载 API（开发环境）

```bash
# 开发时快速切换
./llm-link --app zed --provider zhipu  # 无 key 启动

# 需要时再设置
curl -X POST http://localhost:11434/api/config/update-key \
  -H "Content-Type: application/json" \
  -d '{"provider": "zhipu", "api_key": "dev-key"}'
```

## 📊 启动流程

```
1. 启动 llm-link（无 API key）
   ↓
2. 服务正常启动，显示警告
   ⚠️  Starting without API key
   ⚠️  LLM requests will fail until configured
   ↓
3. 服务监听端口，等待请求
   ✅ Listening on 0.0.0.0:11434
   ↓
4. 通过 API 设置 API key
   POST /api/config/update-key
   ↓
5. 服务立即可用，无需重启
   ✅ API key updated successfully
```

## 🎯 使用示例

### 示例 1: Docker 容器

```dockerfile
# Dockerfile
FROM rust:latest
COPY target/release/llm-link /usr/local/bin/
CMD ["llm-link", "--app", "zed", "--provider", "zhipu"]
```

```bash
# 启动容器（无 API key）
docker run -d -p 11434:11434 llm-link

# 容器启动后设置 API key
curl -X POST http://localhost:11434/api/config/update-key \
  -H "Content-Type: application/json" \
  -d '{"provider": "zhipu", "api_key": "'$ZHIPU_API_KEY'"}'
```

### 示例 2: Kubernetes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: llm-link
spec:
  containers:
  - name: llm-link
    image: llm-link:latest
    command: ["llm-link", "--app", "zed", "--provider", "zhipu"]
    ports:
    - containerPort: 11434
```

```bash
# Pod 启动后通过 ConfigMap 或 Secret 注入 API key
kubectl exec llm-link -- curl -X POST http://localhost:11434/api/config/update-key \
  -H "Content-Type: application/json" \
  -d '{"provider": "zhipu", "api_key": "xxx"}'
```

### 示例 3: 多 Provider 切换

```bash
# 1. 启动服务（无 key）
./llm-link --app zed --provider zhipu

# 2. 设置 Zhipu API key
curl -X POST http://localhost:11434/api/config/update-key \
  -d '{"provider": "zhipu", "api_key": "zhipu-key"}'

# 3. 使用 Zhipu
# ... 进行一些操作 ...

# 4. 切换到 OpenAI
curl -X POST http://localhost:11434/api/config/switch-provider \
  -d '{"provider": "openai", "model": "gpt-4", "api_key": "openai-key"}'

# 5. 现在使用 OpenAI
# ... 无需重启服务 ...
```

## 📚 相关文档

- [Hot-Reload API](HOT_RELOAD_API.md) - 热重载 API 完整文档
- [Configuration Update API](CONFIG_UPDATE_API.md) - 配置更新 API 参考
- [Quick Start](QUICK_START.md) - 快速开始指南

## 🔗 API 端点

- `POST /api/config/update-key` - 更新 API key
- `POST /api/config/switch-provider` - 切换 provider
- `GET /api/config/current` - 查看当前配置
- `GET /api/info` - 查看服务信息

---

**版本**: v0.3.2+  
**最后更新**: 2025-10-30

