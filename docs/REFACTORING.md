# 重构记录

## 2025-10-19: 模块重命名和架构优化

### 背景

原有的模块命名存在歧义：
- `client/` - 既可以理解为"HTTP 客户端"，也可以理解为"LLM 客户端"
- `handlers/` - 不够明确，看起来像是通用的处理器
- 文档中有两个 "Client Layer"，造成混淆

### 重命名方案

#### 1. 目录重命名

| 旧名称 | 新名称 | 说明 |
|--------|--------|------|
| `src/client/` | `src/llm/` | LLM 通信层 |
| `src/handlers/` | `src/api/` | HTTP API 层 |
| `src/config.rs` | `src/settings.rs` | 配置/设置 |

#### 2. 类型重命名

| 旧名称 | 新名称 |
|--------|--------|
| `Config` | `Settings` |
| `ServerConfig` | `ServerSettings` |
| `LlmBackendConfig` | `LlmBackendSettings` |
| `ApiConfigs` | `ApiSettings` |
| `*Config` | `*Settings` |

#### 3. 方法重命名

| 旧名称 | 新名称 | 说明 |
|--------|--------|------|
| `from_config()` | `new()` | 标准构造函数 |
| `chat_with_model()` | `chat()` | 简化命名 |
| `chat_stream_with_format()` | `chat_stream_ollama()` | 更明确 |
| `models()` | `list_models()` | 更清晰 |

#### 4. 适配器重命名

| 旧名称 | 新名称 | 说明 |
|--------|--------|------|
| `ClientAdapter::ZedDev` | `ClientAdapter::Zed` | 简化命名，与配置一致 |

### 新的架构层次

```
External Clients (外部客户端)
    ↓
API Layer (HTTP API 层) - src/api/
    ↓
Adapter Layer (适配器层) - src/adapters.rs
    ↓
Service Layer (业务逻辑层) - src/service.rs
    ↓
LLM Layer (LLM 通信层) - src/llm/
    ↓
LLM Providers (LLM 提供商)
```

### 模块职责

#### API Layer (`src/api/`)
- HTTP 请求解析
- 格式转换（OpenAI ↔ Ollama ↔ LLM）
- 客户端类型检测
- 认证和授权
- 响应格式化

**文件**：
- `openai.rs` - OpenAI API 端点
- `ollama.rs` - Ollama API 端点
- `convert.rs` - 格式转换工具
- `mod.rs` - 模块导出

#### Service Layer (`src/service.rs`)
- 业务逻辑处理
- 模型选择和验证
- 默认模型 fallback
- 调用 LLM 层方法

#### LLM Layer (`src/llm/`)
- LLM 通信
- 流式响应管理
- 错误处理

**文件**：
- `mod.rs` - Client 结构体
- `types.rs` - 类型定义
- `chat.rs` - 非流式聊天
- `stream.rs` - 流式聊天
- `models.rs` - 模型管理

### Service 层简化

**移除的功能**（移到 `api/convert.rs`）：
- `convert_openai_messages()` → `openai_messages_to_llm()`
- `convert_response_to_openai()` → `response_to_openai()`
- `convert_response_to_ollama()` → `response_to_ollama()`
- `convert_tools()` → `openai_tools_to_llm()`
- `models()` - 返回格式化的模型列表

**保留的功能**：
- `new()` - 创建服务
- `chat()` - 非流式聊天
- `chat_stream_ollama()` - Ollama 流式
- `chat_stream_openai()` - OpenAI 流式
- `list_models()` - 列出模型（返回原始 `Vec<Model>`）
- `validate_model()` - 验证模型

**行数变化**：258 行 → 85 行（减少 67%）

### Client 层模块化

**拆分前**：
- `src/client.rs` - 428 行单文件

**拆分后**：
- `src/llm/mod.rs` - 63 行（Client 结构体）
- `src/llm/types.rs` - 25 行（类型定义）
- `src/llm/chat.rs` - 72 行（非流式聊天）
- `src/llm/stream.rs` - 258 行（流式聊天）
- `src/llm/models.rs` - 63 行（模型管理）

**总计**：481 行（增加了文档注释）

### 优势

1. **消除歧义** - 不再有两个 "Client Layer"
2. **职责清晰** - 每层只做自己该做的事
3. **易于维护** - 文件更小，职责更单一
4. **易于扩展** - 添加新功能更容易定位
5. **符合惯例** - 使用行业标准命名

### 影响范围

- ✅ 所有源代码文件
- ✅ 文档（ARCHITECTURE.md）
- ✅ 编译通过
- ✅ 功能测试通过

### 迁移指南

如果你有基于旧代码的分支或 PR：

```rust
// 旧代码
use crate::client::{Client, Response};
use crate::handlers::{AppState, convert};
use crate::config::Config;

// 新代码
use crate::llm::{Client, Response};
use crate::api::{AppState, convert};
use crate::settings::Settings;
```

### 验证

```bash
# 编译
cargo build --release

# 测试
./target/release/llm-link --list-apps

# 运行
./target/release/llm-link --app codex-cli
```

### 已移除的功能

#### ZhipuNative Adapter
- **移除时间**: 2025-10-19 之前
- **原因**: Zhipu 现在使用 OpenAI 兼容模式，不再需要专门的适配器
- **影响**: 无，Zhipu 通过 `LlmBackendSettings::Zhipu` 继续支持

#### Utils 模块
- **移除时间**: 2025-10-19 之前
- **原因**: XML 转换功能已不再需要
- **影响**: 无，相关功能已整合到其他模块

### 相关文档

- [ARCHITECTURE.md](./ARCHITECTURE.md) - 架构文档（已更新）
- [README.md](../README.md) - 使用文档

