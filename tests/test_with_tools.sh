#!/bin/bash

# 测试带 tools 定义的请求

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G
export LLM_LINK_API_KEY=1012jladpo132321lkalsdfjals1123

echo "🧪 Testing Request with Tools Definition"
echo "========================================="
echo ""

# 启动服务
echo "1️⃣  Starting service..."
./target/release/llm-link --app codex-cli > /tmp/llm-link-tools.log 2>&1 &
PID=$!
echo "   Service PID: $PID"
sleep 3

echo ""
echo "2️⃣  Sending request WITH tools definition..."
echo ""

curl -N -X POST http://localhost:8088/v1/chat/completions \
  -H "Authorization: Bearer 1012jladpo132321lkalsdfjals1123" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-flash",
    "messages": [
      {"role": "user", "content": "请使用 shell 工具执行 pwd 命令"}
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
    "stream": true
  }' 2>&1 | tee /tmp/response-with-tools.txt

echo ""
echo ""
echo "3️⃣  Analyzing response..."
echo "========================================="
echo ""

# 检查是否有 function_call
if grep -q "function_call" /tmp/response-with-tools.txt; then
    echo "✅ Found function_call in response!"
    echo ""
    grep "function_call" /tmp/response-with-tools.txt | head -3
    echo ""
elif grep -q "<function_call>" /tmp/response-with-tools.txt; then
    echo "❌ Found XML function_call (not converted)!"
    echo ""
    grep -o "<function_call>.*</function_call>" /tmp/response-with-tools.txt | head -1
    echo ""
else
    echo "⚠️  No function_call found in response"
    echo ""
    echo "Response preview:"
    head -20 /tmp/response-with-tools.txt
    echo ""
fi

echo ""
echo "4️⃣  Checking service logs..."
echo "========================================="
echo ""

if grep -q "Moved XML function call" /tmp/llm-link-tools.log; then
    echo "✅ XML was converted!"
    grep "Moved\|Converted" /tmp/llm-link-tools.log
elif grep -q "Checking for XML" /tmp/llm-link-tools.log; then
    echo "✅ XML checking was performed"
    grep "Checking for XML" /tmp/llm-link-tools.log | tail -5
else
    echo "⚠️  No XML-related logs"
fi

echo ""
echo "5️⃣  Cleanup..."
kill $PID 2>/dev/null
wait $PID 2>/dev/null

echo ""
echo "========================================="
echo "📝 Files saved:"
echo "   - Service log: /tmp/llm-link-tools.log"
echo "   - Response: /tmp/response-with-tools.txt"
echo ""

