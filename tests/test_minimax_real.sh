#!/bin/bash

# 使用真实 API key 测试 Minimax 的实际 API 调用

export MINIMAX_API_KEY='eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiJsaXBpIiwiVXNlck5hbWUiOiJsaXBpIiwiQWNjb3VudCI6IiIsIlN1YmplY3RJRCI6IjE3NTQwMTIzODY3MTAyNjE3ODQiLCJQaG9uZSI6IjEzOTAxNzMxMjY2IiwiR3JvdXBJRCI6IjE3NTQwMTIzODY3MDYwNjc0ODAiLCJQYWdlTmFtZSI6IiIsIk1haWwiOiIiLCJDcmVhdGVUaW1lIjoiMjAyNS0xMS0wNCAwMDowMzo0MSIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.hSPik-eRMCB1X7M3p2MK84SgR1YyZ3T8n8wg7jII8O6kYgC34BUXQzLt4y_RCsBu3G8IRo5CcljzvLG--78ogRxgQO1x-4DcizIRfCYpquQoilkjwn2HF436-jtez1mHd4c3WVg9_RNbzd-ioRXcsWj82e2TtamSidXxwPWSyz740n3VgQhREtXh8ww4QQPZV1ngTcfsMY_egbC1Pl1-J27rnRhgNhBx-kc4H4NiYQWKALEuaA_XIfUT2k9LmiSF0vC-F6AsW_rKgKiMuqgdUsvfYQUXQx_8SOQ2EL9To6490LuvhCHrIsTkyzVdwdFS5yDJI0VTDRkB_2o0lc5r9Q'

echo "🧪 Testing Minimax M2 with Real API Key"
echo "========================================"
echo ""

# 停止可能运行的实例
pkill -f "llm-link" 2>/dev/null || true
sleep 1

# 启动服务
BINARY="./target/debug/llm-link"
if [ ! -f "$BINARY" ]; then
    BINARY="./target/release/llm-link"
fi

echo "🚀 Starting llm-link with minimax provider..."
$BINARY --app zed --provider minimax > /tmp/llm-link-minimax-real.log 2>&1 &
PID=$!

echo "⏳ Waiting for service to start (PID: $PID)..."
sleep 4

# 检查服务是否启动
if ! ps -p $PID > /dev/null; then
    echo "❌ Service failed to start. Check logs:"
    tail -20 /tmp/llm-link-minimax-real.log
    exit 1
fi

echo "✅ Service started"
echo ""

# 测试 1: 验证 API key
echo "📋 Test 1: Validating API Key"
echo "------------------------------"
VALIDATE_RESPONSE=$(curl -s -X POST http://localhost:11434/api/config/validate-key \
  -H "Content-Type: application/json" \
  -d '{"provider": "minimax", "api_key": "'"$MINIMAX_API_KEY"'", "model": "MiniMax-M2"}')

echo "$VALIDATE_RESPONSE" | jq '.' || echo "$VALIDATE_RESPONSE"
echo ""

# 测试 2: 测试简单的聊天请求
echo "📋 Test 2: Testing Chat API Call"
echo "---------------------------------"
CHAT_RESPONSE=$(curl -s -X POST http://localhost:11434/ollama/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MiniMax-M2",
    "messages": [
      {"role": "user", "content": "你好，请简单介绍一下你自己"}
    ],
    "stream": false
  }')

if echo "$CHAT_RESPONSE" | jq -e '.message' > /dev/null 2>&1; then
    echo "✅ Chat API call successful!"
    echo "$CHAT_RESPONSE" | jq -r '.message.content' | head -5
else
    echo "⚠️  Chat API response:"
    echo "$CHAT_RESPONSE" | jq '.' || echo "$CHAT_RESPONSE"
fi
echo ""

# 测试 3: 测试流式响应
echo "📋 Test 3: Testing Streaming Response"
echo "--------------------------------------"
echo "Streaming response (first 3 chunks):"
curl -s -X POST http://localhost:11434/ollama/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "model": "MiniMax-M2",
    "messages": [
      {"role": "user", "content": "用一句话介绍 AI"}
    ],
    "stream": true
  }' | head -3
echo ""

# 清理
echo "🧹 Cleaning up..."
kill $PID 2>/dev/null || true
sleep 1

echo ""
echo "✅ Minimax M2 test completed!"

