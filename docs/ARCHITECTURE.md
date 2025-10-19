# LLM Link Architecture

## 概述

LLM Link 是一个高性能的 LLM 代理服务，采用分层架构设计，支持多种 LLM 提供商和客户端协议。

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Codex CLI, Zed.dev, Claude Code, OpenAI SDK, etc.)        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Handler Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ OpenAI API   │  │  Ollama API  │  │ Anthropic API│      │
│  │  Handler     │  │   Handler    │  │   Handler    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Adapter Layer                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           ClientAdapter (Response Adaptation)        │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐│   │
│  │  │ Standard │ │  ZedDev  │ │  OpenAI  │ │  Zhipu  ││   │
│  │  │          │ │          │ │          │ │  Native ││   │
│  │  └──────────┘ └──────────┘ └──────────┘ └─────────┘│   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Utils (Utility Modules)                      │   │
│  │  • xml: XML Detection & Conversion                   │   │
│  │  • (Future: other utilities)                         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                     Service Layer                            │
│  • Message Format Conversion                                 │
│  • Response Transformation                                   │
│  • Model Management                                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                            │
│  • LLM Connector Wrapper                                     │
│  • Stream Management                                         │
│  • Error Handling                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   LLM Connector Library                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  OpenAI  │ │ Anthropic│ │  Zhipu   │ │  Aliyun  │      │
│  │ Provider │ │ Provider │ │ Provider │ │ Provider │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 核心模块

### 1. Handler Layer (`src/handlers/`)

负责处理不同协议的 HTTP 请求。

**模块：**
- `openai.rs` - OpenAI API 兼容接口
- `ollama.rs` - Ollama API 兼容接口
- `anthropic.rs` - Anthropic API 兼容接口
- `mod.rs` - 通用处理器和路由

**职责：**
- HTTP 请求解析
- 客户端类型检测
- 认证和授权
- 响应格式化

### 2. Adapter Layer (`src/adapters.rs`)

负责客户端特定的响应适配。

**ClientAdapter 类型：**
- `Standard` - 标准 Ollama 客户端
- `ZedDev` - Zed.dev 编辑器
- `OpenAI` - OpenAI API 客户端
- `ZhipuNative` - Zhipu 原生客户端

**职责：**
- 客户端检测（User-Agent, Headers）
- 响应格式适配
- XML 到 JSON 转换（按需）
- 特定字段添加（如 Zed.dev 的 `images` 字段）

### 3. Utils (`src/utils/`)

工具模块集合。

#### XML 模块 (`src/utils/xml.rs`)

负责 XML 格式检测和转换。

**核心功能：**
- `contains_xml_function_call()` - 检测 XML 格式
- `convert_xml_to_json_function_call()` - XML 转 JSON
- `transform_xml_in_json_response()` - 递归转换 JSON 中的 XML

**支持格式：**
1. 纯 XML 格式
2. XML 包裹 JSON 格式（Zhipu 实际使用）

**转换逻辑：**
```rust
// 检测
if xml::contains_xml_function_call(content) {
    // 转换
    let json = xml::convert_xml_to_json_function_call(content)?;
    // 应用
    *value = json;
}
```

### 4. Service Layer (`src/service.rs`)

业务逻辑层。

**职责：**
- 消息格式转换
- 模型列表管理
- 响应格式转换（Ollama/OpenAI）
- 流式响应处理

### 5. Client Layer (`src/client.rs`)

LLM 连接器封装层。

**职责：**
- 封装 llm-connector 库
- 统一的请求/响应接口
- 流式响应管理
- 错误处理

### 6. Configuration (`src/config.rs`)

配置管理。

**配置结构：**
```rust
Config {
    server: ServerConfig,
    llm_backend: LlmBackendConfig,
    apis: ApiConfigs,
    client_adapters: ClientAdapterConfigs {
        zed: ZedAdapterConfig,
        zhipu: ZhipuAdapterConfig,
        // ...
    }
}
```

### 7. Application Support (`src/apps.rs`)

应用特定配置生成。

**支持的应用：**
- Codex CLI
- Zed.dev
- Claude Code

**职责：**
- 生成应用特定配置
- 环境变量检查
- 应用信息提供

## 数据流

### 请求流程

```
1. Client Request
   ↓
2. Handler (openai/ollama/anthropic)
   ↓
3. Client Detection (detect_*_client)
   ↓
4. Service Layer (message conversion)
   ↓
5. Client Layer (llm-connector wrapper)
   ↓
6. LLM Provider
```

### 响应流程

```
1. LLM Provider Response
   ↓
2. Client Layer (stream processing)
   ↓
3. Service Layer (format conversion)
   ↓
4. Adapter Layer
   ├─ XML Detection
   ├─ XML to JSON Conversion (if needed)
   └─ Client-specific Adaptations
   ↓
5. Handler (HTTP response)
   ↓
6. Client
```

## 关键设计决策

### 1. 延迟转换策略

**问题：** Zhipu 返回 XML 格式的 function calls，但大多数客户端期望 JSON。

**解决方案：** 在 Adapter 层根据客户端类型决定是否转换。

**优势：**
- 零冗余转换
- 保留原始信息
- 支持 Zhipu 原生客户端

### 2. 客户端自动检测

**检测优先级：**
1. 强制适配器设置（`force_adapter`）
2. 显式客户端标识（`x-client` header）
3. User-Agent 自动检测
4. 默认适配器设置

**示例：**
```rust
// 1. 配置强制
force_adapter: "zhipu-native"

// 2. Header 指定
x-client: zhipu-native

// 3. User-Agent 检测
User-Agent: Zed/1.0.0  → ZedDev
User-Agent: Zhipu/1.0  → ZhipuNative
```

### 3. 应用优先设计

**传统方式：**
```bash
# 需要配置文件
llm-link --config config.yaml
```

**新方式：**
```bash
# 内置配置
llm-link --app codex-cli
```

**优势：**
- 零配置启动
- 应用优化设置
- 减少配置错误

## 扩展性

### 添加新的客户端适配器

1. 在 `ClientAdapter` 枚举中添加新类型
2. 实现 `preferred_format()` 方法
3. 实现 `apply_response_adaptations()` 逻辑
4. 更新客户端检测函数

### 添加新的 LLM 提供商

1. 在 `LlmBackendConfig` 中添加新变体
2. 在 `Client::from_config()` 中添加初始化逻辑
3. 更新模型配置文件

### 添加新的协议支持

1. 在 `src/handlers/` 中创建新的 handler
2. 在 `src/main.rs` 中添加路由
3. 实现请求/响应转换逻辑

## 性能考虑

### 1. 流式响应

所有 LLM 请求都支持流式响应，减少首字节时间。

### 2. 零拷贝

尽可能使用引用和借用，避免不必要的数据拷贝。

### 3. 异步处理

使用 Tokio 异步运行时，支持高并发。

### 4. 按需转换

XML 转换只在检测到 XML 且客户端需要 JSON 时执行。

## 测试策略

### 单元测试

- XML 工具函数测试
- 配置解析测试
- 消息转换测试

### 集成测试

- 端到端 API 测试
- 多客户端兼容性测试
- 流式响应测试

## 安全性

### 认证

- Bearer Token（OpenAI API）
- API Key（Anthropic API）
- 环境变量支持

### 输入验证

- 请求参数验证
- 消息格式验证
- 模型名称验证

## 监控和日志

### 日志级别

- `ERROR` - 错误信息
- `WARN` - 警告信息
- `INFO` - 关键操作
- `DEBUG` - 详细调试信息

### 健康检查

所有服务都提供 `/health` 端点用于监控。

## 未来改进

1. **缓存层** - 缓存常见请求
2. **负载均衡** - 支持多个后端
3. **速率限制** - 防止滥用
4. **指标收集** - Prometheus 集成
5. **配置热加载** - 无需重启更新配置

