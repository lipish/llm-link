#!/bin/bash

echo "🔍 Verifying Which Endpoint Codex is Using"
echo "==========================================="
echo ""

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G
export LLM_LINK_API_KEY=1012jladpo132321lkalsdfjals1123

echo "1️⃣  Starting llm-link with request logging..."
echo ""

# 启动服务并记录所有 HTTP 请求
./target/release/llm-link --app codex-cli 2>&1 | grep -E "(POST|GET|PUT|DELETE|/v1/)" &
PID=$!

echo "   Service PID: $PID"
echo "   Waiting for service to start..."
sleep 3

echo ""
echo "2️⃣  Now use Codex to send a request"
echo ""
echo "   In another terminal, run:"
echo "   $ codex 'check the project'"
echo ""
echo "3️⃣  Watch for HTTP requests below:"
echo "==========================================="
echo ""

# 等待用户测试
wait $PID

