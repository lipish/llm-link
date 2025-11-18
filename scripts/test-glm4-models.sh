#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  cat <<'USAGE'
用法：scripts/test-glm4-models.sh <ZHIPU_API_KEY>

该脚本会测试不同的 GLM-4 模型，帮助你选择最适合的模型。

可用的 GLM-4 模型：
  - glm-4.6         : 最新旗舰模型，200K上下文，推荐用于代码任务
  - glm-4.5         : 强大推理和代码生成，128K上下文
  - glm-4.5-flash   : 快速响应版本，适合简单任务
  - glm-4.5-air     : 轻量版本，平衡性能和速度
  - glm-4.5-airx    : 扩展版本，更强的推理能力
  - glm-4.5-x       : 超快版本，128K上下文

示例：
  scripts/test-glm4-models.sh "your-zhipu-api-key"
USAGE
  exit 1
fi

ZHIPU_API_KEY="$1"

echo "🧪 测试 GLM-4 模型可用性..."
echo "🔑 API 密钥: ${ZHIPU_API_KEY:0:8}..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 测试模型列表
models=(
  "glm-4.6"
  "glm-4.5"
  "glm-4.5-flash"
  "glm-4.5-air"
  "glm-4.5-airx"
  "glm-4.5-x"
)

LLM_LINK_BIN=${LLM_LINK_BIN:-"./target/release/llm-link"}

# 检查并构建 llm-link
if [[ ! -x "${LLM_LINK_BIN}" ]]; then
  echo "🔧 构建 llm-link..."
  cargo build --release
fi

test_message='{"model":"MODEL_NAME","messages":[{"role":"user","content":"Hello, please respond with just: GLM-4 is working!"}],"stream":false}'

for model in "${models[@]}"; do
  echo "📋 测试模型: $model"
  
  # 启动服务（后台）
  "${LLM_LINK_BIN}" \
    --protocols ollama \
    --provider zhipu \
    --model "$model" \
    --llm-api-key "${ZHIPU_API_KEY}" \
    --port 11435 > /tmp/llm-link-test.log 2>&1 &
  
  server_pid=$!
  
  # 等待服务启动
  sleep 3
  
  # 测试请求
  test_payload="${test_message//MODEL_NAME/$model}"
  
  if response=$(curl -s -X POST http://localhost:11435/api/chat \
    -H "Content-Type: application/json" \
    -d "$test_payload" 2>/dev/null); then
    
    if echo "$response" | grep -q "GLM-4 is working"; then
      echo "  ✅ $model - 工作正常"
    elif echo "$response" | grep -q "error"; then
      echo "  ❌ $model - 错误: $(echo "$response" | jq -r '.error // "未知错误"' 2>/dev/null || echo "解析错误")"
    else
      echo "  ⚠️  $model - 响应异常: ${response:0:100}..."
    fi
  else
    echo "  ❌ $model - 连接失败"
  fi
  
  # 停止服务
  kill $server_pid 2>/dev/null || true
  wait $server_pid 2>/dev/null || true
  
  sleep 1
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 推荐："
echo "  - 代码任务: glm-4.6 (最新旗舰，200K上下文)"
echo "  - 快速响应: glm-4.5-flash (速度优先)"
echo "  - 平衡选择: glm-4.5-air (性能与速度平衡)"
echo ""
echo "💡 使用推荐模型启动服务："
echo "  scripts/start-zed-glm4.sh \"$ZHIPU_API_KEY\""
echo "  MODEL=glm-4.5-flash scripts/start-zed-glm4.sh \"$ZHIPU_API_KEY\""
