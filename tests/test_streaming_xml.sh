#!/bin/bash

# 测试流式响应中的 XML 转换

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G
export LLM_LINK_API_KEY=1012jladpo132321lkalsdfjals1123

echo "🧪 Testing XML Conversion in Streaming Response"
echo "================================================"
echo ""

# 启动服务
echo "1️⃣  Starting service..."
RUST_LOG=debug ./target/release/llm-link --app codex-cli > /tmp/llm-link-stream.log 2>&1 &
PID=$!
echo "   Service PID: $PID"
sleep 3

# 发送流式请求
echo ""
echo "2️⃣  Sending streaming request..."
echo ""

curl -N -X POST http://localhost:8088/v1/chat/completions \
  -H "Authorization: Bearer 1012jladpo132321lkalsdfjals1123" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-flash",
    "messages": [
      {"role": "user", "content": "请使用 shell 工具执行 pwd 命令"}
    ],
    "stream": true
  }' 2>&1 | tee /tmp/stream-response.txt

echo ""
echo ""
echo "3️⃣  Analyzing response..."
echo "================================================"
echo ""

# 检查响应中是否有 XML
if grep -q "<function_call>" /tmp/stream-response.txt; then
    echo "❌ FOUND XML in streaming response!"
    echo ""
    echo "XML content:"
    grep -o '<function_call>.*</function_call>' /tmp/stream-response.txt | head -1
    echo ""
else
    echo "✅ NO XML found in streaming response"
    echo ""
fi

# 检查是否有 function_call 字段
if grep -q '"function_call"' /tmp/stream-response.txt; then
    echo "✅ Found function_call field (JSON format)"
    echo ""
    grep '"function_call"' /tmp/stream-response.txt | head -1 | jq '.' 2>/dev/null || echo "(Could not parse JSON)"
    echo ""
else
    echo "⚠️  No function_call field found"
    echo ""
fi

# 检查服务日志
echo ""
echo "4️⃣  Checking service logs..."
echo "================================================"
echo ""

if grep -q "Checking for XML" /tmp/llm-link-stream.log; then
    echo "✅ XML checking was triggered:"
    grep "XML\|xml\|Checking\|Converted\|Moved" /tmp/llm-link-stream.log | tail -10
elif grep -q "Skipping XML conversion" /tmp/llm-link-stream.log; then
    echo "⚠️  XML conversion was skipped:"
    grep "Skipping" /tmp/llm-link-stream.log | tail -5
else
    echo "❌ No XML-related logs found!"
    echo ""
    echo "Last 20 lines of log:"
    tail -20 /tmp/llm-link-stream.log
fi

echo ""
echo "5️⃣  Cleanup..."
kill $PID 2>/dev/null
wait $PID 2>/dev/null

echo ""
echo "================================================"
echo "📝 Full logs saved to:"
echo "   - Service log: /tmp/llm-link-stream.log"
echo "   - Response: /tmp/stream-response.txt"
echo ""
echo "View with:"
echo "   cat /tmp/llm-link-stream.log | grep -i xml"
echo "   cat /tmp/stream-response.txt"
echo ""

