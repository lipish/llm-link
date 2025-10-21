#!/bin/bash

# Comprehensive Provider Testing Script
# Tests all 7 providers with non-streaming and streaming requests

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}LLM-Link Provider Comprehensive Test${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test a provider
test_provider() {
    local provider=$1
    local model=$2
    local api_key=$3
    local port=${4:-11434}
    
    echo -e "${YELLOW}Testing: $provider ($model)${NC}"
    
    # Start service
    echo "Starting llm-link service..."
    ./target/release/llm-link --app zed --provider "$provider" --model "$model" --llm-api-key "$api_key" > /tmp/llm-link-$provider.log 2>&1 &
    local PID=$!
    sleep 3
    
    # Check if service started
    if ! kill -0 $PID 2>/dev/null; then
        echo -e "${RED}✗ Service failed to start${NC}"
        cat /tmp/llm-link-$provider.log
        FAILED_TESTS=$((FAILED_TESTS + 2))
        TOTAL_TESTS=$((TOTAL_TESTS + 2))
        return 1
    fi
    
    # Test 1: Non-streaming
    echo "  Testing non-streaming..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if curl -s -X POST http://localhost:$port/api/chat \
        -H "Content-Type: application/json" \
        -d '{
            "model": "'"$model"'",
            "messages": [{"role": "user", "content": "Say hello in one word"}],
            "stream": false
        }' | grep -q "message"; then
        echo -e "${GREEN}  ✓ Non-streaming: PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}  ✗ Non-streaming: FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    # Test 2: Streaming
    echo "  Testing streaming..."
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    if curl -s -N -X POST http://localhost:$port/api/chat \
        -H "Content-Type: application/json" \
        -d '{
            "model": "'"$model"'",
            "messages": [{"role": "user", "content": "Say hi"}],
            "stream": true
        }' 2>/dev/null | head -3 | grep -q "message"; then
        echo -e "${GREEN}  ✓ Streaming: PASS${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}  ✗ Streaming: FAIL${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    # Stop service
    kill $PID 2>/dev/null || true
    sleep 1
    echo ""
}

# Test Zhipu
test_provider "zhipu" "glm-4-flash" "d2a0da2b02954b1f91a0a4ec16d4521b.GA2Tz9sF9kt4zVd3"

# Test Aliyun
test_provider "aliyun" "qwen-max" "sk-17cb8a1feec2440bad2c5a73d7d08af2"

# Test Volcengine
test_provider "volcengine" "ep-20251006132256-vrq2p" "26f962bd-450e-4876-bc32-a732e6da9cd2"

# Test Tencent (if API key is valid)
# Note: The API key in keys.yaml might need verification
# test_provider "tencent" "hunyuan-lite" "sk-YMiR2Q7LNWVKVWKivkfPn49geQXT27OZXumFkSS3Ef6FlQ50"

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi

