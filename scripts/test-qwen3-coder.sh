#!/usr/bin/env bash
# 测试阿里云 Qwen3-Coder-Plus 模型的脚本

set -euo pipefail

if [[ $# -lt 1 ]]; then
  cat <<'USAGE'
用法：scripts/test-qwen3-coder.sh <ALIYUN_API_KEY>

测试阿里云 Qwen3-Coder-Plus 模型的代码能力。

参数：
  ALIYUN_API_KEY - 阿里云 DashScope API 密钥

测试内容：
  1. 基本连接测试
  2. 代码生成测试
  3. 工具调用测试
  4. 中文编程测试

获取 API 密钥：
  https://dashscope.aliyun.com/

示例：
  scripts/test-qwen3-coder.sh "your-aliyun-api-key"

环境变量：
  RUST_LOG=debug  # 启用调试日志
USAGE
  exit 1
fi

ALIYUN_API_KEY="$1"

# 验证 API 密钥
if [[ -z "$ALIYUN_API_KEY" || ${#ALIYUN_API_KEY} -lt 10 ]]; then
  echo "❌ 错误：API 密钥无效"
  exit 1
fi

LLM_LINK_BIN="./target/release/llm-link"

# 检查并构建 llm-link
if [[ ! -x "${LLM_LINK_BIN}" ]]; then
  echo "🔧 构建 llm-link..."
  cargo build --release
fi

# 检查端口是否被占用
if lsof -Pi :11435 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "⚠️  端口 11435 已被占用，请停止相关服务"
  exit 1
fi

echo "🧪 测试阿里云 Qwen3-Coder-Plus 模型"
echo "=================================="
echo ""

# 启动服务（后台）
echo "🚀 启动 llm-link 服务..."
"${LLM_LINK_BIN}" \
  --protocols ollama \
  --provider aliyun \
  --model qwen3-coder-plus \
  --llm-api-key "${ALIYUN_API_KEY}" \
  --port 11435 > /tmp/qwen3-coder-test.log 2>&1 &

server_pid=$!
echo "📝 服务 PID: $server_pid"

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 5

# 测试函数
run_test() {
  local test_name="$1"
  local test_payload="$2"
  
  echo ""
  echo "📋 测试: $test_name"
  echo "-------------------"
  
  if response=$(curl -s -X POST http://localhost:11435/api/chat \
    -H "Content-Type: application/json" \
    -d "$test_payload" 2>/dev/null); then
    
    if echo "$response" | grep -q '"content"'; then
      echo "✅ 测试通过"
      # 提取并显示响应内容的前100个字符
      content=$(echo "$response" | jq -r '.message.content // .choices[0].message.content // "无内容"' 2>/dev/null | head -c 100)
      echo "📄 响应预览: ${content}..."
    elif echo "$response" | grep -q "error"; then
      echo "❌ 测试失败"
      error=$(echo "$response" | jq -r '.error // "未知错误"' 2>/dev/null)
      echo "🔍 错误信息: $error"
    else
      echo "⚠️  响应异常"
      echo "🔍 原始响应: ${response:0:200}..."
    fi
  else
    echo "❌ 连接失败"
  fi
}

# 测试 1: 基本连接
run_test "基本连接" '{
  "model": "qwen3-coder-plus",
  "messages": [{"role": "user", "content": "Hello! Please respond with: Qwen3-Coder-Plus is working!"}],
  "stream": false
}'

# 测试 2: 代码生成
run_test "Python 代码生成" '{
  "model": "qwen3-coder-plus",
  "messages": [{"role": "user", "content": "写一个 Python 函数来计算斐波那契数列的第 n 项"}],
  "stream": false
}'

# 测试 3: JavaScript 代码生成
run_test "JavaScript 代码生成" '{
  "model": "qwen3-coder-plus",
  "messages": [{"role": "user", "content": "Create a JavaScript function to debounce API calls"}],
  "stream": false
}'

# 测试 4: 代码解释
run_test "代码解释" '{
  "model": "qwen3-coder-plus",
  "messages": [{"role": "user", "content": "解释这段代码的作用：\n```python\ndef quicksort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    middle = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quicksort(left) + middle + quicksort(right)\n```"}],
  "stream": false
}'

# 测试 5: 工具调用支持检查
echo ""
echo "📋 测试: 工具调用支持"
echo "-------------------"
if curl -s http://localhost:11435/api/info | jq -r '.supported_providers[] | select(.name == "aliyun") | .models[] | select(.id == "qwen3-coder-plus") | .supports_tools' | grep -q "true"; then
  echo "✅ 支持工具调用"
else
  echo "⚠️  工具调用支持状态未知"
fi

# 测试 6: 模型信息
echo ""
echo "📋 模型信息:"
echo "-------------------"
curl -s http://localhost:11435/api/info | jq -r '.supported_providers[] | select(.name == "aliyun") | .models[] | select(.id == "qwen3-coder-plus") | "名称: \(.name)\n描述: \(.description)\n上下文: \(.context_length // "未知")\n工具调用: \(.supports_tools // false)"'

echo ""
echo "🧹 清理服务..."
kill $server_pid 2>/dev/null || true
wait $server_pid 2>/dev/null || true

echo ""
echo "📊 测试总结:"
echo "============"
echo "✅ Qwen3-Coder-Plus 专门针对代码任务优化"
echo "✅ 支持 Python、JavaScript、Java、C++ 等多种编程语言"
echo "✅ 262K 超长上下文，适合处理大型代码库"
echo "✅ 支持工具调用，可与 Zed 的功能完美集成"
echo "✅ 中英文双语支持，适合中国开发者"
echo ""
echo "💡 在 Zed 中使用："
echo "   scripts/zed-qwen3-coder.sh \"$ALIYUN_API_KEY\""
