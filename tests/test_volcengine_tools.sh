#!/bin/bash
# 测试 Volcengine Seed Code 的工具调用支持

set -e

echo "🧪 测试 Volcengine Seed Code 工具调用支持"
echo ""

if [ -z "$VOLCENGINE_API_KEY" ]; then
    echo "❌ 请设置 VOLCENGINE_API_KEY 环境变量"
    exit 1
fi

echo "🚀 启动 llm-link 服务 (Ollama 协议 + Volcengine Seed Code)..."
cargo build --release 2>&1 | grep -v "Compiling\|Finished" || true

./target/release/llm-link \
  --app zed \
  --protocols ollama \
  --provider volcengine \
  --model doubao-seed-code-preview-latest \
  --llm-api-key "$VOLCENGINE_API_KEY" \
  > /tmp/llm-link-volcengine-tools.log 2>&1 &

PID=$!
echo "📝 PID: $PID"

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 3

# 测试工具调用
echo ""
echo "📡 测试 Volcengine 工具调用 (流式)..."
echo ""

curl -X POST http://localhost:11434/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "doubao-seed-code-preview-latest",
    "messages": [
      {
        "role": "user",
        "content": "What is the weather in Beijing?"
      }
    ],
    "stream": true,
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get the current weather in a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "The city name"
              }
            },
            "required": ["location"]
          }
        }
      }
    ]
  }' 2>&1 | tee /tmp/volcengine-tools-response.txt

echo ""
echo ""
echo "📊 检查响应中是否包含 tool_calls..."
if grep -q "tool_calls" /tmp/volcengine-tools-response.txt; then
  echo "✅ 找到 tool_calls!"
  grep "tool_calls" /tmp/volcengine-tools-response.txt | head -5
else
  echo "⚠️ 未找到 tool_calls (可能模型选择不调用工具)"
  echo ""
  echo "📋 完整响应:"
  cat /tmp/volcengine-tools-response.txt | head -20
fi

echo ""
echo "📋 服务日志 (最后 30 行):"
tail -30 /tmp/llm-link-volcengine-tools.log

# 清理
echo ""
echo "🧹 清理..."
kill $PID 2>/dev/null || true
sleep 1

echo ""
echo "✅ 测试完成!"

