# Codex CLI Setup Guide for LLM Link

This guide shows how to set up Codex CLI with your current configuration that includes both direct Zhipu API access and LLM Link proxy.

## Environment Variables Setup

You need to set up environment variables for both providers:

```bash
# For direct Zhipu API connection (z_ai provider)
export Z_AI_API_KEY="your-zhipu-api-key"

# For LLM Link proxy (llm_link provider)
export LLM_LINK_API_KEY="your-secret-token"

# For LLM Link backend (same as Z_AI_API_KEY is fine)
export ZHIPU_API_KEY="your-zhipu-api-key"
```

## Start LLM Link

Choose the configuration that best fits your needs:

### Pure OpenAI API for Codex CLI
```bash
# Start LLM Link with ONLY OpenAI API on port 8088
./target/release/llm-link --config configs/config-codex.yaml
```

## Your Current Codex Configuration

Based on your `config.toml`, you have:

### Provider 1: Direct Zhipu API
```toml
[model_providers.z_ai]
name = "z.ai - GLM Coding Plan"
base_url = "https://open.bigmodel.cn/api/paas/v4/"
env_key = "Z_AI_API_KEY"

[profiles.glm_4_5]
model = "glm-4.5"
model_provider = "z_ai"
```

### Provider 2: LLM Link Proxy
```toml
[model_providers.llm_link]
name = "LLM Link"
base_url = "http://localhost:8088/v1"
env_key = "LLM_LINK_API_KEY"

[profiles.glm_4_flash]
model = "glm-4-flash"
model_provider = "llm_link"

[profiles.glm_4_plus]
model = "glm-4-plus"
model_provider = "llm_link"
```

## Usage Examples

### Using Direct Connection
```bash
# This goes directly to Zhipu API
codex --profile glm_4_5 "Write a Python function to calculate fibonacci"
```

### Using LLM Link Proxy
```bash
# This goes through LLM Link proxy
codex --profile glm_4_flash "Write a Python function to calculate fibonacci"
codex --profile glm_4_plus "Refactor this code to use async/await patterns"
```

## Benefits of Each Approach

### Direct Connection (z_ai provider)
- ✅ Direct access to Zhipu API
- ✅ No additional proxy layer
- ✅ Access to latest models like glm-4.5

### LLM Link Proxy (llm_link provider)
- ✅ Additional logging and monitoring
- ✅ Bearer token authentication
- ✅ Pure OpenAI protocol compliance (no Ollama interference)
- ✅ Request/response transformation capabilities
- ✅ Optimized for Codex CLI usage

## Troubleshooting

### Check LLM Link Status
```bash
# Test models endpoint
curl -H "Authorization: Bearer your-secret-token" \
     http://localhost:11434/v1/models

# Check LLM Link logs for any errors
```

### Check Environment Variables
```bash
echo $Z_AI_API_KEY
echo $LLM_LINK_API_KEY
echo $ZHIPU_API_KEY
```

### Test Direct API Access
```bash
# Test direct Zhipu API
curl -H "Authorization: Bearer $Z_AI_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model": "glm-4.5", "messages": [{"role": "user", "content": "test"}]}' \
     https://open.bigmodel.cn/api/paas/v4/chat/completions
```
