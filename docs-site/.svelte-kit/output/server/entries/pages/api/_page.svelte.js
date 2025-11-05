import { c as create_ssr_component, v as validate_component, e as escape } from "../../../chunks/ssr.js";
import { I as Icon, B as Button, G as Github } from "../../../chunks/github.js";
import { b as base } from "../../../chunks/paths.js";
import { S as Settings, G as Globe, K as Key, T as Terminal } from "../../../chunks/terminal.js";
import { C as Code, Z as Zap } from "../../../chunks/zap.js";
const Book_open = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
      }
    ],
    [
      "path",
      {
        "d": "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "book-open" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const BookOpen = Book_open;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  const apiExamples = {
    models: `# Get all available models
curl -X GET http://localhost:8088/api/models

# Get models for specific provider
curl -X GET http://localhost:8088/api/models?provider=openai

# Response example
{
  "providers": {
    "openai": [
      {
        "id": "gpt-4",
        "name": "GPT-4",
        "description": "Most capable model",
        "context_length": 8192,
        "pricing": { "input": 0.03, "output": 0.06 }
      }
    ],
    "anthropic": [
      {
        "id": "claude-3-5-sonnet",
        "name": "Claude 3.5 Sonnet",
        "description": "Latest Claude model",
        "context_length": 200000,
        "pricing": { "input": 0.003, "output": 0.015 }
      }
    ]
  }
}`,
    supportedModels: `# Get all supported models (static list)
curl -X GET http://localhost:8088/api/supported-models

# Get supported models for specific provider
curl -X GET http://localhost:8088/api/supported-models?provider=openai

# Response example
{
  "supported_models": {
    "openai": [
      {
        "id": "gpt-4",
        "name": "GPT-4",
        "display_name": "GPT-4",
        "description": "Most capable GPT-4 model",
        "context_length": 8192,
        "max_output_tokens": 4096,
        "input_price": 0.03,
        "output_price": 0.06,
        "capabilities": ["chat", "completion", "function_calling", "vision"],
        "status": "available"
      }
    ],
    "anthropic": [
      {
        "id": "claude-3-5-sonnet",
        "name": "Claude 3.5 Sonnet",
        "display_name": "claude-3-5-sonnet-20241022",
        "description": "Latest Claude model with improved capabilities",
        "context_length": 200000,
        "max_output_tokens": 8192,
        "input_price": 0.003,
        "output_price": 0.015,
        "capabilities": ["chat", "vision", "long_context"],
        "status": "available"
      }
    ]
  },
  "total_models": 45,
  "last_updated": "2025-01-15T10:00:00Z"
}`,
    providerList: `# Get list of all supported providers
curl -X GET http://localhost:8088/api/provider-list

# Response example
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "display_name": "OpenAI",
      "description": "Leading AI models including GPT-4, GPT-3.5, and more",
      "api_type": "native",
      "base_url": "https://api.openai.com/v1",
      "requires_api_key": true,
      "env_var": "OPENAI_API_KEY",
      "supported_features": ["streaming", "function_calling", "vision"],
      "models_count": 5,
      "status": "available"
    },
    {
      "id": "anthropic",
      "name": "Anthropic",
      "display_name": "Anthropic",
      "description": "Advanced Claude models with strong reasoning capabilities",
      "api_type": "native",
      "base_url": "https://api.anthropic.com",
      "requires_api_key": true,
      "env_var": "ANTHROPIC_API_KEY",
      "supported_features": ["streaming", "long_context", "vision"],
      "models_count": 3,
      "status": "available"
    },
    {
      "id": "ollama",
      "name": "Ollama",
      "display_name": "Ollama",
      "description": "Local and open-source models",
      "api_type": "native",
      "base_url": "http://localhost:11434",
      "requires_api_key": false,
      "env_var": null,
      "supported_features": ["streaming", "custom_models", "local_deployment"],
      "models_count": 8,
      "status": "available"
    }
  ],
  "total_providers": 10,
  "available_providers": 10
}`,
    currentConfig: `# Get current configuration
curl -X GET http://localhost:8088/api/config/current

# Response example
{
  "provider": "openai",
  "model": "gpt-4",
  "has_api_key": true,
  "has_base_url": false,
  "supports_hot_reload": true
}`,
    validateKey: `# Validate API key before applying
curl -X POST http://localhost:8088/api/config/validate-key \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "openai",
    "api_key": "sk-new-key-here",
    "base_url": "https://api.openai.com/v1"
  }'

# Response example
{
  "status": "valid",
  "message": "API key is valid and ready for hot update",
  "provider": "openai",
  "models": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Most capable GPT-4 model"
    }
  ],
  "supports_hot_reload": true
}`,
    updateKey: `# Update API key without restart (hot reload)
curl -X POST http://localhost:8088/api/config/update-key \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "openai",
    "api_key": "sk-new-key-here",
    "base_url": "https://api.openai.com/v1"
  }'

# Response example
{
  "status": "success",
  "message": "API key updated for provider: openai",
  "provider": "openai",
  "restart_required": false
}`,
    switchProvider: `# Switch to different provider dynamically
curl -X POST http://localhost:8088/api/config/switch-provider \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "api_key": "sk-ant-new-key-here"
  }'

# Response example
{
  "status": "success",
  "message": "Provider switched to: anthropic",
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-20241022",
  "restart_required": false
}`,
    processManagement: `# Get process PID
curl -X GET http://localhost:8088/api/config/pid

# Response example
{
  "pid": 12345,
  "message": "Use this PID to restart the service"
}

# Trigger graceful shutdown
curl -X POST http://localhost:8088/api/config/shutdown

# Response example
{
  "status": "success",
  "message": "Shutdown signal sent. Please restart with new configuration."
}`,
    serviceInfo: `# Get comprehensive service information
curl -X GET http://localhost:8088/api/info

# Response example
{
  "service": "llm-link",
  "version": "0.3.3",
  "current_provider": "openai",
  "current_model": "gpt-4",
  "supported_providers": [
    {
      "name": "openai",
      "models": [
        {
          "id": "gpt-4",
          "name": "GPT-4",
          "description": "Most capable GPT-4 model"
        }
      ]
    }
  ],
  "api_endpoints": {
    "openai": {
      "path": "/v1",
      "enabled": true,
      "auth_required": true
    }
  }
}

# Get health status with instance info
curl -X GET http://localhost:8088/api/health

# Response example
{
  "status": "ok",
  "instance_id": 1729900050,
  "pid": 12345,
  "provider": "openai",
  "model": "gpt-4"
}`,
    providers: `# Get all provider status
curl -X GET http://localhost:8088/api/providers

# Response example
{
  "providers": {
    "openai": {
      "status": "active",
      "configured": true,
      "models_count": 5,
      "api_type": "native",
      "base_url": "https://api.openai.com/v1"
    },
    "anthropic": {
      "status": "active",
      "configured": true,
      "models_count": 3,
      "api_type": "native",
      "base_url": "https://api.anthropic.com"
    },
    "ollama": {
      "status": "active",
      "configured": true,
      "models_count": 8,
      "api_type": "native",
      "base_url": "http://localhost:11434"
    }
  }
}`,
    config: `# Update provider configuration
curl -X POST http://localhost:8088/api/config/update \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "openai",
    "api_key": "sk-new-key-here",
    "base_url": "https://api.openai.com/v1"
  }'

# Update multiple providers
curl -X POST http://localhost:8088/api/config/update \\
  -H "Content-Type: application/json" \\
  -d '{
    "providers": {
      "openai": {
        "api_key": "sk-new-key-here"
      },
      "anthropic": {
        "api_key": "sk-ant-new-key-here"
      }
    }
  }'

# Response example
{
  "success": true,
  "message": "Configuration updated successfully",
  "updated_providers": ["openai", "anthropic"]
}`,
    health: `# Check service health
curl -X GET http://localhost:8088/api/health

# Response example
{
  "status": "healthy",
  "version": "0.3.5",
  "uptime": "2h 30m 15s",
  "active_protocols": ["openai", "anthropic", "ollama"],
  "configured_providers": 10,
  "total_models": 45,
  "system": {
    "cpu_usage": "15%",
    "memory_usage": "120MB",
    "port": 8088
  }
}`,
    openai: `# OpenAI Compatible API - Chat Completions
curl -X POST http://localhost:8088/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ],
    "stream": false,
    "temperature": 0.7
  }'

# Streaming response
curl -X POST http://localhost:8088/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "gpt-4",
    "messages": [
      {
        "role": "user",
        "content": "Write a short story"
      }
    ],
    "stream": true,
    "temperature": 0.7
  }'`,
    anthropic: `# Anthropic Native API - Messages
curl -X POST http://localhost:8088/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "claude-3-5-sonnet",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": "Hello, Claude!"
      }
    ]
  }'

# Streaming response
curl -X POST http://localhost:8088/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '{
    "model": "claude-3-5-sonnet",
    "max_tokens": 1024,
    "stream": true,
    "messages": [
      {
        "role": "user",
        "content": "Explain quantum computing"
      }
    ]
  }'`,
    ollama: `# Ollama Compatible API - Generate
curl -X POST http://localhost:8088/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2",
    "prompt": "Why is the sky blue?",
    "stream": false
  }'

# Streaming response
curl -X POST http://localhost:8088/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2",
    "prompt": "Tell me a story",
    "stream": true
  }'

# Chat endpoint
curl -X POST http://localhost:8088/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "llama2",
    "messages": [
      {
        "role": "user",
        "content": "Hello!"
      }
    ],
    "stream": false
  }'`,
    error: `{
  "error": {
    "type": "invalid_request_error",
    "message": "Invalid API key provided",
    "code": "invalid_api_key"
  }
}`
  };
  return `<div class="container py-8"><div class="max-w-6xl mx-auto"><div class="mb-8" data-svelte-h="svelte-i1l7sj"><h1 class="text-4xl font-bold tracking-tight mb-4">API Reference</h1> <p class="text-lg text-muted-foreground">Complete API documentation for LLM Link. Learn how to interact with all available endpoints,
				manage providers, and integrate with your applications.</p></div>  <section class="mb-12"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(BookOpen, "BookOpen").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-1g1ysmf">API Overview</h2></div> <div class="grid gap-6 md:grid-cols-2" data-svelte-h="svelte-jbwp41"><div><h3 class="text-lg font-medium mb-3">Base URL</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">http://localhost:8088</code></div> <p class="text-sm text-muted-foreground mt-2">Default port is 8088, can be changed with <code>--port</code> flag</p></div> <div><h3 class="text-lg font-medium mb-3">Authentication</h3> <div class="space-y-2"><div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">OpenAI API: Bearer Token</code></div> <div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">Anthropic API: x-api-key Header</code></div> <div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">Management APIs: No Auth Required</code></div></div></div></div></div></section>  <section class="mb-12"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(Settings, "Settings").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-1y5nyj6">Management APIs</h2></div> <div class="space-y-8"> <div><h3 class="text-lg font-medium mb-3 flex items-center">${validate_component(Code, "Code").$$render($$result, { class: "h-4 w-4 mr-2" }, {}, {})}
							Models API</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-16l7pg0">Get available models for all providers or specific provider</p> <div class="space-y-4"><div data-svelte-h="svelte-yy1h00"><h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/models</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/models?provider=openai</code></div></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-nkj2fj">Example Usage</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.models)}</code></div></div></div></div>  <div><h3 class="text-lg font-medium mb-3 flex items-center">${validate_component(Globe, "Globe").$$render($$result, { class: "h-4 w-4 mr-2" }, {}, {})}
							Providers API</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-quw76s">Get status and configuration of all providers</p> <div class="space-y-4"><div data-svelte-h="svelte-kz8v0x"><h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/providers</code></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-nkj2fj">Example Usage</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.providers)}</code></div></div></div></div>  <div><h3 class="text-lg font-medium mb-3 flex items-center">${validate_component(Code, "Code").$$render($$result, { class: "h-4 w-4 mr-2" }, {}, {})}
							Supported Models API</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-12fxrzb">Get static list of all supported models with detailed information</p> <div class="space-y-4"><div data-svelte-h="svelte-q1jqfm"><h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/supported-models</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/supported-models?provider=openai</code></div></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-nkj2fj">Example Usage</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.supportedModels)}</code></div></div></div></div>  <div><h3 class="text-lg font-medium mb-3 flex items-center">${validate_component(Globe, "Globe").$$render($$result, { class: "h-4 w-4 mr-2" }, {}, {})}
							Provider List API</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-qnfcy1">Get list of all supported providers with their capabilities</p> <div class="space-y-4"><div data-svelte-h="svelte-s7238n"><h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/provider-list</code></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-nkj2fj">Example Usage</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.providerList)}</code></div></div></div></div>  <div><h3 class="text-lg font-medium mb-3 flex items-center">${validate_component(Key, "Key").$$render($$result, { class: "h-4 w-4 mr-2" }, {}, {})}
							Configuration Management APIs</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-fdnhn8">Runtime configuration management without service restart</p> <div class="space-y-6"> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-4dtjw1">Get Current Configuration</h4> <div class="bg-muted rounded p-3 mb-3" data-svelte-h="svelte-1bgj05n"><code class="text-xs font-mono">GET /api/config/current</code></div> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.currentConfig)}</code></div></div>  <div><h4 class="font-medium mb-2" data-svelte-h="svelte-55c1r5">Validate API Key</h4> <div class="bg-muted rounded p-3 mb-3" data-svelte-h="svelte-7pxt5i"><code class="text-xs font-mono">POST /api/config/validate-key</code></div> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.validateKey)}</code></div></div>  <div><h4 class="font-medium mb-2" data-svelte-h="svelte-bty523">Update API Key (Hot Reload)</h4> <div class="bg-muted rounded p-3 mb-3" data-svelte-h="svelte-1hv2035"><code class="text-xs font-mono">POST /api/config/update-key</code></div> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.updateKey)}</code></div></div>  <div><h4 class="font-medium mb-2" data-svelte-h="svelte-1pmqm7">Switch Provider</h4> <div class="bg-muted rounded p-3 mb-3" data-svelte-h="svelte-zkg31u"><code class="text-xs font-mono">POST /api/config/switch-provider</code></div> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.switchProvider)}</code></div></div>  <div><h4 class="font-medium mb-2" data-svelte-h="svelte-y95rme">Process Management</h4> <div class="grid gap-2 md:grid-cols-2 mb-3" data-svelte-h="svelte-9lbkdi"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/config/pid</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /api/config/shutdown</code></div></div> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.processManagement)}</code></div></div></div></div>  <div><h3 class="text-lg font-medium mb-3 flex items-center">${validate_component(BookOpen, "BookOpen").$$render($$result, { class: "h-4 w-4 mr-2" }, {}, {})}
							Service Info API</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-ydgcin">Get comprehensive service information and status</p> <div class="space-y-4"><div data-svelte-h="svelte-19ehzvn"><h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/info</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/health</code></div></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-nkj2fj">Example Usage</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.serviceInfo)}</code></div></div></div></div>  <div><h3 class="text-lg font-medium mb-3 flex items-center">${validate_component(Key, "Key").$$render($$result, { class: "h-4 w-4 mr-2" }, {}, {})}
							Configuration API</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-1xl09sv">Update provider configurations without restarting the service</p> <div class="space-y-4"><div data-svelte-h="svelte-1ytj6v"><h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /api/config/update</code></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-nkj2fj">Example Usage</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.config)}</code></div></div></div></div>  <div><h3 class="text-lg font-medium mb-3 flex items-center">${validate_component(Zap, "Zap").$$render($$result, { class: "h-4 w-4 mr-2" }, {}, {})}
							Health API</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-1pp5eqi">Check service health and system status</p> <div class="space-y-4"><div data-svelte-h="svelte-1aymo75"><h4 class="font-medium mb-2">Endpoints</h4> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/health</code></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-nkj2fj">Example Usage</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.health)}</code></div></div></div></div></div></div></section>  <section class="mb-12"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(Terminal, "Terminal").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-1j4ijhn">Protocol APIs</h2></div> <p class="text-sm text-muted-foreground mb-6" data-svelte-h="svelte-z7y22e">LLM Link provides native API compatibility for major LLM providers. 
					Use the same endpoints and authentication as the original services.</p> <div class="space-y-8"> <div><h3 class="text-lg font-medium mb-3" data-svelte-h="svelte-13fg7im">OpenAI Compatible API</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-1cmrc6k">Compatible with OpenAI&#39;s API format for OpenAI, Zhipu AI, Longcat, Moonshot, and Minimax providers</p> <div class="space-y-4"><div data-svelte-h="svelte-dsp2r9"><h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /v1/chat/completions</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /v1/models</code></div></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-nkj2fj">Example Usage</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.openai)}</code></div></div></div></div>  <div><h3 class="text-lg font-medium mb-3" data-svelte-h="svelte-1x6ey2x">Anthropic Native API</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-f1bevk">Native Anthropic Claude API compatibility</p> <div class="space-y-4"><div data-svelte-h="svelte-1fhyldj"><h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-2"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /v1/messages</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /v1/models</code></div></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-nkj2fj">Example Usage</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.anthropic)}</code></div></div></div></div>  <div><h3 class="text-lg font-medium mb-3" data-svelte-h="svelte-z5u8wu">Ollama Compatible API</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-g9g3va">Compatible with Ollama&#39;s API format for local model deployment</p> <div class="space-y-4"><div data-svelte-h="svelte-o4om0y"><h4 class="font-medium mb-2">Endpoints</h4> <div class="grid gap-2 md:grid-cols-3"><div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /api/generate</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">POST /api/chat</code></div> <div class="bg-muted rounded p-3"><code class="text-xs font-mono">GET /api/tags</code></div></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-nkj2fj">Example Usage</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono whitespace-pre-wrap">${escape(apiExamples.ollama)}</code></div></div></div></div></div></div></section>  <section class="mb-12"><div class="rounded-lg border bg-card p-6"><h2 class="text-2xl font-semibold mb-6" data-svelte-h="svelte-fojgu5">Error Handling</h2> <div class="space-y-4"><div class="border-l-4 border-red-400 pl-4" data-svelte-h="svelte-1p7zcuu"><h3 class="font-medium mb-2">HTTP Status Codes</h3> <div class="space-y-2"><div class="flex justify-between"><code class="text-xs font-mono">200</code> <span class="text-sm">Success</span></div> <div class="flex justify-between"><code class="text-xs font-mono">400</code> <span class="text-sm">Bad Request</span></div> <div class="flex justify-between"><code class="text-xs font-mono">401</code> <span class="text-sm">Unauthorized</span></div> <div class="flex justify-between"><code class="text-xs font-mono">404</code> <span class="text-sm">Not Found</span></div> <div class="flex justify-between"><code class="text-xs font-mono">500</code> <span class="text-sm">Internal Server Error</span></div></div></div> <div class="border-l-4 border-yellow-400 pl-4"><h3 class="font-medium mb-2" data-svelte-h="svelte-1i4szvk">Error Response Format</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">${escape(apiExamples.error)}</code></div></div></div></div></section>  <section class="mb-12" data-svelte-h="svelte-i3reia"><div class="rounded-lg border bg-card p-6"><h2 class="text-2xl font-semibold mb-6">Rate Limiting</h2> <div class="space-y-4"><p class="text-sm text-muted-foreground">LLM Link respects the rate limits of each provider. Limits are applied per provider 
						and are automatically managed based on the provider&#39;s specifications.</p> <div class="grid gap-4 md:grid-cols-2"><div class="border rounded-lg p-4"><h3 class="font-medium mb-2">OpenAI</h3> <p class="text-xs text-muted-foreground">3,500 requests per minute<br>
								90,000 tokens per minute</p></div> <div class="border rounded-lg p-4"><h3 class="font-medium mb-2">Anthropic</h3> <p class="text-xs text-muted-foreground">1,000 requests per minute<br>
								40,000 tokens per minute</p></div> <div class="border rounded-lg p-4"><h3 class="font-medium mb-2">Zhipu AI</h3> <p class="text-xs text-muted-foreground">600 requests per minute<br>
								120,000 tokens per minute</p></div> <div class="border rounded-lg p-4"><h3 class="font-medium mb-2">Ollama</h3> <p class="text-xs text-muted-foreground">No rate limiting<br>
								Depends on local hardware</p></div></div></div></div></section>  <div class="mt-12 text-center">${validate_component(Button, "Button").$$render(
    $$result,
    {
      size: "lg",
      href: "https://github.com/lipish/llm-link"
    },
    {},
    {
      default: () => {
        return `${validate_component(Github, "Github").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
				View on GitHub`;
      }
    }
  )} ${validate_component(Button, "Button").$$render(
    $$result,
    {
      variant: "outline",
      size: "lg",
      href: basePath + "/docs",
      class: "ml-4"
    },
    {},
    {
      default: () => {
        return `${validate_component(BookOpen, "BookOpen").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
				Back to Documentation`;
      }
    }
  )}</div></div></div>`;
});
export {
  Page as default
};
