#!/bin/bash

# 直接测试智谱 API 的流式 tool_calls

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G

echo "🧪 Testing Zhipu API Streaming Tool Calls (Direct)"
echo "==================================================="
echo ""

echo "📋 Sending streaming request with tools to Zhipu API..."
echo ""

curl -s -N -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: Bearer $ZHIPU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-flash",
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
              "path": {"type": "string"}
            }
          }
        }
      }
    ],
    "stream": true
  }' 2>&1 | tee /tmp/zhipu-streaming-direct.txt

echo ""
echo ""
echo "📊 Analysis:"
echo "============"
echo ""

if grep -q "tool_calls" /tmp/zhipu-streaming-direct.txt; then
    echo "✅ Zhipu API returns tool_calls in streaming mode"
    echo ""
    echo "Tool calls chunks:"
    grep "tool_calls" /tmp/zhipu-streaming-direct.txt | head -5
    echo ""
else
    echo "❌ No tool_calls in Zhipu streaming response"
    echo ""
    echo "Response preview:"
    head -20 /tmp/zhipu-streaming-direct.txt
    echo ""
fi

echo "📝 Full response saved to: /tmp/zhipu-streaming-direct.txt"
echo ""

