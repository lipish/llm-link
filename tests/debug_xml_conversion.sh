#!/bin/bash

# XML 转换调试脚本

echo "🔍 XML Conversion Debug Script"
echo "=============================="
echo ""

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}请回答以下问题来帮助排查：${NC}"
echo ""

echo "1️⃣  你在哪里看到的 XML？"
echo "   a) Codex CLI 的输出"
echo "   b) curl 测试的响应"
echo "   c) 服务端日志"
echo ""

echo "2️⃣  你是如何启动服务的？"
echo "   请提供完整的启动命令，例如："
echo "   ./target/release/llm-link --app codex-cli --api-key 'xxx'"
echo ""

echo "3️⃣  你的配置是什么？"
echo "   a) 使用 --app 参数（哪个 app？）"
echo "   b) 使用配置文件（请提供配置内容）"
echo ""

echo "4️⃣  请检查以下内容："
echo ""

echo -e "${YELLOW}检查 1: 确认使用的是最新构建${NC}"
ls -lh target/release/llm-link
echo ""

echo -e "${YELLOW}检查 2: 确认 llm_backend 是 Zhipu${NC}"
echo "如果你使用 --app codex-cli，默认应该是 Zhipu"
echo "请检查启动日志中的 backend 信息"
echo ""

echo -e "${YELLOW}检查 3: 启用 DEBUG 日志重新启动${NC}"
echo "运行以下命令："
echo -e "${GREEN}RUST_LOG=debug ./target/release/llm-link --app codex-cli --api-key 'test'${NC}"
echo ""
echo "然后查找以下日志："
echo "  • '🔍 Checking for XML in Zhipu response...'"
echo "  • '🔄 Successfully converted XML to JSON in response'"
echo "  • '⏭️  Skipping XML conversion: not a Zhipu provider'"
echo ""

echo -e "${YELLOW}检查 4: 测试 XML 转换函数${NC}"
echo "运行单元测试："
echo -e "${GREEN}cargo test test_xml_wrapped_json -- --nocapture${NC}"
echo ""

echo -e "${YELLOW}检查 5: 查看完整的响应${NC}"
echo "如果你使用 curl 测试，请添加 -v 参数查看完整响应："
echo -e "${GREEN}curl -v -X POST http://localhost:8088/v1/chat/completions \\
  -H 'Authorization: Bearer test' \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"model\": \"glm-4-flash\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}],
    \"stream\": false
  }'${NC}"
echo ""

echo "=============================="
echo -e "${BLUE}调试提示：${NC}"
echo ""
echo "如果日志中显示："
echo -e "${GREEN}  '🔍 Checking for XML in Zhipu response...'${NC}"
echo "  → 说明 Provider 检测正确，正在尝试转换"
echo ""
echo -e "${GREEN}  '🔄 Successfully converted XML to JSON in response'${NC}"
echo "  → 说明转换成功了"
echo ""
echo -e "${RED}  '⏭️  Skipping XML conversion: not a Zhipu provider'${NC}"
echo "  → 说明 Provider 不是 Zhipu，请检查配置"
echo ""
echo -e "${RED}  没有任何 XML 相关日志${NC}"
echo "  → 说明可能没有调用 apply_response_adaptations"
echo "  → 或者日志级别不够（需要 RUST_LOG=debug）"
echo ""

echo "=============================="
echo -e "${BLUE}可能的原因：${NC}"
echo ""
echo "1. 使用了旧的二进制文件"
echo "   → 解决：重新构建 cargo build --release"
echo ""
echo "2. Provider 不是 Zhipu"
echo "   → 解决：确认使用 --app codex-cli 或配置 llm_backend: Zhipu"
echo ""
echo "3. XML 在流式响应的后续块中"
echo "   → 解决：每个块都会被处理，应该会转换"
echo ""
echo "4. XML 格式不匹配"
echo "   → 解决：查看实际的 XML 格式，可能需要调整检测逻辑"
echo ""
echo "5. 日志级别不够"
echo "   → 解决：使用 RUST_LOG=debug 启动"
echo ""

echo "=============================="
echo -e "${YELLOW}下一步：${NC}"
echo ""
echo "1. 使用 RUST_LOG=debug 重新启动服务"
echo "2. 发送一个测试请求"
echo "3. 查看日志中的 XML 相关信息"
echo "4. 将日志发给我，我帮你分析"
echo ""

