#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  cat <<'USAGE'
用法：scripts/start-zed-glm4.sh <ZHIPU_API_KEY> [附加 llm-link 参数]
示例：scripts/start-zed-glm4.sh "your-zhipu-api-key" --port 11434

该脚本会以 Ollama 协议启动 Zed 服务，后端使用智谱 GLM-4.6 模型。
GLM-4.6 是智谱 AI 的最新旗舰模型，具有 200K 上下文和强大的代码理解生成能力。

环境变量：
  LLM_LINK_BIN - llm-link 二进制文件路径 (默认: ./target/release/llm-link)
  MODEL        - 模型名称 (默认: glm-4.6)
  RUST_LOG     - 日志级别 (推荐: info 或 debug)

示例：
  # 基本启动
  scripts/start-zed-glm4.sh "your-api-key"

  # 指定端口和调试日志
  RUST_LOG=debug scripts/start-zed-glm4.sh "your-api-key" --port 11434

  # 使用不同的 GLM 模型
  MODEL=glm-4.5-flash scripts/start-zed-glm4.sh "your-api-key"
USAGE
  exit 1
fi

ZHIPU_API_KEY="$1"
shift

# 检查 API 密钥格式
if [[ ! "${ZHIPU_API_KEY}" =~ ^[a-zA-Z0-9._-]+$ ]]; then
  echo "⚠️  警告：API 密钥格式可能不正确"
  echo "   智谱 API 密钥通常是字母数字组合"
fi

LLM_LINK_BIN=${LLM_LINK_BIN:-"./target/release/llm-link"}

# 检查并构建 llm-link
if [[ ! -x "${LLM_LINK_BIN}" ]]; then
  echo "🔧 未找到 ${LLM_LINK_BIN}，正在执行 cargo build --release..."
  cargo build --release
fi

# 默认使用 GLM-4.6，这是智谱最新的旗舰模型，200K上下文
MODEL=${MODEL:-"glm-4.6"}

# 检查用户是否指定了自定义模型
args=("$@")
user_model_flag=false
for ((i=0; i<${#args[@]}; i++)); do
  case "${args[$i]}" in
    --model|--model=*)
      user_model_flag=true
      break
      ;;
  esac
done

# 构建启动命令
cmd=(
  "${LLM_LINK_BIN}"
  --app zed
  --protocols ollama
  --provider zhipu
  --llm-api-key "${ZHIPU_API_KEY}"
)

# 如果用户没有指定模型，使用默认模型
if [[ "${user_model_flag}" != true ]]; then
  cmd+=(--model "${MODEL}")
fi

# 添加用户指定的额外参数
cmd+=("${args[@]}")

echo "🚀 启动 llm-link 服务..."
echo "📋 提供商: 智谱 AI (ZhipuAI)"
echo "🤖 模型: ${MODEL}"
echo "🌐 协议: Ollama (兼容 Zed)"
echo "🔑 API 密钥: ${ZHIPU_API_KEY:0:8}..."
echo "📝 完整命令: ${cmd[*]}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 执行命令
exec "${cmd[@]}"