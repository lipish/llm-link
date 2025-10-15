# Zed.dev 连接问题分析与解决方案

## 问题描述

在开发 llm-link 项目时，遇到了 Zed.dev 无法连接到我们的 Ollama 兼容服务的问题。具体表现为：

1. Zed.dev 能够成功获取模型列表（GET /api/tags）
2. 但在查询模型详情时失败（POST /api/show），返回 422 Unprocessable Entity 错误
3. 之前还存在 405 Method Not Allowed 错误

## 问题根源分析

经过深入调试和分析，发现了以下关键问题：

### 1. HTTP 方法不匹配

**问题**：原始实现将 `/api/show` 端点配置为 GET 方法，但 Zed.dev 发送的是 POST 请求

```rust
// 错误的实现
.route("/api/show", get(handlers::ollama_show))  // ❌ GET 方法

// 正确的实现
.route("/api/show", post(handlers::ollama_show)) // ✅ POST 方法
```

### 2. 请求参数格式错误

**问题**：原始实现期望从 URL 路径参数获取模型名称，但 Zed.dev 使用 JSON body 传递参数

```rust
// 错误的实现 - 期望路径参数
pub async fn ollama_show(
    axum::extract::Path(name): axum::extract::Path<String>, // ❌ 路径参数
) -> Result<impl IntoResponse, StatusCode>

// 正确的实现 - 接收 JSON body
pub async fn ollama_show(
    Json(request): Json<OllamaShowRequest>, // ✅ JSON body
) -> Result<impl IntoResponse, StatusCode>
```

### 3. 字段名兼容性问题

**问题**：不同客户端可能使用不同的字段名（`name` vs `model`）

```rust
// 解决方案：支持两种字段名
#[derive(Debug, Deserialize)]
pub struct OllamaShowRequest {
    #[serde(alias = "model")] // ✅ 同时支持 name 和 model
    pub name: String,
}
```

### 4. API 响应格式不匹配

**问题**：原始实现使用 OpenAI 格式的模型列表，但 Zed.dev 期望 Ollama 原生格式

```rust
// 错误：OpenAI 格式
{
  "id": "glm-4.6",
  "object": "model",
  "created": 1234567890,
  "owned_by": "llm-link"
}

// 正确：Ollama 原生格式
{
  "name": "glm-4.6",
  "model": "glm-4.6",
  "modified_at": "2025-10-14T06:51:46.913476+00:00",
  "size": 0,
  "digest": "",
  "details": {
    "family": "glm",
    "format": "gguf",
    "parameter_size": "unknown",
    "quantization_level": "unknown"
  },
  "expires_at": null
}
```

## Ollama 源码分析

为什么 Ollama 源码没有这些问题？通过分析发现：

1. **API 设计一致性**：Ollama 严格遵循 RESTful 原则，`/api/show` 设计为 POST 方法是因为它会修改服务器状态（记录访问统计等）

2. **文档不完整**：Ollama 的官方 API 文档（docs/api.md）并不完整，很多细节需要通过阅读源码才能了解

3. **实现细节**：Ollama 使用 Go 语言实现，其路由设计和 JSON 处理与我们最初的假设不同

4. **字段命名**：Ollama 统一使用 `name` 字段，但为了兼容性，我们支持了 `model` 别名

## 调试过程

### 阶段 1：连接性问题
- 症状：Zed.dev 完全无法连接
- 原因：网络绑定问题（localhost vs 127.0.0.1）
- 解决：使用 127.0.0.1:11434

### 阶段 2：HTTP 方法错误
- 症状：405 Method Not Allowed
- 原因：GET vs POST 方法不匹配
- 解决：改为 POST 方法

### 阶段 3：请求格式错误
- 症状：422 Unprocessable Entity
- 原因：JSON 解析失败，字段名和格式不正确
- 解决：修正请求结构体和字段别名

### 阶段 4：响应格式错误
- 症状：能连接但功能不完整
- 原因：模型列表格式不兼容
- 解决：使用 Ollama 原生响应格式

## 最终解决方案

1. **路由配置**：
```rust
.route("/api/show", post(handlers::ollama_show))  // POST 方法
```

2. **请求结构体**：
```rust
#[derive(Debug, Deserialize)]
pub struct OllamaShowRequest {
    #[serde(alias = "model")]
    pub name: String,
}
```

3. **响应格式**：
```rust
// 使用 Ollama 原生格式，包含完整的模型元数据
serde_json::json!({
    "name": model.id,
    "model": model.id,
    "modified_at": chrono::Utc::now().to_rfc3339(),
    "size": 0,
    "digest": "",
    "details": {
        "family": model.id.split('-').next().unwrap_or("unknown"),
        "format": "gguf",
        "parameter_size": "unknown",
        "quantization_level": "unknown"
    },
    "expires_at": null
})
```

## 关键学习点

1. **API 兼容性需要严格测试**：即使认为实现正确，也需要实际客户端验证
2. **文档可能不完整**：需要通过源码分析和实际测试来验证 API 规范
3. **错误日志的重要性**：详细的请求/响应日志对调试至关重要
4. **客户端差异**：不同客户端（Zed.dev、curl 等）可能有细微的行为差异
5. **向后兼容性**：支持字段别名可以提高与不同客户端的兼容性

## 结论

通过系统性的调试和分析，我们成功解决了 Zed.dev 与 llm-link 服务的兼容性问题。这个过程中发现的问题主要源于对 Ollama API 规范理解不够准确，以及缺乏实际客户端测试。最终的解决方案不仅修复了 Zed.dev 的连接问题，还提高了整体 API 的兼容性和健壮性。