#!/bin/bash

# 测试 /api/info 端点

echo "🧪 Testing /api/info endpoint..."
echo ""

# 启动 llm-link 服务（后台运行）
echo "🚀 Starting llm-link service..."
export ZHIPU_API_KEY="test-key-for-demo"
./target/release/llm-link --app zed --provider zhipu --model glm-4-flash &
PID=$!

# 等待服务启动
echo "⏳ Waiting for service to start..."
sleep 3

# 测试 /api/info 端点
echo ""
echo "📡 Testing GET /api/info..."
echo ""
curl -s http://localhost:11434/api/info | jq '.'

# 清理
echo ""
echo "🧹 Cleaning up..."
kill $PID 2>/dev/null

echo ""
echo "✅ Test completed!"

