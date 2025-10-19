#!/bin/bash

# 直接测试 Zhipu API 是否支持 function calling

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G

echo "🧪 Testing Zhipu API Directly"
echo "=============================="
echo ""

echo "1️⃣  Testing with tools parameter..."
echo ""

curl -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: Bearer $ZHIPU_API_KEY" \
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
    ]
  }' 2>&1 | tee /tmp/zhipu-direct-response.txt

echo ""
echo ""
echo "2️⃣  Analyzing response..."
echo "=============================="
echo ""

# 检查是否有错误
if grep -q "error" /tmp/zhipu-direct-response.txt; then
    echo "❌ API returned an error:"
    cat /tmp/zhipu-direct-response.txt | jq '.error' 2>/dev/null || cat /tmp/zhipu-direct-response.txt
    echo ""
    echo "💡 This means Zhipu's OpenAI-compatible API does NOT support tools parameter"
    echo ""
elif grep -q "function_call\|tool_calls" /tmp/zhipu-direct-response.txt; then
    echo "✅ API returned function_call!"
    cat /tmp/zhipu-direct-response.txt | jq '.' 2>/dev/null
    echo ""
elif grep -q "<function_call>" /tmp/zhipu-direct-response.txt; then
    echo "✅ API returned XML function_call!"
    cat /tmp/zhipu-direct-response.txt
    echo ""
else
    echo "⚠️  API returned normal text (no function call)"
    cat /tmp/zhipu-direct-response.txt | jq '.choices[0].message.content' 2>/dev/null || cat /tmp/zhipu-direct-response.txt
    echo ""
fi

echo ""
echo "=============================="
echo "📝 Full response saved to: /tmp/zhipu-direct-response.txt"
echo ""

