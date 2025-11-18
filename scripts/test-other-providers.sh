#!/usr/bin/env bash
# 测试其他 LLM 提供商的脚本

set -euo pipefail

echo "🧪 测试其他 LLM 提供商"
echo "======================="
echo ""

# 检查 llm-link 二进制文件
LLM_LINK_BIN="./target/release/llm-link"
if [[ ! -x "$LLM_LINK_BIN" ]]; then
    echo "🔧 构建 llm-link..."
    cargo build --release
fi

echo "📋 支持的提供商列表："
echo "===================="

# 定义提供商信息函数
get_provider_info() {
    local provider=$1
    case $provider in
        "openai")
            echo "OpenAI GPT 模型|gpt-4o|OPENAI_API_KEY"
            ;;
        "anthropic")
            echo "Anthropic Claude 模型|claude-3-5-sonnet-20241022|ANTHROPIC_API_KEY"
            ;;
        "aliyun")
            echo "阿里云通义千问模型|qwen3-coder-plus|ALIYUN_API_KEY"
            ;;
        "volcengine")
            echo "火山引擎豆包模型|doubao-seed-1.6|VOLCENGINE_API_KEY"
            ;;
        "tencent")
            echo "腾讯混元模型|hunyuan-turbos-latest|TENCENT_API_KEY"
            ;;
        "moonshot")
            echo "月之暗面 Kimi 模型|kimi-k2-turbo-preview|MOONSHOT_API_KEY"
            ;;
        "minimax")
            echo "MiniMax 模型|MiniMax-M2|MINIMAX_API_KEY"
            ;;
        "longcat")
            echo "LongCat 模型|LongCat-Flash-Chat|LONGCAT_API_KEY"
            ;;
        "ollama")
            echo "本地 Ollama 模型|llama3.2|无需 API 密钥"
            ;;
    esac
}

for provider in openai anthropic aliyun volcengine tencent moonshot minimax longcat ollama; do
    info=$(get_provider_info $provider)
    IFS='|' read -r description model env_var <<< "$info"

    echo ""
    echo "🔹 $provider"
    echo "   描述: $description"
    echo "   推荐模型: $model"
    echo "   环境变量: $env_var"
    echo "   启动命令:"

    if [[ "$provider" == "ollama" ]]; then
        echo "     # 需要先启动本地 Ollama 服务"
        echo "     ollama serve"
        echo "     $LLM_LINK_BIN --app zed --provider ollama --model $model"
    else
        echo "     export $env_var=\"your-api-key\""
        echo "     $LLM_LINK_BIN --app zed --provider $provider --model $model --llm-api-key \"\$$env_var\""
    fi
done

echo ""
echo "🎯 快速测试脚本："
echo "================"
echo ""

cat << 'EOF'
# 创建测试脚本
create_test_script() {
    local provider=$1
    local model=$2
    local api_key=$3
    
    cat > "test_${provider}.sh" << SCRIPT
#!/bin/bash
echo "🧪 测试 $provider - $model"
./target/release/llm-link \\
  --app zed \\
  --provider $provider \\
  --model $model \\
  --llm-api-key "$api_key" &

PID=\$!
echo "📝 服务 PID: \$PID"
sleep 3

echo "📋 测试模型列表:"
curl -s http://localhost:11434/api/tags | jq '.models[] | .name' | head -5

echo "🧹 停止服务"
kill \$PID 2>/dev/null || true
SCRIPT
    chmod +x "test_${provider}.sh"
    echo "✅ 创建了 test_${provider}.sh"
}

# 使用示例:
# create_test_script "openai" "gpt-4o" "your-openai-key"
# create_test_script "anthropic" "claude-3-5-sonnet-20241022" "your-anthropic-key"
EOF

echo ""
echo "💡 使用建议："
echo "============"
echo ""
echo "1. 🔑 获取 API 密钥："
echo "   - OpenAI: https://platform.openai.com/api-keys"
echo "   - Anthropic: https://console.anthropic.com/"
echo "   - 阿里云: https://dashscope.aliyun.com/"
echo "   - 火山引擎: https://console.volcengine.com/"
echo "   - 腾讯云: https://cloud.tencent.com/product/hunyuan"
echo "   - 月之暗面: https://platform.moonshot.cn/"
echo ""
echo "2. 🚀 快速启动（以 OpenAI 为例）："
echo "   export OPENAI_API_KEY=\"your-key\""
echo "   ./target/release/llm-link --app zed --provider openai --model gpt-4o --llm-api-key \"\$OPENAI_API_KEY\""
echo ""
echo "3. 🔄 在 Zed 中切换："
echo "   - 停止当前服务 (Ctrl+C)"
echo "   - 启动新的提供商服务"
echo "   - 重启 Zed 或重新打开 AI 助手面板"
echo ""
echo "4. ✅ 验证连接："
echo "   curl http://localhost:11434/api/tags"
