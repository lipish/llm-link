#!/bin/bash

# 测试流式模式下的 tool messages（llm-connector 0.4.15 修复验证）

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G
export LLM_LINK_API_KEY=1012jladpo132321lkalsdfjals1123

echo "🧪 Testing Streaming Tool Messages (llm-connector 0.4.15)"
echo "=========================================================="
echo ""

# 启动服务
echo "1️⃣  Starting service..."
./target/release/llm-link --app codex-cli --model glm-4.6 > /tmp/streaming-tool-test.log 2>&1 &
PID=$!
echo "   Service PID: $PID"
sleep 3

echo ""
echo "2️⃣  First request: User asks a question (with tools)"
echo "---------------------------------------------------"
echo ""

# 第一个请求：用户问题 + tools
curl -s -X POST http://localhost:8088/v1/chat/completions \
  -H "Authorization: Bearer 1012jladpo132321lkalsdfjals1123" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {"role": "user", "content": "What files are in the current directory?"}
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
    "stream": false
  }' | tee /tmp/response1-stream.json | jq '.'

echo ""
echo ""

# 检查第一个响应
if grep -q "tool_calls" /tmp/response1-stream.json; then
    echo "✅ First request: LLM returned tool_calls"
    echo ""
    
    TOOL_CALL_ID=$(cat /tmp/response1-stream.json | jq -r '.choices[0].message.tool_calls[0].id')
    TOOL_NAME=$(cat /tmp/response1-stream.json | jq -r '.choices[0].message.tool_calls[0].function.name')
    
    echo "Tool call:"
    echo "  ID: $TOOL_CALL_ID"
    echo "  Name: $TOOL_NAME"
    echo ""
    
    # 提取完整的 assistant message
    ASSISTANT_MSG=$(cat /tmp/response1-stream.json | jq '.choices[0].message')
    
    echo "3️⃣  Second request: STREAMING with tool result"
    echo "----------------------------------------------"
    echo ""
    echo "This is the critical test - streaming with tool messages!"
    echo ""
    
    # 第二个请求：包含 tool message，使用流式模式
    curl -s -N -X POST http://localhost:8088/v1/chat/completions \
      -H "Authorization: Bearer 1012jladpo132321lkalsdfjals1123" \
      -H "Content-Type: application/json" \
      -d "{
        \"model\": \"glm-4.6\",
        \"messages\": [
          {\"role\": \"user\", \"content\": \"What files are in the current directory?\"},
          $ASSISTANT_MSG,
          {\"role\": \"tool\", \"tool_call_id\": \"$TOOL_CALL_ID\", \"content\": \"Cargo.toml\\nCargo.lock\\nsrc/\\ntests/\\ndocs/\\nREADME.md\\nCHANGELOG.md\"}
        ],
        \"stream\": true
      }" 2>&1 | tee /tmp/response2-stream.txt
    
    echo ""
    echo ""
    echo "4️⃣  Analyzing streaming response..."
    echo "===================================="
    echo ""
    
    # 检查流式响应
    if grep -q "data:" /tmp/response2-stream.txt; then
        echo "✅ Received SSE stream"
        echo ""
        
        # 提取所有 content
        CONTENT=$(grep "data:" /tmp/response2-stream.txt | grep -v "DONE" | sed 's/data: //' | jq -r '.choices[0].delta.content // empty' | tr -d '\n')
        
        if [ -n "$CONTENT" ]; then
            echo "✅ Stream contains content!"
            echo ""
            echo "Content preview:"
            echo "$CONTENT" | head -c 200
            echo "..."
            echo ""
            echo "Content length: ${#CONTENT} characters"
            echo ""
        else
            echo "❌ Stream has no content (llm-connector 0.4.15 fix may not be working)"
            echo ""
            echo "Raw stream preview:"
            head -20 /tmp/response2-stream.txt
            echo ""
        fi
    else
        echo "❌ No SSE stream received"
        echo ""
        echo "Response:"
        cat /tmp/response2-stream.txt
        echo ""
    fi
    
else
    echo "❌ First request failed: No tool_calls"
    echo ""
fi

echo ""
echo "5️⃣  Checking service logs..."
echo "============================"
echo ""

# 检查是否有警告或错误
if grep -q "⚠️\|❌" /tmp/streaming-tool-test.log; then
    echo "⚠️  Found warnings/errors in logs:"
    grep "⚠️\|❌" /tmp/streaming-tool-test.log | tail -10
    echo ""
else
    echo "✅ No warnings or errors in logs"
    echo ""
fi

# 检查是否有 tool message 相关日志
echo "Tool message handling:"
grep -i "tool\|Tool" /tmp/streaming-tool-test.log | tail -5
echo ""

echo ""
echo "6️⃣  Cleanup..."
kill $PID 2>/dev/null
wait $PID 2>/dev/null

echo ""
echo "=========================================================="
echo "📝 Files saved:"
echo "   - Service log: /tmp/streaming-tool-test.log"
echo "   - Response 1: /tmp/response1-stream.json"
echo "   - Response 2: /tmp/response2-stream.txt"
echo ""
echo "🎯 Summary:"
echo "   - llm-connector version: 0.4.15"
echo "   - Test: Streaming mode with tool messages"
echo "   - Expected: Stream should contain actual content"
echo ""

