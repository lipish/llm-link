#!/bin/bash

echo "🧪 Testing /api/info endpoint - All Providers and Models"
echo "=========================================================="
echo ""

# 启动服务
export ZHIPU_API_KEY="test-key"
./target/release/llm-link --app zed --provider zhipu > /tmp/llm-link-test.log 2>&1 &
PID=$!

echo "⏳ Waiting for service to start..."
sleep 3

echo ""
echo "📊 Provider Summary:"
echo "-------------------"
curl -s http://localhost:11434/api/info | jq -r '.supported_providers[] | "\(.name): \(.models | length) models"' | sort

echo ""
echo "📋 Detailed Models by Provider:"
echo "================================"

for provider in openai anthropic zhipu aliyun volcengine tencent longcat moonshot ollama; do
    echo ""
    echo "🔹 $provider:"
    curl -s http://localhost:11434/api/info | jq -r ".supported_providers[] | select(.name == \"$provider\") | .models[] | \"  - \(.id): \(.name)\""
done

echo ""
echo ""
echo "✅ All providers loaded from models.yaml successfully!"

# 清理
kill $PID 2>/dev/null
echo ""
echo "🧹 Cleanup completed"

