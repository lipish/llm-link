# GLM-4 + Zed 集成脚本

这些脚本帮助你快速启动 llm-link 服务，使用智谱 AI 的 GLM-4 模型为 Zed 编辑器提供 AI 代码助手功能。

## 🚀 快速开始

### 1. 获取 API 密钥
- 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
- 注册账号并获取 API 密钥

### 2. 选择启动方式

#### 方式一：快速启动（推荐）
```bash
# 使用默认配置（GLM-4.6 模型，端口 11434）
./scripts/zed-glm4-quick.sh "your-zhipu-api-key"

# 使用快速模型
./scripts/zed-glm4-quick.sh "your-zhipu-api-key" glm-4.5-flash

# 自定义端口
./scripts/zed-glm4-quick.sh "your-zhipu-api-key" glm-4.6 18000
```

#### 方式二：完整配置
```bash
# 基本启动
./scripts/start-zed-glm4.sh "your-zhipu-api-key"

# 启用调试日志
RUST_LOG=debug ./scripts/start-zed-glm4.sh "your-zhipu-api-key"

# 使用不同模型
MODEL=glm-4.5-flash ./scripts/start-zed-glm4.sh "your-zhipu-api-key"
```

### 3. 测试模型可用性
```bash
# 测试所有 GLM-4 模型
./scripts/test-glm4-models.sh "your-zhipu-api-key"
```

## 📋 可用模型

| 模型名称 | 特点 | 适用场景 |
|---------|------|----------|
| `glm-4.6` | 最新旗舰，200K上下文，推荐 ⭐ | 复杂代码任务、代码生成 |
| `glm-4.5` | 强大推理，128K上下文 | 高质量代码分析 |
| `glm-4.5-flash` | 快速响应 | 简单对话、快速查询 |
| `glm-4.5-air` | 平衡性能与速度 | 日常编程辅助 |
| `glm-4.5-airx` | 扩展推理能力 | 复杂逻辑分析 |
| `glm-4.5-x` | 超快版本 | 实时代码补全 |

## ⚙️ Zed 配置

服务启动后，在 Zed 中配置：

1. 打开 Zed 设置 (`Cmd/Ctrl + ,`)
2. 找到 "Language Models" 或 "AI Assistant" 设置
3. 配置：
   - **服务器地址**: `http://localhost:11434`
   - **模型名称**: `glm-4.6` (或你选择的模型)
   - **API 类型**: Ollama

## 🔧 环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `LLM_LINK_BIN` | `./target/release/llm-link` | llm-link 二进制文件路径 |
| `MODEL` | `glm-4.6` | 默认使用的模型 |
| `RUST_LOG` | `info` | 日志级别 (`debug`, `info`, `warn`, `error`) |

## 🐛 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口占用
   lsof -i :11434
   
   # 使用其他端口
   ./scripts/zed-glm4-quick.sh "your-api-key" glm-4.6 18000
   ```

2. **API 密钥错误**
   - 确保 API 密钥正确
   - 检查智谱 AI 账户余额
   - 验证 API 密钥权限

3. **模型不可用**
   ```bash
   # 测试模型可用性
   ./scripts/test-glm4-models.sh "your-api-key"
   ```

4. **连接问题**
   ```bash
   # 启用调试日志
   RUST_LOG=debug ./scripts/zed-glm4-quick.sh "your-api-key"
   ```

### 日志查看

```bash
# 实时查看日志
RUST_LOG=debug ./scripts/zed-glm4-quick.sh "your-api-key" 2>&1 | tee llm-link.log

# 查看错误日志
grep -i error llm-link.log
```

## 💡 性能优化建议

1. **模型选择**：
   - 代码生成：使用 `glm-4.6`
   - 快速响应：使用 `glm-4.5-flash`
   - 平衡使用：使用 `glm-4.5-air`

2. **网络优化**：
   - 确保网络连接稳定
   - 考虑使用代理（如果需要）

3. **资源监控**：
   ```bash
   # 监控服务状态
   ps aux | grep llm-link
   
   # 检查端口状态
   netstat -tlnp | grep 11434
   ```

## 🔗 相关链接

- [智谱 AI 开放平台](https://open.bigmodel.cn/)
- [GLM-4 模型文档](https://open.bigmodel.cn/dev/api#glm-4)
- [Zed 编辑器](https://zed.dev/)
- [llm-link 项目](https://github.com/lipish/llm-link)
