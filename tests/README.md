# LLM Link 测试脚本

本目录包含用于测试和调试 LLM Link 的各种脚本。

## 📋 测试脚本列表

### 🎯 Streaming Tool Calls 测试（最新）

#### `test_final_verification.sh`
**最终验证测试** - 验证 finish_reason 修复是否正常工作。

**用途：**
- 测试流式 tool_calls 完整流程
- 验证 finish_reason 自动修正
- 确认 Codex 能正确执行工具

**运行：**
```bash
./tests/test_final_verification.sh
```

**验证项：**
- ✅ Content present (用户能看到思考过程)
- ✅ Tool calls present (工具会被执行)
- ✅ finish_reason: 'tool_calls' (正确的结束原因)

#### `test_codex_simulation.sh`
模拟 Codex 的请求，测试工具调用。

**用途：**
- 模拟 Codex 发送的请求
- 验证 tool_calls 返回
- 检查 finish_reason

**运行：**
```bash
./tests/test_codex_simulation.sh
```

#### `test_streaming_tool_calls.sh`
测试流式模式下的 tool_calls。

**用途：**
- 验证流式 tool_calls 提取
- 检查 delta.tool_calls 字段

**运行：**
```bash
./tests/test_streaming_tool_calls.sh
```

#### `test_streaming_tool_messages.sh`
测试包含 tool messages 的流式请求。

**用途：**
- 测试多轮对话（包含 tool 结果）
- 验证 tool messages 处理

**运行：**
```bash
./tests/test_streaming_tool_messages.sh
```

#### `test_zhipu_streaming_direct.sh`
直接测试智谱 API 的流式 tool_calls。

**用途：**
- 验证智谱 API 原始行为
- 对比 llm-link 处理结果

**运行：**
```bash
./tests/test_zhipu_streaming_direct.sh
```

### XML 转换测试

#### `test_xml_conversion.sh`
基础 XML 转换功能测试。

**用途：**
- 运行单元测试
- 验证构建
- 显示测试命令和日志检查提示

**运行：**
```bash
./tests/test_xml_conversion.sh
```

#### `test_streaming_xml.sh`
测试流式响应中的 XML 转换。

**用途：**
- 发送流式请求
- 检查响应中是否有 XML
- 验证 XML 转换是否生效

**运行：**
```bash
./tests/test_streaming_xml.sh
```

**输出：**
- `/tmp/llm-link-stream.log` - 服务日志
- `/tmp/stream-response.txt` - 响应内容

#### `test_actual_response.sh`
测试实际的 API 响应。

**用途：**
- 启动服务
- 发送测试请求
- 检查响应格式
- 验证 XML 转换

**运行：**
```bash
./tests/test_actual_response.sh
```

**环境变量：**
- `ZHIPU_API_KEY` - 智谱 API Key
- `LLM_LINK_API_KEY` - LLM Link API Key

#### `test_content_field.sh`
测试 content 字段中的 XML 转换。

**用途：**
- 验证 XML 包裹 JSON 格式的转换
- 测试 content → function_call 的移动

**运行：**
```bash
./tests/test_content_field.sh
```

### Provider 隔离测试

#### `test_provider_isolation.sh`
测试 Provider 隔离功能。

**用途：**
- 验证 XML 转换只对 Zhipu provider 生效
- 确认其他 provider 不受影响

**运行：**
```bash
./tests/test_provider_isolation.sh
```

### 调试工具

#### `debug_xml_conversion.sh`
XML 转换调试指南。

**用途：**
- 提供调试步骤
- 显示常见问题和解决方案
- 列出需要检查的项目

**运行：**
```bash
./tests/debug_xml_conversion.sh
```

#### `check_actual_provider.sh`
检查实际使用的 Provider。

**用途：**
- 验证配置的 Provider
- 检查环境变量
- 分析 Provider 配置

**运行：**
```bash
./tests/check_actual_provider.sh
```

#### `verify_codex_endpoint.sh`
验证 Codex 使用的端点。

**用途：**
- 检查 Codex 调用的 API 端点
- 记录 HTTP 请求

**运行：**
```bash
./tests/verify_codex_endpoint.sh
```

#### `run_debug.sh`
启动服务并过滤 XML 相关日志。

**用途：**
- 启动服务（DEBUG 模式）
- 只显示 XML 相关日志

**运行：**
```bash
./tests/run_debug.sh
```

## 🚀 快速开始

### 1. 验证 Streaming Tool Calls（推荐）

```bash
# 最终验证测试（包含所有检查）
./tests/test_final_verification.sh

# 模拟 Codex 请求
./tests/test_codex_simulation.sh

# 测试流式 tool_calls
./tests/test_streaming_tool_calls.sh
```

### 2. 基础测试

```bash
# 运行单元测试
cargo test utils::xml --lib

# 运行集成测试
./tests/test_xml_conversion.sh
```

### 3. 调试 XML 转换问题

```bash
# 1. 查看调试指南
./tests/debug_xml_conversion.sh

# 2. 启动服务（DEBUG 模式）
./tests/run_debug.sh

# 3. 在另一个终端测试
./tests/test_streaming_xml.sh
```

### 4. 验证 Codex 集成

```bash
# 1. 验证端点
./tests/verify_codex_endpoint.sh

# 2. 测试实际响应
./tests/test_actual_response.sh
```

## 📝 环境变量

大多数测试脚本需要以下环境变量：

```bash
export ZHIPU_API_KEY="your-zhipu-api-key"
export LLM_LINK_API_KEY="your-llm-link-api-key"
```

或者在脚本中已经硬编码（仅用于测试）。

## 🔍 日志位置

测试脚本会生成以下日志文件：

- `/tmp/llm-link.log` - 服务日志
- `/tmp/llm-link-stream.log` - 流式响应日志
- `/tmp/stream-response.txt` - 流式响应内容
- `llm-link-debug.log` - DEBUG 日志（如果手动启动）

## 📊 测试覆盖

### Streaming Tool Calls
- ✅ finish_reason 自动修正
- ✅ 流式 tool_calls 提取
- ✅ Tool messages 处理
- ✅ Codex 集成验证

### 单元测试
- ✅ XML 检测
- ✅ XML 转换（纯 XML）
- ✅ XML 转换（XML 包裹 JSON）
- ✅ Content → Function Call 移动
- ✅ 递归转换

### 集成测试
- ✅ 流式响应
- ✅ 非流式响应
- ✅ Provider 隔离
- ✅ 客户端适配

## 🐛 常见问题

### 1. 测试脚本没有执行权限

```bash
chmod +x tests/*.sh
```

### 2. 服务启动失败

检查端口是否被占用：
```bash
lsof -i :8088
```

### 3. API Key 无效

确保设置了正确的环境变量：
```bash
echo $ZHIPU_API_KEY
echo $LLM_LINK_API_KEY
```

## 📚 相关文档

- [主 README](../README.md) - 完整的功能说明和架构文档
- [快速开始](../docs/QUICK_START.md) - 快速开始指南
- [版本历史](../CHANGELOG.md) - 更新和变更记录

## 🎯 贡献

添加新的测试脚本时，请：

1. 使用描述性的文件名（`test_*.sh` 或 `debug_*.sh`）
2. 添加脚本说明到本 README
3. 确保脚本有执行权限
4. 添加适当的错误处理
5. 输出清晰的测试结果

---

**最后更新**: 2025-10-18

