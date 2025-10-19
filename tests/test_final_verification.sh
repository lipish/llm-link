#!/bin/bash

# 最终验证测试：确保 finish_reason 修复正常工作

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G
export LLM_LINK_API_KEY=1012jladpo132321lkalsdfjals1123

echo "🧪 Final Verification Test"
echo "==========================="
echo ""

# 启动服务
echo "1️⃣  Starting service..."
./target/release/llm-link --app codex-cli --model glm-4.6 > /tmp/final-test.log 2>&1 &
PID=$!
echo "   Service PID: $PID"
sleep 3

echo ""
echo "2️⃣  Sending streaming request with tools..."
echo "-------------------------------------------"
echo ""

curl -s -N -X POST http://localhost:8088/v1/chat/completions \
  -H "Authorization: Bearer $LLM_LINK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {"role": "user", "content": "List files in current directory"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "shell",
          "description": "Execute shell command",
          "parameters": {
            "type": "object",
            "properties": {
              "command": {"type": "string"}
            }
          }
        }
      }
    ],
    "stream": true
  }' 2>&1 | tee /tmp/final-response.txt

echo ""
echo ""
echo "3️⃣  Verification Results"
echo "========================"
echo ""

# 检查 1: 是否有 content
if grep -q '"content"' /tmp/final-response.txt | grep -v '""' | grep -v 'null'; then
    echo "✅ Content present: User can see LLM's thinking process"
else
    echo "❌ No content found"
fi

# 检查 2: 是否有 tool_calls
if grep -q '"tool_calls"' /tmp/final-response.txt; then
    echo "✅ Tool calls present: Tools will be executed"
else
    echo "❌ No tool_calls found"
fi

# 检查 3: finish_reason 是否正确
if grep -q '"finish_reason":"tool_calls"' /tmp/final-response.txt; then
    echo "✅ finish_reason: 'tool_calls' (CORRECT!)"
    echo "   → Codex will execute the tool"
elif grep -q '"finish_reason":"stop"' /tmp/final-response.txt; then
    echo "❌ finish_reason: 'stop' (WRONG!)"
    echo "   → Codex will NOT execute the tool"
else
    echo "⚠️  No finish_reason found"
fi

echo ""
echo "4️⃣  Service Logs"
echo "================"
echo ""

# 检查日志
if grep -q "Setting finish_reason to 'tool_calls'" /tmp/final-test.log; then
    echo "✅ Service correctly detected and fixed finish_reason"
    grep "tool_calls\|finish_reason" /tmp/final-test.log | tail -3
else
    echo "⚠️  No finish_reason correction in logs"
fi

echo ""
echo "5️⃣  Cleanup"
echo "==========="
kill $PID 2>/dev/null
wait $PID 2>/dev/null
echo "✅ Service stopped"

echo ""
echo "========================="
echo "📝 Test Files:"
echo "   - Response: /tmp/final-response.txt"
echo "   - Logs: /tmp/final-test.log"
echo ""
echo "🎯 Expected Results:"
echo "   ✅ Content present (thinking process)"
echo "   ✅ Tool calls present (function to execute)"
echo "   ✅ finish_reason: 'tool_calls' (correct behavior)"
echo ""

