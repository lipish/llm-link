#!/bin/bash

# 模拟 Codex 的请求

export LLM_LINK_API_KEY=1012jladpo132321lkalsdfjals1123

echo "🧪 Simulating Codex Request"
echo "==========================="
echo ""

echo "📋 Sending request similar to Codex..."
echo ""

# 模拟 Codex 的请求（简化版）
curl -s -N -X POST http://localhost:8088/v1/chat/completions \
  -H "Authorization: Bearer $LLM_LINK_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4.6",
    "messages": [
      {
        "role": "system",
        "content": "You are a helpful AI coding assistant. When the user asks you to perform an action, use the available tools to complete the task."
      },
      {
        "role": "user",
        "content": "check the project"
      }
    ],
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "shell",
          "description": "Execute a shell command and return the output",
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
      },
      {
        "type": "function",
        "function": {
          "name": "view",
          "description": "View the contents of a file",
          "parameters": {
            "type": "object",
            "properties": {
              "path": {
                "type": "string",
                "description": "Path to the file to view"
              }
            },
            "required": ["path"]
          }
        }
      }
    ],
    "stream": true
  }' 2>&1 | tee /tmp/codex-sim.txt

echo ""
echo ""
echo "📊 Analysis:"
echo "============"
echo ""

if grep -q "tool_calls" /tmp/codex-sim.txt; then
    echo "✅ LLM returned tool_calls"
    echo ""
    grep "tool_calls" /tmp/codex-sim.txt | head -3
    echo ""
else
    echo "❌ LLM returned text instead of tool_calls"
    echo ""
    echo "Response content:"
    grep '"content"' /tmp/codex-sim.txt | grep -v '""' | head -5
    echo ""
fi

echo "📝 Full response saved to: /tmp/codex-sim.txt"
echo ""

