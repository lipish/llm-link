#!/bin/bash

# 测试智谱 API 对 tool message 的支持

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G

echo "🧪 Testing Zhipu API Tool Message Support"
echo "=========================================="
echo ""

echo "📋 Test 1: First request with tools"
echo "-----------------------------------"
echo ""

# 第一个请求：用户问题 + tools 定义
curl -s -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: Bearer $ZHIPU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-flash",
    "messages": [
      {"role": "user", "content": "What is the current directory?"}
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_current_directory",
          "description": "Get the current working directory",
          "parameters": {
            "type": "object",
            "properties": {}
          }
        }
      }
    ]
  }' | tee /tmp/zhipu-test1.json | jq '.'

echo ""
echo ""

# 检查是否返回了 tool_calls
if grep -q "tool_calls" /tmp/zhipu-test1.json; then
    echo "✅ Test 1 passed: Zhipu returned tool_calls"
    echo ""
    
    # 提取 tool call 信息
    TOOL_CALL_ID=$(cat /tmp/zhipu-test1.json | jq -r '.choices[0].message.tool_calls[0].id')
    TOOL_NAME=$(cat /tmp/zhipu-test1.json | jq -r '.choices[0].message.tool_calls[0].function.name')
    
    echo "Tool call details:"
    echo "  ID: $TOOL_CALL_ID"
    echo "  Name: $TOOL_NAME"
    echo ""
    
    # 第二个请求：包含 tool message
    echo "📋 Test 2: Follow-up request with tool message"
    echo "----------------------------------------------"
    echo ""
    
    # 构建完整的对话历史
    ASSISTANT_MSG=$(cat /tmp/zhipu-test1.json | jq '.choices[0].message')
    
    echo "Sending request with message history:"
    echo "  1. user: What is the current directory?"
    echo "  2. assistant: [tool_calls]"
    echo "  3. tool: /Users/mac-m4/github/llm-link"
    echo ""
    
    curl -s -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
      -H "Authorization: Bearer $ZHIPU_API_KEY" \
      -H "Content-Type: application/json" \
      -d "{
        \"model\": \"glm-4-flash\",
        \"messages\": [
          {\"role\": \"user\", \"content\": \"What is the current directory?\"},
          $ASSISTANT_MSG,
          {\"role\": \"tool\", \"tool_call_id\": \"$TOOL_CALL_ID\", \"content\": \"/Users/mac-m4/github/llm-link\"}
        ]
      }" | tee /tmp/zhipu-test2.json | jq '.'
    
    echo ""
    echo ""
    
    # 分析第二个响应
    echo "📊 Test 2 Analysis"
    echo "-----------------"
    echo ""
    
    if grep -q "error" /tmp/zhipu-test2.json; then
        echo "❌ Test 2 failed: Zhipu returned error"
        echo ""
        echo "Error details:"
        cat /tmp/zhipu-test2.json | jq '.error'
        echo ""
    elif grep -q "tool_calls" /tmp/zhipu-test2.json; then
        echo "⚠️  Test 2 warning: Zhipu returned MORE tool_calls instead of final answer"
        echo ""
        echo "This suggests Zhipu didn't properly process the tool message"
        echo ""
        cat /tmp/zhipu-test2.json | jq '.choices[0].message'
        echo ""
    else
        FINAL_CONTENT=$(cat /tmp/zhipu-test2.json | jq -r '.choices[0].message.content')
        if [ -n "$FINAL_CONTENT" ] && [ "$FINAL_CONTENT" != "null" ]; then
            echo "✅ Test 2 passed: Zhipu returned final answer"
            echo ""
            echo "Final answer:"
            echo "$FINAL_CONTENT"
            echo ""
        else
            echo "❌ Test 2 failed: Empty response"
            echo ""
        fi
    fi
    
else
    echo "❌ Test 1 failed: Zhipu did not return tool_calls"
    echo ""
    echo "Response:"
    cat /tmp/zhipu-test1.json | jq '.choices[0].message'
    echo ""
fi

echo ""
echo "=========================================="
echo "📝 Files saved:"
echo "   - Test 1 response: /tmp/zhipu-test1.json"
echo "   - Test 2 response: /tmp/zhipu-test2.json"
echo ""

# 额外测试：不使用 tools 参数的对照组
echo "📋 Test 3: Control test without tools (for comparison)"
echo "-------------------------------------------------------"
echo ""

curl -s -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: Bearer $ZHIPU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-flash",
    "messages": [
      {"role": "user", "content": "What is the current directory?"}
    ]
  }' | tee /tmp/zhipu-test3.json | jq '.choices[0].message.content'

echo ""
echo "=========================================="
echo ""

