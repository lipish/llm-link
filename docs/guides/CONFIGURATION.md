# 配置指南

本指南介绍 LLM Link 的各种配置方式，包括基本配置、高级配置和动态配置。

## 🎯 配置概览

LLM Link 支持多种配置方式：

1. **命令行参数** - 快速配置，适合临时使用
2. **环境变量** - 系统级配置，适合部署
3. **配置文件** - 持久化配置，适合生产环境
4. **热重载 API** - 动态配置，无需重启

## 🚀 基本配置

### 命令行参数

最简单的启动方式：

```bash
# 基本用法
./llm-link --app <应用> --provider <提供商> --model <模型>

# 示例
./llm-link --app zed --provider zhipu --model glm-4-flash
```

### 环境变量

设置 API Keys：

```bash
# 智谱 AI
export ZHIPU_API_KEY="your-zhipu-api-key"

# 阿里云
export ALIYUN_API_KEY="your-aliyun-api-key"

# OpenAI
export OPENAI_API_KEY="sk-your-openai-api-key"

# Anthropic
export ANTHROPIC_API_KEY="sk-ant-your-anthropic-api-key"

# 火山引擎
export VOLCENGINE_API_KEY="your-volcengine-api-key"

# 腾讯混元
export TENCENT_API_KEY="your-tencent-api-key"
```

## 📝 配置文件

### YAML 配置文件

创建 `config.yaml`：

```yaml
# 服务器配置
server:
  host: "0.0.0.0"
  port: 8088

# LLM 后端配置
llm_backend:
  provider: "zhipu"
  api_key: "your-api-key"
  model: "glm-4-flash"
  base_url: null  # 可选，自定义 API 端点

# API 配置
apis:
  openai:
    enabled: true
    path: ""
    api_key: "optional-auth-token"
  
  ollama:
    enabled: true
    path: ""
    api_key: null
  
  anthropic:
    enabled: true
    path: ""
    api_key: "optional-auth-token"

# 日志配置
logging:
  level: "info"
  file: null  # 可选，日志文件路径
```

使用配置文件启动：

```bash
./llm-link --config config.yaml
```

### TOML 配置文件

创建 `config.toml`：

```toml
[server]
host = "0.0.0.0"
port = 8088

[llm_backend]
provider = "zhipu"
api_key = "your-api-key"
model = "glm-4-flash"

[apis.openai]
enabled = true
path = ""
api_key = "optional-auth-token"

[apis.ollama]
enabled = true
path = ""

[apis.anthropic]
enabled = true
path = ""
api_key = "optional-auth-token"

[logging]
level = "info"
```

## 🔥 无 API Key 启动

从 v0.3.2 开始，支持在没有 API key 的情况下启动服务。

### 使用场景

1. **容器化部署** - 先启动服务，再通过配置管理系统注入 API key
2. **开发测试** - 快速启动服务进行测试
3. **动态配置** - 运行时切换不同的 providers 和 API keys
4. **安全性** - 避免在启动脚本中硬编码 API keys

### 启动方式

```bash
# 无 API Key 启动
./llm-link --app zed --provider zhipu

# 输出示例：
# ⚠️  Warning: No API key provided for provider 'zhipu'
# 🚀 Starting in zed mode
# 🔄 Overriding LLM provider to: zhipu
# 🔄 Using model: glm-4-flash
# 🌐 Server will bind to 0.0.0.0:11434
# 🦙 Ollama API enabled on path: 
# 🔓 Ollama API key authentication: DISABLED
# ⚠️  LLM backend will be available but may fail without valid API key
# 🎉 LLM Link proxy is listening on 0.0.0.0:11434
```

### 启动后设置 API Key

使用热重载 API 动态设置：

```bash
# 设置智谱 API Key
curl -X POST http://localhost:8088/api/config/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-auth-token" \
  -d '{
    "provider": "zhipu",
    "api_key": "your-actual-zhipu-api-key",
    "model": "glm-4-flash"
  }'
```

## 🔧 高级配置

### 多端口配置

同时启用多个 API：

```yaml
server:
  host: "0.0.0.0"
  port: 8088  # 主端口

apis:
  openai:
    enabled: true
    path: ""
    api_key: "token1"
  
  ollama:
    enabled: true
    path: ""
    api_key: null
  
  anthropic:
    enabled: true
    path: ""
    api_key: "token2"
```

### 自定义端点

为提供商设置自定义 API 端点：

```yaml
llm_backend:
  provider: "openai"
  api_key: "sk-your-key"
  base_url: "https://your-custom-endpoint.com/v1"
  model: "gpt-4"
```

### 代理配置

通过代理访问 LLM 提供商：

```yaml
llm_backend:
  provider: "openai"
  api_key: "sk-your-key"
  base_url: "https://api.openai.com/v1"
  model: "gpt-4"

# 设置系统代理
# export HTTP_PROXY=http://proxy.company.com:8080
# export HTTPS_PROXY=http://proxy.company.com:8080
```

## 📊 应用特定配置

### Zed IDE 配置

```bash
# 启动 Zed 模式
./llm-link --app zed --provider zhipu --model glm-4-flash

# 或使用配置文件
cat > zed-config.yaml << EOF
server:
  host: "0.0.0.0"
  port: 11434

llm_backend:
  provider: "zhipu"
  api_key: "your-zhipu-key"
  model: "glm-4-flash"

apis:
  ollama:
    enabled: true
    path: ""
    api_key: null
EOF

./llm-link --config zed-config.yaml
```

### Codex CLI 配置

```bash
# 启动 Codex CLI 模式
./llm-link --app codex-cli --provider openai --model gpt-4

# 或使用配置文件
cat > codex-config.yaml << EOF
server:
  host: "0.0.0.0"
  port: 8088

llm_backend:
  provider: "openai"
  api_key: "sk-your-openai-key"
  model: "gpt-4"

apis:
  openai:
    enabled: true
    path: ""
    api_key: "your-auth-token"
EOF

./llm-link --config codex-config.yaml
```

## 🔄 动态配置

### 热重载 API

无需重启即可更新配置：

```bash
# 更新 API Key
curl -X POST http://localhost:8088/api/config/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "provider": "zhipu",
    "api_key": "new-api-key",
    "model": "glm-4-plus"
  }'

# 切换提供商
curl -X POST http://localhost:8088/api/config/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "provider": "aliyun",
    "api_key": "sk-aliyun-key",
    "model": "qwen-max"
  }'
```

### 配置验证

验证 API Key 是否有效：

```bash
curl -X POST http://localhost:8088/api/config/validate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "provider": "zhipu",
    "api_key": "your-api-key",
    "model": "glm-4-flash"
  }'
```

## 🛡️ 安全配置

### API Key 认证

为 LLM Link 本身设置认证：

```bash
# 设置认证 Token
export LLM_LINK_API_KEY="your-secure-token"

# 或在命令行中指定
./llm-link --app zed --provider zhipu --api-key "your-secure-token"
```

### 环境变量安全

避免在命令行中暴露 API Keys：

```bash
# ❌ 不安全
./llm-link --provider zhipu --api-key "sk-exposed-key"

# ✅ 安全
export ZHIPU_API_KEY="sk-secure-key"
./llm-link --provider zhipu
```

### 配置文件权限

保护配置文件：

```bash
# 设置文件权限
chmod 600 config.yaml

# 确保只有当前用户可读
ls -la config.yaml
# -rw------- 1 user user 1234 Dec 1 10:00 config.yaml
```

## 🔍 故障排除

### 配置验证

检查当前配置：

```bash
# 查看健康状态
curl http://localhost:8088/health

# 查看当前配置
curl http://localhost:8088/api/config/current
```

### 常见问题

#### API Key 未生效

```bash
# 检查环境变量
echo $ZHIPU_API_KEY

# 检查配置文件
cat config.yaml | grep api_key

# 使用调试模式启动
./llm-link --app zed --provider zhipu --log-level debug
```

#### 端口冲突

```bash
# 检查端口占用
lsof -i :8088
lsof -i :11434

# 使用自定义端口
./llm-link --app zed --provider zhipu --port 9999
```

#### 连接超时

```bash
# 设置代理
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080

# 或使用自定义端点
./llm-link --provider openai --base-url "https://api.openai.com"
```

## 💡 最佳实践

1. **使用配置文件** - 生产环境推荐使用 YAML 配置文件
2. **环境变量管理** - 使用 `.env` 文件管理 API Keys
3. **权限控制** - 为配置文件设置适当的文件权限
4. **热重载** - 使用热重载 API 避免服务中断
5. **日志监控** - 启用详细日志便于问题排查
6. **配置验证** - 定期验证 API Keys 的有效性

## 📚 相关文档

- [快速开始指南](QUICK_START.md)
- [应用集成指南](INTEGRATION.md)
- [热重载 API](../api/HOT_RELOAD.md)
- [提供商支持](../api/PROVIDERS.md)
- [主 README](../../README.md)

---

**掌握 LLM Link 的配置，享受灵活的 AI 服务！** 🚀
