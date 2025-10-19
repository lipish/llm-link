# Streaming Tool Calls 修复

## 🔍 问题发现

### 现象
Codex 在流式模式下不执行工具调用，只显示文本。

### 原始响应
GLM-4.6 返回的流式响应：
```json
// Chunk 1-26: content
{"delta": {"content": "I'll help you..."}, "finish_reason": null}

// Chunk 27: tool_calls  
{"delta": {"tool_calls": [...]}, "finish_reason": null}

// Chunk 28: 结束
{"delta": {}, "finish_reason": "stop"}  // ❌ 错误！应该是 "tool_calls"
```

## 🎯 根本原因

通过分析 Codex 源代码（`codex-rs/core/src/chat_completions.rs`），发现关键逻辑：

```rust
// Codex 的判断逻辑（第 587-640 行）
if let Some(finish_reason) = choice.get("finish_reason") {
    match finish_reason {
        "tool_calls" if fn_call_state.active => {
            // ✅ 执行工具
            let item = ResponseItem::FunctionCall { ... };
            tx_event.send(Ok(ResponseEvent::OutputItemDone(item))).await;
        }
        "stop" => {
            // ❌ 只显示文本
            if !assistant_text.is_empty() {
                let item = ResponseItem::Message { ... };
                tx_event.send(Ok(ResponseEvent::OutputItemDone(item))).await;
            }
        }
    }
}
```

**问题**：
- GLM-4.6 返回 `finish_reason: "stop"`（即使有 tool_calls）
- Codex 检查 `finish_reason` 来决定行为
- `"stop"` → 显示文本，不执行工具
- `"tool_calls"` → 执行工具

## ✅ 解决方案

llm-link 实现了**智能 `finish_reason` 修正**：

### 实现逻辑

```rust
// src/client.rs
let mut has_tool_calls = false;

// 1. 检测 tool_calls
if let Some(tool_calls) = &first_choice.delta.tool_calls {
    has_tool_calls = true;
}

// 2. 修正 finish_reason
let finish_reason = if has_tool_calls {
    "tool_calls"  // ✅ 修正为正确值
} else {
    "stop"
};

// 3. 发送最终 chunk
let final_chunk = json!({
    "choices": [{
        "delta": {},
        "finish_reason": finish_reason  // 使用修正后的值
    }]
});
```

### 效果对比

**修复前**：
```json
{"delta": {"tool_calls": [...]}, "finish_reason": null}
{"delta": {}, "finish_reason": "stop"}  // ❌ Codex 不执行工具
```

**修复后**：
```json
{"delta": {"tool_calls": [...]}, "finish_reason": null}
{"delta": {}, "finish_reason": "tool_calls"}  // ✅ Codex 执行工具！
```

## 📊 测试验证

```bash
# 测试脚本
./tests/test_codex_simulation.sh

# 结果
data: {"choices":[{"delta":{"content":"I'll help you..."},...}]}
...
data: {"choices":[{"delta":{"tool_calls":[...]},...}]}
data: {"choices":[{"delta":{},"finish_reason":"tool_calls",...}]}  ✅
data: [DONE]
```

**日志输出**：
```
🔧 Received chunk #27 with tool_calls: 1 calls
🎯 Setting finish_reason to 'tool_calls' (detected tool_calls in stream)
```

## 🎉 优势

### ✅ 保留完整体验
- 用户能看到 LLM 的思考过程："I'll help you check the project..."
- 工具调用正常执行
- 实时流式响应，无延迟

### ✅ 符合规范
- 遵循 OpenAI API 规范
- `finish_reason: "tool_calls"` 表示响应包含工具调用
- Codex 等客户端能正确识别

### ✅ 通用解决方案
- 适用于所有检查 `finish_reason` 的客户端
- 不需要修改客户端代码
- 不需要配置，自动生效

## 🔧 技术细节

### 实现位置
- **核心逻辑**: `src/client.rs` - `chat_stream_openai()`
- **检测**: 第 289-300 行 - 检测 tool_calls
- **修正**: 第 339-360 行 - 修正 finish_reason

### 关键代码

```rust
// 检测 tool_calls
if let Some(first_choice) = stream_chunk.choices.get(0) {
    if let Some(tool_calls) = &first_choice.delta.tool_calls {
        has_tool_calls = true;  // 标记
    }
}

// 修正 finish_reason
let finish_reason = if has_tool_calls {
    tracing::info!("🎯 Setting finish_reason to 'tool_calls'");
    "tool_calls"
} else {
    "stop"
};
```

## 📚 相关资源

### OpenAI API 规范
- [Streaming Responses](https://platform.openai.com/docs/guides/streaming-responses)
- `finish_reason` 可能的值：
  - `"stop"`: 正常结束
  - `"tool_calls"`: 需要执行工具
  - `"length"`: 达到最大长度
  - `"content_filter"`: 内容过滤

### Codex 源代码
- 仓库: https://github.com/openai/codex
- 关键文件: `codex-rs/core/src/chat_completions.rs`
- 判断逻辑: 第 587-640 行

## 🎯 总结

**问题**：GLM-4.6 返回错误的 `finish_reason`  
**原因**：Codex 依赖 `finish_reason` 决定是否执行工具  
**解决**：llm-link 自动检测并修正 `finish_reason`  
**效果**：✅ 用户看到思考过程 + ✅ 工具正常执行

这是一个**完美的代理层修复**，无需修改客户端或 LLM，在中间层解决了兼容性问题！🎉

