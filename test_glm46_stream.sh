#!/bin/bash

# Test GLM-4.6 streaming response directly

curl -N https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: Bearer 5e8e8e8e8e8e8e8e8e8e8e8e8e8e8e8e.8e8e8e8e8e8e8e8e" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4.6",
    "messages": [{"role": "user", "content": "你好"}],
    "stream": true
  }' 2>&1 | head -20

