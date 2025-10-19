# Codex Tool Calls 修复总结

## 🎯 问题

**现象**：Codex 在流式模式下不执行工具调用，只显示 LLM 的说明文字。

**用户看到的**：
```
› check the project

• I'll explore the project structure to understand what this is about.

(没有下一步动作，工具没有被执行)
```

## 🔍 调查过程

### 1. 初步假设（错误）

**假设**：Codex 在看到 content 后就停止读取，没有等待后续的 tool_calls。

**推理**：
- LLM 先返回文本："I'll help you..."
- 然后返回 tool_calls
- Codex 可能在看到文本后就认为响应完成

**尝试的解决方案**：
- 缓冲所有 chunks
- 只发送 tool_calls，丢弃 content
- 结果：✅ 工具能执行，但 ❌ 用户看不到思考过程

### 2. 查看 Codex 源代码（关键发现）

**文件**：`codex-rs/core/src/chat_completions.rs`

**关键代码**（第 587-640 行）：
```rust
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

**发现**：
- ✅ Codex **会读取所有 chunks**（包括 content 和 tool_calls）
- ✅ Codex **会累积 tool_calls 信息**
- ✅ Codex **根据 `finish_reason` 决定最终行为**

### 3. 检查实际响应（找到根因）

**GLM-4.6 返回的响应**：
```json
// Chunk 1-26: content
{"delta": {"content": "I'll help you..."}, "finish_reason": null}

// Chunk 27: tool_calls
{"delta": {"tool_calls": [...]}, "finish_reason": null}

// Chunk 28: 结束
{"delta": {}, "finish_reason": "stop"}  // ❌ 问题在这里！
```

**根本原因**：
- GLM-4.6 返回 `finish_reason: "stop"`（即使有 tool_calls）
- 应该返回 `finish_reason: "tool_calls"`
- Codex 看到 `"stop"` 就进入"显示文本"分支，不执行工具

## ✅ 最终解决方案

### 实现

在 llm-link 中自动修正 `finish_reason`：

```rust
// src/client.rs
let mut has_tool_calls = false;

// 1. 检测 tool_calls
if let Some(tool_calls) = &first_choice.delta.tool_calls {
    has_tool_calls = true;
}

// 2. 修正 finish_reason
let finish_reason = if has_tool_calls {
    "tool_calls"  // ✅ 修正
} else {
    "stop"
};

// 3. 发送最终 chunk
let final_chunk = json!({
    "choices": [{
        "delta": {},
        "finish_reason": finish_reason
    }]
});
```

### 效果

**修复后的响应**：
```json
// Chunk 1-26: content
{"delta": {"content": "I'll help you..."}, "finish_reason": null}

// Chunk 27: tool_calls
{"delta": {"tool_calls": [...]}, "finish_reason": null}

// Chunk 28: 结束
{"delta": {}, "finish_reason": "tool_calls"}  // ✅ 修正！
```

**Codex 的行为**：
1. 读取所有 chunks
2. 显示 content："I'll help you check the project..."
3. 看到 `finish_reason: "tool_calls"`
4. ✅ 执行工具！

## 🎉 优势

### ✅ 完整体验
- 用户能看到 LLM 的思考过程
- 工具调用正常执行
- 实时流式响应

### ✅ 无需配置
- 自动检测和修正
- 不需要用户配置
- 对所有应用生效

### ✅ 符合规范
- 遵循 OpenAI API 规范
- 兼容所有检查 `finish_reason` 的客户端
- 不破坏现有功能

## 📊 测试结果

```bash
# 测试命令
./tests/test_codex_simulation.sh

# 响应
data: {"choices":[{"delta":{"content":"I'll help you..."},...}]}
...
data: {"choices":[{"delta":{"tool_calls":[...]},...}]}
data: {"choices":[{"delta":{},"finish_reason":"tool_calls",...}]}  ✅
data: [DONE]

# 日志
🔧 Received chunk #27 with tool_calls: 1 calls
🎯 Setting finish_reason to 'tool_calls' (detected tool_calls in stream)
```

## 🔧 技术细节

### 修改的文件
- `src/client.rs` - 核心修复逻辑
- `src/config.rs` - 移除不需要的配置
- `src/apps.rs` - 清理配置

### 关键代码位置
- 检测 tool_calls：第 289-300 行
- 修正 finish_reason：第 339-360 行

### 日志标识
```
🔧 Received chunk #N with tool_calls: X calls
🎯 Setting finish_reason to 'tool_calls' (detected tool_calls in stream)
```

## 📚 相关文档

- [详细技术文档](./streaming-tool-calls-fix.md)
- [CHANGELOG](../CHANGELOG.md)
- [Codex 源代码](https://github.com/openai/codex)

## 🎯 总结

| 方面 | 修复前 | 修复后 |
|------|--------|--------|
| **finish_reason** | `"stop"` ❌ | `"tool_calls"` ✅ |
| **Codex 行为** | 只显示文本 | 执行工具 |
| **用户体验** | 工具不执行 | 完整体验 |
| **实时性** | N/A | 保留流式 |
| **配置** | N/A | 无需配置 |

**这是一个完美的代理层修复**：
- ✅ 不需要修改 Codex
- ✅ 不需要修改 LLM
- ✅ 在中间层解决兼容性问题
- ✅ 保留完整的用户体验

🎉 问题完美解决！

