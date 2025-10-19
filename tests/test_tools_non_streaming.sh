#!/bin/bash

# 测试非流式 tools 请求

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G
export LLM_LINK_API_KEY=1012jladpo132321lkalsdfjals1123

echo "🧪 Testing Non-Streaming Request with Tools"
echo "============================================"
echo ""

# 启动服务
echo "1️⃣  Starting service..."
./target/release/llm-link --app codex-cli > /tmp/llm-link-nonstream.log 2>&1 &
PID=$!
echo "   Service PID: $PID"
sleep 3

echo ""
echo "2️⃣  Sending NON-STREAMING request with tools..."
echo ""

curl -s -X POST http://localhost:8088/v1/chat/completions \
  -H "Authorization: Bearer 1012jladpo132321lkalsdfjals1123" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-flash",
    "messages": [
      {"role": "user", "content": "Execute pwd command"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "shell",
          "description": "Execute shell commands",
          "parameters": {
            "type": "object",
            "properties": {
              "command": {
                "type": "string",
                "description": "The shell command to execute"
              }
            },
            "required": ["command"]
          }
        }
      }
    ],
    "stream": false
  }' 2>&1 | tee /tmp/response-nonstream.txt | jq '.'

echo ""
echo ""
echo "3️⃣  Analyzing response..."
echo "============================================"
echo ""

# 检查是否有 function_call 或 tool_calls
if grep -q "tool_calls" /tmp/response-nonstream.txt; then
    echo "✅ Found tool_calls in response!"
    echo ""
    cat /tmp/response-nonstream.txt | jq '.choices[0].message.tool_calls'
    echo ""
elif grep -q "function_call" /tmp/response-nonstream.txt; then
    echo "✅ Found function_call in response!"
    echo ""
    cat /tmp/response-nonstream.txt | jq '.choices[0].message.function_call'
    echo ""
else
    echo "❌ No function call found"
    echo ""
    echo "Response content:"
    cat /tmp/response-nonstream.txt | jq '.choices[0].message.content'
    echo ""
fi

echo ""
echo "4️⃣  Cleanup..."
kill $PID 2>/dev/null
wait $PID 2>/dev/null

echo ""
echo "============================================"
echo "📝 Files saved:"
echo "   - Service log: /tmp/llm-link-nonstream.log"
echo "   - Response: /tmp/response-nonstream.txt"
echo ""

