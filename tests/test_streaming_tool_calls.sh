#!/bin/bash

# 测试流式模式下的 tool_calls 返回

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G
export LLM_LINK_API_KEY=1012jladpo132321lkalsdfjals1123

echo "🧪 Testing Streaming Tool Calls"
echo "================================"
echo ""

# 启动服务
echo "1️⃣  Starting service..."
./target/release/llm-link --app codex-cli --model glm-4.6 > /tmp/streaming-toolcalls-test.log 2>&1 &
PID=$!
echo "   Service PID: $PID"
sleep 3

echo ""
echo "2️⃣  Sending STREAMING request with tools..."
echo "-------------------------------------------"
echo ""

# 流式请求 + tools
curl -s -N -X POST http://localhost:8088/v1/chat/completions \
  -H "Authorization: Bearer 1012jladpo132321lkalsdfjals1123" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {"role": "user", "content": "List files in the current directory"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "list_files",
          "description": "List files in a directory",
          "parameters": {
            "type": "object",
            "properties": {
              "path": {"type": "string", "description": "Directory path"}
            },
            "required": ["path"]
          }
        }
      }
    ],
    "stream": true
  }' 2>&1 | tee /tmp/streaming-toolcalls.txt

echo ""
echo ""
echo "3️⃣  Analyzing response..."
echo "========================="
echo ""

# 检查是否有 tool_calls
if grep -q "tool_calls" /tmp/streaming-toolcalls.txt; then
    echo "✅ Response contains tool_calls!"
    echo ""
    echo "Tool calls found:"
    grep "tool_calls" /tmp/streaming-toolcalls.txt | head -5
    echo ""
else
    echo "❌ No tool_calls found in response"
    echo ""
    echo "Response preview:"
    head -20 /tmp/streaming-toolcalls.txt
    echo ""
fi

# 检查是否有 content
if grep -q '"content"' /tmp/streaming-toolcalls.txt | grep -v '""' | grep -v 'null'; then
    echo "⚠️  Response also contains content (LLM chose to answer instead of calling function)"
    echo ""
fi

echo ""
echo "4️⃣  Checking service logs..."
echo "============================"
echo ""

# 检查工具日志
echo "Tool-related logs:"
grep -i "tool\|🔧" /tmp/streaming-toolcalls-test.log | tail -10
echo ""

# 检查是否有错误
if grep -q "❌\|ERROR" /tmp/streaming-toolcalls-test.log; then
    echo "⚠️  Errors found:"
    grep "❌\|ERROR" /tmp/streaming-toolcalls-test.log | tail -5
    echo ""
fi

echo ""
echo "5️⃣  Cleanup..."
kill $PID 2>/dev/null
wait $PID 2>/dev/null

echo ""
echo "================================"
echo "📝 Files saved:"
echo "   - Service log: /tmp/streaming-toolcalls-test.log"
echo "   - Response: /tmp/streaming-toolcalls.txt"
echo ""
echo "🎯 Expected: Stream should contain tool_calls in delta"
echo ""

