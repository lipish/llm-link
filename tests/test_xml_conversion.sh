#!/bin/bash

# XML 转换功能测试脚本

echo "🧪 Testing XML to JSON Conversion Feature"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 测试 1: 单元测试
echo "📋 Test 1: Running unit tests..."
echo "--------------------------------"
cargo test utils::xml --lib -- --quiet
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Unit tests passed${NC}"
else
    echo -e "${RED}❌ Unit tests failed${NC}"
    exit 1
fi
echo ""

# 测试 2: 构建检查
echo "📋 Test 2: Building release version..."
echo "--------------------------------"
cargo build --release --quiet
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# 测试 3: 检查环境变量
echo "📋 Test 3: Checking environment..."
echo "--------------------------------"
if [ -z "$ZHIPU_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  ZHIPU_API_KEY not set${NC}"
    echo "Please set it with: export ZHIPU_API_KEY='your-key'"
    echo ""
    echo "You can still run the service, but API calls will fail."
    echo ""
else
    echo -e "${GREEN}✅ ZHIPU_API_KEY is set${NC}"
fi
echo ""

# 测试 4: 显示启动命令
echo "📋 Test 4: Service startup commands"
echo "--------------------------------"
echo ""
echo "To test with Codex CLI (OpenAI API):"
echo -e "${YELLOW}./target/release/llm-link --app codex-cli --api-key 'test-token'${NC}"
echo ""
echo "To test with Zed.dev (Ollama API):"
echo -e "${YELLOW}./target/release/llm-link --app zed-dev${NC}"
echo ""
echo "To test with debug logging:"
echo -e "${YELLOW}RUST_LOG=debug ./target/release/llm-link --app codex-cli --api-key 'test-token'${NC}"
echo ""

# 测试 5: 显示测试命令
echo "📋 Test 5: API test commands"
echo "--------------------------------"
echo ""
echo "After starting the service, test with:"
echo ""
echo "1. Standard client (should convert XML to JSON):"
echo -e "${YELLOW}curl -X POST http://localhost:8088/v1/chat/completions \\
  -H 'Authorization: Bearer test-token' \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"model\": \"glm-4-flash\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}]
  }'${NC}"
echo ""
echo "2. Zhipu native client (should preserve XML):"
echo -e "${YELLOW}curl -X POST http://localhost:8088/v1/chat/completions \\
  -H 'Authorization: Bearer test-token' \\
  -H 'x-client: zhipu-native' \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"model\": \"glm-4-flash\",
    \"messages\": [{\"role\": \"user\", \"content\": \"Hello\"}]
  }'${NC}"
echo ""

# 测试 6: 日志检查提示
echo "📋 Test 6: What to look for in logs"
echo "--------------------------------"
echo ""
echo "When running with RUST_LOG=debug, look for:"
echo ""
echo -e "${GREEN}✅ Success indicators:${NC}"
echo "  • '🔄 Attempting to convert XML to JSON'"
echo "  • '✅ Detected JSON wrapped in XML tags'"
echo "  • '🔄 Successfully converted XML to JSON in response'"
echo ""
echo -e "${YELLOW}⚠️  Zhipu native mode:${NC}"
echo "  • '🔧 ZhipuNative adapter: preserving original XML format'"
echo ""

# 总结
echo "=========================================="
echo -e "${GREEN}🎉 All checks passed!${NC}"
echo ""
echo "Next steps:"
echo "1. Start the service with one of the commands above"
echo "2. Send a test request using curl"
echo "3. Check the response - XML should be converted to JSON"
echo "4. Check the logs for conversion messages"
echo ""
echo "For more details, see:"
echo "  • docs/ZHIPU_XML_CONVERSION.md"
echo "  • docs/ARCHITECTURE.md"
echo ""

