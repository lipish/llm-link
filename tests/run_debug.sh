#\!/bin/bash

export ZHIPU_API_KEY=fdf0696f13634dc190c90b6ec8fa862c.aMn26XscIdahZN0G
export LLM_LINK_API_KEY=1012jladpo132321lkalsdfjals1123
export RUST_LOG=debug

echo "🚀 Starting llm-link with DEBUG logging..."
echo "=========================================="
echo ""
echo "Watch for these log messages:"
echo "  • '🔍 Checking for XML in Zhipu response...'"
echo "  • '🔄 Successfully converted XML to JSON in response'"
echo "  • '⏭️  Skipping XML conversion: not a Zhipu provider'"
echo ""
echo "Press Ctrl+C to stop"
echo ""

./target/release/llm-link --app codex-cli 2>&1 | grep --line-buffered -E "(🔍|🔄|⏭️|XML|xml|Zhipu|Provider|apply_response)"
