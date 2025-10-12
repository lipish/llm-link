#!/bin/bash

# Test script for LLM Link API endpoints

BASE_URL="http://localhost:8080"

echo "Testing LLM Link API..."
echo "======================="

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s "$BASE_URL/health" | jq .
echo ""

# Test OpenAI-compatible models endpoint
echo "2. Testing OpenAI models endpoint..."
curl -s "$BASE_URL/v1/models" | jq .
echo ""

# Test Ollama tags endpoint
echo "3. Testing Ollama tags endpoint..."
curl -s "$BASE_URL/ollama/api/tags" | jq .
echo ""

# Test Anthropic models endpoint
echo "4. Testing Anthropic models endpoint..."
curl -s "$BASE_URL/anthropic/v1/models" | jq .
echo ""

# Uncomment the following tests if you have API keys configured

# Test OpenAI chat completion
# echo "5. Testing OpenAI chat completion..."
# curl -s -X POST "$BASE_URL/v1/chat/completions" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "model": "gpt-3.5-turbo",
#     "messages": [
#       {"role": "user", "content": "Hello, world!"}
#     ]
#   }' | jq .
# echo ""

# Test Ollama chat
# echo "6. Testing Ollama chat..."
# curl -s -X POST "$BASE_URL/ollama/api/chat" \
#   -H "Content-Type: application/json" \
#   -d '{
#     "model": "llama2",
#     "messages": [
#       {"role": "user", "content": "Hello, world!"}
#     ]
#   }' | jq .
# echo ""

echo "API testing completed!"