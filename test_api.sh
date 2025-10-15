#!/bin/bash

# Test script for LLM Link Ollama-compatible API
# Make sure llm-link is running on localhost:11434 before running this script

BASE_URL="http://localhost:11434"

echo "🧪 Testing LLM Link Ollama-compatible API..."
echo "============================================="
echo ""

# Test 1: Health check via tags endpoint
echo "1. 📋 Testing model list (tags) endpoint..."
echo "   GET $BASE_URL/api/tags"
curl -s "$BASE_URL/api/tags" | jq . || echo "❌ Failed or jq not installed"
echo ""

# Test 2: Non-streaming chat
echo "2. 💬 Testing non-streaming chat..."
echo "   POST $BASE_URL/api/chat (stream=false)"
curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-flash",
    "messages": [
      {"role": "user", "content": "简单回复：测试成功"}
    ],
    "stream": false
  }' | jq . || echo "❌ Failed or jq not installed"
echo ""

# Test 3: Streaming chat (first few chunks)
echo "3. 🌊 Testing streaming chat (first 3 chunks)..."
echo "   POST $BASE_URL/api/chat (stream=true)"
curl -s -X POST "$BASE_URL/api/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-flash",
    "messages": [
      {"role": "user", "content": "简单回复：流式测试"}
    ],
    "stream": true
  }' | head -3
echo ""

echo "✅ API testing completed!"
echo ""
echo "💡 Tips:"
echo "   - Make sure llm-link is running: ./target/release/llm-link"
echo "   - Install jq for better JSON formatting: brew install jq"
echo "   - Check configs/README.md for configuration options"
