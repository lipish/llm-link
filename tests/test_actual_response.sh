#!/bin/bash

# 测试实际的 API 响应

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G
export LLM_LINK_API_KEY=1012jladpo132321lkalsdfjals1123

echo "🧪 Testing Actual API Response"
echo "=============================="
echo ""

# 启动服务（后台）
echo "1️⃣  Starting llm-link service..."
./target/release/llm-link --app codex-cli > /tmp/llm-link.log 2>&1 &
PID=$!
echo "   Service PID: $PID"
echo "   Waiting for service to start..."
sleep 3

# 检查服务是否启动
if ! kill -0 $PID 2>/dev/null; then
    echo "❌ Service failed to start"
    cat /tmp/llm-link.log
    exit 1
fi

echo "   ✅ Service started"
echo ""

# 测试请求
echo "2️⃣  Sending test request..."
echo ""

RESPONSE=$(curl -s -X POST http://localhost:8088/v1/chat/completions \
  -H "Authorization: Bearer 1012jladpo132321lkalsdfjals1123" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-flash",
    "messages": [
      {"role": "user", "content": "请使用 shell 工具执行 pwd 命令"}
    ],
    "stream": false
  }')

echo "3️⃣  Response received:"
echo "=============================="
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""
echo "=============================="
echo ""

# 检查响应中是否包含 XML
if echo "$RESPONSE" | grep -q "<function_call>"; then
    echo "❌ FOUND XML in response!"
    echo "   The XML conversion is NOT working"
    echo ""
    echo "   XML content:"
    echo "$RESPONSE" | grep -o '<function_call>.*</function_call>'
    echo ""
else
    echo "✅ NO XML found in response"
    echo "   The XML conversion is working!"
    echo ""
fi

# 检查响应中是否有 function_call 或 tool_calls 字段
if echo "$RESPONSE" | jq -e '.choices[0].message.function_call' >/dev/null 2>&1; then
    echo "✅ Found function_call field (JSON format)"
    echo "$RESPONSE" | jq '.choices[0].message.function_call'
elif echo "$RESPONSE" | jq -e '.choices[0].message.tool_calls' >/dev/null 2>&1; then
    echo "✅ Found tool_calls field (JSON format)"
    echo "$RESPONSE" | jq '.choices[0].message.tool_calls'
elif echo "$RESPONSE" | jq -e '.choices[0].message.content' >/dev/null 2>&1; then
    echo "📝 Content field:"
    CONTENT=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')
    echo "$CONTENT"
    echo ""
    
    # 检查 content 中是否有 XML
    if echo "$CONTENT" | grep -q "<function_call>"; then
        echo "❌ XML found in content field - conversion failed!"
    else
        echo "✅ No XML in content field"
    fi
fi

echo ""
echo "4️⃣  Checking service logs..."
echo "=============================="
echo ""

# 查找 XML 相关日志
if grep -q "Checking for XML" /tmp/llm-link.log; then
    echo "✅ Found XML checking logs:"
    grep "XML\|xml" /tmp/llm-link.log | tail -5
elif grep -q "Skipping XML conversion" /tmp/llm-link.log; then
    echo "⚠️  XML conversion was skipped:"
    grep "Skipping" /tmp/llm-link.log | tail -5
else
    echo "⚠️  No XML-related logs found"
    echo "   Last 10 lines of log:"
    tail -10 /tmp/llm-link.log
fi

echo ""
echo "=============================="

# 停止服务
echo ""
echo "5️⃣  Stopping service..."
kill $PID 2>/dev/null
wait $PID 2>/dev/null
echo "   ✅ Service stopped"
echo ""

echo "📝 Full log saved to: /tmp/llm-link.log"
echo "   View with: cat /tmp/llm-link.log"
echo ""

