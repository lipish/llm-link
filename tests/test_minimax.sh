#!/bin/bash

# 测试 Minimax Provider
# 这个脚本测试 minimax provider 是否能正确工作

set -e

echo "🧪 Testing Minimax Provider"
echo "============================"
echo ""

# 检查是否提供了 API key
if [ -z "$MINIMAX_API_KEY" ]; then
    echo "⚠️  MINIMAX_API_KEY not set. Using placeholder for testing..."
    echo "   Set MINIMAX_API_KEY environment variable to test with real API"
    export MINIMAX_API_KEY="test-key-placeholder"
fi

# 检查二进制文件是否存在
if [ ! -f "./target/debug/llm-link" ] && [ ! -f "./target/release/llm-link" ]; then
    echo "❌ Binary not found. Building..."
    cargo build
fi

BINARY="./target/release/llm-link"
if [ ! -f "$BINARY" ]; then
    BINARY="./target/debug/llm-link"
fi

echo "✅ Using binary: $BINARY"
echo ""

# 停止可能运行的实例
pkill -f "llm-link" 2>/dev/null || true
sleep 1

# 启动服务
echo "🚀 Starting llm-link with minimax provider..."
$BINARY --app zed --provider minimax > /tmp/llm-link-minimax-test.log 2>&1 &
PID=$!

echo "⏳ Waiting for service to start (PID: $PID)..."
sleep 3

# 检查服务是否启动
if ! ps -p $PID > /dev/null; then
    echo "❌ Service failed to start. Check logs:"
    tail -20 /tmp/llm-link-minimax-test.log
    exit 1
fi

echo "✅ Service started successfully"
echo ""

# 测试 1: 检查 /api/info 端点
echo "📋 Test 1: Checking /api/info endpoint"
echo "----------------------------------------"
RESPONSE=$(curl -s http://localhost:11434/api/info || echo "{}")
if echo "$RESPONSE" | jq -e '.current_provider == "minimax"' > /dev/null 2>&1; then
    echo "✅ Current provider is minimax"
else
    echo "⚠️  Current provider might not be minimax"
    echo "Response: $RESPONSE" | jq '.' || echo "$RESPONSE"
fi

# 检查 minimax 是否在支持的 provider 列表中
if echo "$RESPONSE" | jq -e '.supported_providers[] | select(.name == "minimax")' > /dev/null 2>&1; then
    echo "✅ Minimax found in supported providers"
    echo "$RESPONSE" | jq -r '.supported_providers[] | select(.name == "minimax") | "  Models: \(.models | length)"'
else
    echo "❌ Minimax not found in supported providers"
    echo "$RESPONSE" | jq '.supported_providers[].name' || echo "Could not parse response"
fi
echo ""

# 测试 2: 检查 /api/config/current 端点
echo "📋 Test 2: Checking /api/config/current endpoint"
echo "--------------------------------------------------"
CONFIG_RESPONSE=$(curl -s http://localhost:11434/api/config/current || echo "{}")
if echo "$CONFIG_RESPONSE" | jq -e '.provider == "minimax"' > /dev/null 2>&1; then
    echo "✅ Provider is minimax"
    echo "$CONFIG_RESPONSE" | jq -r '"  Model: \(.model)\n  Has API Key: \(.has_api_key)\n  Supports Hot Reload: \(.supports_hot_reload)"'
else
    echo "⚠️  Provider might not be minimax"
    echo "$CONFIG_RESPONSE" | jq '.' || echo "$CONFIG_RESPONSE"
fi
echo ""

# 测试 3: 检查模型列表
echo "📋 Test 3: Checking models list"
echo "-------------------------------"
MODELS_RESPONSE=$(curl -s http://localhost:11434/v1/models || echo "{}")
if echo "$MODELS_RESPONSE" | jq -e '.data' > /dev/null 2>&1; then
    MODEL_COUNT=$(echo "$MODELS_RESPONSE" | jq -r '.data | length')
    echo "✅ Found $MODEL_COUNT models"
    echo "$MODELS_RESPONSE" | jq -r '.data[] | "  - \(.id)"' | head -5
else
    echo "⚠️  Could not retrieve models list"
fi
echo ""

# 清理
echo "🧹 Cleaning up..."
kill $PID 2>/dev/null || true
sleep 1

echo ""
echo "✅ Minimax provider test completed!"
echo ""
echo "📝 Note: To test with actual API calls, set MINIMAX_API_KEY environment variable"
echo "   Example: export MINIMAX_API_KEY='your-api-key'"

