#!/usr/bin/env bash
# 测试 Anthropic Claude 模型的脚本

set -euo pipefail

if [[ $# -lt 1 ]]; then
  cat <<'USAGE'
用法：scripts/test-claude.sh <ANTHROPIC_API_KEY> [MODEL]

测试 Anthropic Claude 模型与 Zed 的集成。

参数：
  ANTHROPIC_API_KEY - Anthropic API 密钥
  MODEL             - 模型名称 (默认: claude-3-5-sonnet-20241022)

可用模型：
  claude-3-5-sonnet-20241022 - 最智能的模型 ⭐
  claude-3-opus-20240229     - 强大的复杂任务处理
  claude-3-sonnet-20240229   - 平衡性能
  claude-3-haiku-20240307    - 快速紧凑

示例：
  scripts/test-claude.sh "sk-ant-xxx"
  scripts/test-claude.sh "sk-ant-xxx" claude-3-opus-20240229
  scripts/test-claude.sh "sk-ant-xxx" claude-3-haiku-20240307

环境变量：
  RUST_LOG=debug  # 启用调试日志
USAGE
  exit 1
fi

ANTHROPIC_API_KEY="$1"
MODEL="${2:-claude-3-5-sonnet-20241022}"

# 验证 API 密钥格式
if [[ ! "${ANTHROPIC_API_KEY}" =~ ^sk-ant-[a-zA-Z0-9_-]+$ ]]; then
  echo "⚠️  警告：API 密钥格式可能不正确"
  echo "   Anthropic API 密钥通常以 'sk-ant-' 开头"
fi

LLM_LINK_BIN="./target/release/llm-link"

# 检查并构建 llm-link
if [[ ! -x "${LLM_LINK_BIN}" ]]; then
  echo "🔧 构建 llm-link..."
  cargo build --release
fi

# 检查端口是否被占用
if lsof -Pi :11434 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "⚠️  警告：端口 11434 已被占用"
  echo "请停止占用该端口的服务或使用其他端口"
  exit 1
fi

echo "🚀 启动 Claude + Zed 服务"
echo "========================"
echo "📋 提供商: Anthropic"
echo "🤖 模型:   $MODEL"
echo "🌐 端口:   11434"
echo "🔗 协议:   Ollama (兼容 Zed)"
echo "🔑 API:    ${ANTHROPIC_API_KEY:0:12}..."
echo "========================"
echo ""
echo "💡 在 Zed 中配置："
echo "   1. 打开 Zed 设置"
echo "   2. 配置 LLM 服务器: http://localhost:11434"
echo "   3. 模型名称: $MODEL"
echo ""
echo "🛑 停止服务: Ctrl+C"
echo "========================"

# 启动服务
exec "${LLM_LINK_BIN}" \
  --app zed \
  --protocols ollama \
  --provider anthropic \
  --model "$MODEL" \
  --llm-api-key "${ANTHROPIC_API_KEY}"
