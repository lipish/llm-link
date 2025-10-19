#!/bin/bash

# 检查实际使用的 Provider

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G
export LLM_LINK_API_KEY=1012jladpo132321lkalsdfjals1123

echo "🔍 Checking Actual Provider Configuration"
echo "=========================================="
echo ""

# 启动服务并捕获启动日志
echo "1️⃣  Starting service and checking configuration..."
timeout 5 ./target/release/llm-link --app codex-cli 2>&1 | grep -E "(Provider|Backend|Zhipu|OpenAI|Anthropic|Claude)" | head -20

echo ""
echo "2️⃣  Checking app configuration in code..."
echo ""

# 查看 codex-cli 的配置
grep -A 20 "fn codex_cli_config" src/apps.rs | grep -E "(llm_backend|Zhipu|OpenAI|Anthropic)"

echo ""
echo "3️⃣  Analysis:"
echo "=========================================="
echo ""

echo "Based on the XML format you're seeing:"
echo ""
echo "  <function_calls>"
echo "    <invoke name=\"shell\">"
echo "      <parameter name=\"command\">ls -la</parameter>"
echo "    </invoke>"
echo "  </function_calls>"
echo ""
echo "This is Anthropic Claude's MCP (Model Context Protocol) format!"
echo ""
echo "Possible reasons:"
echo ""
echo "1. Codex is configured to use Claude/Anthropic backend"
echo "   → Check Codex's own configuration"
echo ""
echo "2. Codex is bypassing llm-link and calling Claude directly"
echo "   → Check if Codex has ANTHROPIC_API_KEY set"
echo ""
echo "3. The response is from a different source"
echo "   → Check network traffic"
echo ""

echo "4️⃣  Quick test:"
echo "=========================================="
echo ""
echo "Please check:"
echo ""
echo "a) Codex configuration file (usually ~/.config/codex/config.json)"
echo "   Look for 'provider' or 'model' settings"
echo ""
echo "b) Environment variables:"
env | grep -E "(ANTHROPIC|CLAUDE|OPENAI|ZHIPU)" || echo "   No AI-related env vars found"
echo ""
echo "c) Is Codex actually using llm-link?"
echo "   Check if requests are hitting http://localhost:8088"
echo ""

