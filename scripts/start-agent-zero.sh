#!/bin/bash

# Agent Zero 启动脚本
# 使用方法: ./scripts/start-agent-zero.sh [provider] [model] [api_key]

set -e

# 默认配置
DEFAULT_PROVIDER="openai"
DEFAULT_MODEL="gpt-4"
DEFAULT_PORT="8092"

# 解析参数
PROVIDER=${1:-$DEFAULT_PROVIDER}
MODEL=${2:-$DEFAULT_MODEL}
API_KEY=${3:-""}

# 检查是否提供了 API key
if [ -z "$API_KEY" ]; then
    echo "❌ 错误: 必须提供 API key"
    echo "使用方法: $0 <provider> <model> <api_key>"
    echo ""
    echo "示例:"
    echo "  $0 openai gpt-4 sk-..."
    echo "  $0 anthropic claude-3-sonnet sk-ant-..."
    echo "  $0 zhipu glm-4 xxx..."
    echo "  $0 ollama qwen2.5-coder dummy"
    echo ""
    exit 1
fi

# 构建项目（如果需要）
if [ ! -f "target/release/llm-link" ]; then
    echo "🔨 构建 llm-link..."
    cargo build --release
fi

echo "🚀 启动 llm-link for Agent Zero..."
echo "   Provider: $PROVIDER"
echo "   Model: $MODEL"
echo "   Port: $DEFAULT_PORT"
echo ""

# 启动 llm-link
./target/release/llm-link \
    --app agent-zero \
    --provider "$PROVIDER" \
    --model "$MODEL" \
    --api-key "$API_KEY" \
    --host 0.0.0.0 \
    --port "$DEFAULT_PORT"

echo ""
echo "✅ Agent Zero 代理已启动!"
echo ""
echo "📋 配置 Agent Zero:"
echo "   在 Agent Zero 的 LiteLLM 配置中设置:"
echo "   - Base URL: http://localhost:$DEFAULT_PORT/v1"
echo "   - API Key: $API_KEY"
echo "   - Model: $MODEL"
echo ""
echo "🎯 开始使用 Agent Zero:"
echo "   启动 Agent Zero 并配置 LiteLLM 代理"
echo ""
echo "💡 提示:"
echo "   - Agent Zero 通过 LiteLLM 支持多种 LLM 提供商"
echo "   - 支持所有 llm-link 的 LLM 提供商"
echo "   - 查看 https://github.com/agent0ai/agent-zero 获取更多信息"
echo "   - 对于本地模型，可以使用 'dummy' 作为 API key"
