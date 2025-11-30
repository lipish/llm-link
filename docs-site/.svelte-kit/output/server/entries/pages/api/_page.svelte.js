import { c as create_ssr_component, v as validate_component, f as each, e as escape, d as add_attribute } from "../../../chunks/ssr.js";
import { B as Button } from "../../../chunks/button.js";
import { C as CodeBlock } from "../../../chunks/CodeBlock.js";
import { b as base } from "../../../chunks/paths.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { B as BookOpen, G as Github } from "../../../chunks/github.js";
const Code = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["polyline", { "points": "16 18 22 12 16 6" }],
    ["polyline", { "points": "8 6 2 12 8 18" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "code" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Code$1 = Code;
const List_ordered = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "line",
      {
        "x1": "10",
        "x2": "21",
        "y1": "6",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "10",
        "x2": "21",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "10",
        "x2": "21",
        "y1": "18",
        "y2": "18"
      }
    ],
    ["path", { "d": "M4 6h1v4" }],
    ["path", { "d": "M4 10h2" }],
    ["path", { "d": "M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "list-ordered" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const ListOrdered = List_ordered;
const Settings = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      }
    ],
    ["circle", { "cx": "12", "cy": "12", "r": "3" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "settings" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Settings$1 = Settings;
const Terminal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["polyline", { "points": "4 17 10 11 4 5" }],
    [
      "line",
      {
        "x1": "12",
        "x2": "20",
        "y1": "19",
        "y2": "19"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "terminal" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Terminal$1 = Terminal;
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
  const pageOutline = [
    { id: "overview", label: "Overview" },
    {
      id: "management",
      label: "Management APIs"
    },
    { id: "protocols", label: "Protocol APIs" },
    {
      id: "diagnostics",
      label: "Diagnostics & Monitoring"
    },
    {
      id: "error-handling",
      label: "Error Handling"
    },
    {
      id: "rate-limiting",
      label: "Rate Limiting"
    }
  ];
  const managementSections = [
    {
      title: "Model & Provider Discovery",
      description: "Query live models, providers, and the static supported model list.",
      items: [
        {
          title: "Models API",
          description: "Return the live models currently registered for each provider.",
          endpoints: ["GET /api/models", "GET /api/models?provider=openai"],
          exampleKey: "models"
        },
        {
          title: "Supported Models API",
          description: "Return a static model catalog with context length and capability tags.",
          endpoints: [
            "GET /api/supported-models",
            "GET /api/supported-models?provider=openai"
          ],
          exampleKey: "supportedModels"
        },
        {
          title: "Provider List API",
          description: "List all supported providers and their high-level capabilities.",
          endpoints: ["GET /api/provider-list"],
          exampleKey: "providerList"
        },
        {
          title: "Providers API",
          description: "Inspect the status of each provider in the current instance.",
          endpoints: ["GET /api/providers"],
          exampleKey: "providers"
        }
      ]
    },
    {
      title: "Runtime Configuration & Hot Reload",
      description: "Validate, update, and switch provider configuration without restart.",
      items: [
        {
          title: "Current Config",
          description: "View the current provider, model, and key status.",
          endpoints: ["GET /api/config/current"],
          exampleKey: "currentConfig"
        },
        {
          title: "Validate API Key",
          description: "Validate a provider API key before applying a hot update.",
          endpoints: ["POST /api/config/validate-key"],
          exampleKey: "validateKey"
        },
        {
          title: "Update API Key (Hot Reload)",
          description: "Replace the API key for a single provider while the service is running.",
          endpoints: ["POST /api/config/update-key"],
          exampleKey: "updateKey"
        },
        {
          title: "Switch Provider",
          description: "Switch provider and model together in a single request.",
          endpoints: ["POST /api/config/switch-provider"],
          exampleKey: "switchProvider"
        },
        {
          title: "Bulk Config Update",
          description: "Submit configuration or key updates for multiple providers at once.",
          endpoints: ["POST /api/config/update"],
          exampleKey: "config"
        }
      ]
    },
    {
      title: "Operations & Process Control",
      description: "Manage the process, trigger graceful shutdown, and inspect runtime state.",
      items: [
        {
          title: "Process Management",
          description: "Query the PID or trigger graceful shutdown for external orchestration.",
          endpoints: ["GET /api/config/pid", "POST /api/config/shutdown"],
          exampleKey: "processManagement"
        }
      ]
    }
  ];
  const protocolApis = [
    {
      title: "OpenAI Compatible API",
      description: "Connect OpenAI, Zhipu, Moonshot, Minimax, Longcat and other OpenAI-style clients.",
      endpoints: ["POST /v1/chat/completions", "GET /v1/models"],
      exampleKey: "openai"
    },
    {
      title: "Anthropic Native API",
      description: "Full support for Claude Messages protocol and streaming responses.",
      endpoints: ["POST /v1/messages", "GET /v1/models"],
      exampleKey: "anthropic"
    },
    {
      title: "Ollama Compatible API",
      description: "Bridge generate/chat/tags endpoints for local models and Zed-style clients.",
      endpoints: ["POST /api/generate", "POST /api/chat", "GET /api/tags"],
      exampleKey: "ollama"
    }
  ];
  const diagnosticApis = [
    {
      title: "Service Info",
      description: "Get version, current provider, enabled protocols, and related metadata.",
      endpoints: ["GET /api/info"],
      exampleKey: "serviceInfo"
    },
    {
      title: "Health API",
      description: "Check instance health, ports, and which protocols are enabled.",
      endpoints: ["GET /api/health"],
      exampleKey: "health"
    }
  ];
  const managementItemCount = managementSections.reduce((count, section) => count + section.items.length, 0);
  const summaryCards = [
    {
      title: "Base URL",
      value: "http://localhost:8088",
      hint: "Default port 8088, configurable via --port"
    },
    {
      title: "Management APIs",
      value: `${managementItemCount}`,
      hint: "Configuration, discovery, and operations"
    },
    {
      title: "Protocol Proxies",
      value: `${protocolApis.length}`,
      hint: "OpenAI / Anthropic / Ollama"
    }
  ];
  return `<div class="container py-8"><div class="max-w-6xl mx-auto"><div class="mb-8" data-svelte-h="svelte-i1l7sj"><h1 class="text-4xl font-bold tracking-tight mb-4">API Reference</h1> <p class="text-lg text-muted-foreground">Complete API documentation for LLM Link. Learn how to interact with all available endpoints,
				manage providers, and integrate with your applications.</p></div> <section class="mb-10" aria-label="Table of contents"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-4">${validate_component(ListOrdered, "ListOrdered").$$render($$result, { class: "h-5 w-5 mr-2 text-primary" }, {}, {})} <h2 class="text-xl font-semibold" data-svelte-h="svelte-d9ua8z">Page Outline</h2></div> <div class="grid gap-3 md:grid-cols-3">${each(pageOutline, (item) => {
    return `<a${add_attribute("href", `#${item.id}`, 0)} class="text-sm text-muted-foreground hover:text-foreground">#${escape(item.label)} </a>`;
  })}</div></div></section> <section class="mb-12" id="overview"><div class="rounded-lg border bg-card p-6 space-y-8"><div class="flex items-center mb-2">${validate_component(BookOpen, "BookOpen").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-1g1ysmf">API Overview</h2></div> <div class="grid gap-4 md:grid-cols-3">${each(summaryCards, (card) => {
    return `<div class="rounded-lg border bg-muted/50 p-4"><p class="text-xs text-muted-foreground uppercase">${escape(card.title)}</p> <p class="text-2xl font-bold">${escape(card.value)}</p> <p class="text-xs text-muted-foreground">${escape(card.hint)}</p> </div>`;
  })}</div> <div class="grid gap-6 md:grid-cols-2" data-svelte-h="svelte-cov9yk"><div><h3 class="text-lg font-medium mb-3">Base URL</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">http://localhost:8088</code></div> <p class="text-sm text-muted-foreground mt-2">Default port is 8088, configurable via <code>--port</code> flag.</p></div> <div><h3 class="text-lg font-medium mb-3">Authentication</h3> <div class="space-y-2"><div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">OpenAI API · Authorization: Bearer</code></div> <div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">Anthropic API · x-api-key + anthropic-version</code></div> <div class="bg-muted rounded-md p-3"><code class="text-xs font-mono">Management APIs · No authentication required by default</code></div></div></div></div> <div class="grid gap-4 md:grid-cols-2" data-svelte-h="svelte-smgfkn"><div class="rounded-lg border bg-muted/40 p-4 space-y-2"><h3 class="text-sm font-semibold">Security conventions</h3> <ul class="text-xs text-muted-foreground list-disc pl-4 space-y-1"><li><strong>Provider API keys</strong> are <strong>never</strong> read from environment variables
								(e.g. <code>OPENAI_API_KEY</code>, <code>ANTHROPIC_API_KEY</code>). Always pass them explicitly
								via CLI flags (such as <code>--api-key</code>) or through the configuration APIs.</li> <li>The <code>--auth-key</code> flag is used to protect llm-link&#39;s own HTTP/management APIs
								(client-facing authentication) and is <strong>not</strong> forwarded to upstream LLM providers.</li></ul></div></div></div></section>  <section class="mb-12" id="management"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(Settings$1, "Settings").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-1y5nyj6">Management APIs</h2></div> <div class="space-y-6">${each(managementSections, (section) => {
    return `<div class="rounded-lg border bg-muted/30 p-5"><div class="flex flex-col gap-2 mb-4"><div class="flex items-center justify-between"><h3 class="text-xl font-semibold">${escape(section.title)}</h3> <span class="text-xs text-muted-foreground">${escape(section.items.length)} endpoint groups</span></div> <p class="text-sm text-muted-foreground">${escape(section.description)}</p></div> <div class="space-y-4">${each(section.items, (item) => {
      return `<div class="rounded-lg border bg-card p-4"><div class="flex items-center justify-between mb-2"><h4 class="font-medium">${escape(item.title)}</h4> <span class="text-xs text-muted-foreground">${escape(item.endpoints.length)} endpoints</span></div> <p class="text-sm text-muted-foreground mb-3">${escape(item.description)}</p> <div class="grid gap-2 md:grid-cols-2 mb-3">${each(item.endpoints, (endpoint) => {
        return `<div class="bg-muted rounded p-3"><code class="text-xs font-mono">${escape(endpoint)}</code> </div>`;
      })}</div> ${item.exampleKey ? `${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: apiExamples[item.exampleKey],
          language: "bash"
        },
        {},
        {}
      )}` : ``} </div>`;
    })}</div> </div>`;
  })}</div></div></section>  <section class="mb-12" id="protocols"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(Terminal$1, "Terminal").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-1j4ijhn">Protocol APIs</h2></div> <p class="text-sm text-muted-foreground mb-6" data-svelte-h="svelte-28mo0x">LLM Link 同时暴露 OpenAI、Anthropic、Ollama 三种协议入口，自动完成认证与格式转换。</p> <div class="grid gap-6">${each(protocolApis, (protocol) => {
    return `<div class="rounded-lg border bg-muted/40 p-5"><h3 class="text-lg font-semibold mb-2">${escape(protocol.title)}</h3> <p class="text-sm text-muted-foreground mb-3">${escape(protocol.description)}</p> <div class="grid gap-2 md:grid-cols-3 mb-3">${each(protocol.endpoints, (endpoint) => {
      return `<div class="bg-muted rounded p-3"><code class="text-xs font-mono">${escape(endpoint)}</code> </div>`;
    })}</div> ${validate_component(CodeBlock, "CodeBlock").$$render(
      $$result,
      {
        code: apiExamples[protocol.exampleKey],
        language: "bash"
      },
      {},
      {}
    )} </div>`;
  })}</div></div></section>  <section class="mb-12" id="diagnostics"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(Code$1, "Code").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-1yjr9oi">Diagnostics &amp; Monitoring</h2></div> <div class="grid gap-4 md:grid-cols-2">${each(diagnosticApis, (diag) => {
    return `<div class="rounded-lg border bg-muted/40 p-4"><h3 class="text-lg font-semibold mb-2">${escape(diag.title)}</h3> <p class="text-sm text-muted-foreground mb-3">${escape(diag.description)}</p> <div class="bg-muted rounded p-3 mb-3"><code class="text-xs font-mono">${escape(diag.endpoints[0])}</code></div> ${validate_component(CodeBlock, "CodeBlock").$$render(
      $$result,
      {
        code: apiExamples[diag.exampleKey],
        language: "bash"
      },
      {},
      {}
    )} </div>`;
  })}</div></div></section>  <section class="mb-12" id="error-handling"><div class="rounded-lg border bg-card p-6"><h2 class="text-2xl font-semibold mb-6" data-svelte-h="svelte-fojgu5">Error Handling</h2> <div class="space-y-4"><div class="border-l-4 border-red-400 pl-4" data-svelte-h="svelte-1p7zcuu"><h3 class="font-medium mb-2">HTTP Status Codes</h3> <div class="space-y-2"><div class="flex justify-between"><code class="text-xs font-mono">200</code> <span class="text-sm">Success</span></div> <div class="flex justify-between"><code class="text-xs font-mono">400</code> <span class="text-sm">Bad Request</span></div> <div class="flex justify-between"><code class="text-xs font-mono">401</code> <span class="text-sm">Unauthorized</span></div> <div class="flex justify-between"><code class="text-xs font-mono">404</code> <span class="text-sm">Not Found</span></div> <div class="flex justify-between"><code class="text-xs font-mono">500</code> <span class="text-sm">Internal Server Error</span></div></div></div> <div class="border-l-4 border-yellow-400 pl-4"><h3 class="font-medium mb-2" data-svelte-h="svelte-1i4szvk">Error Response Format</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">${escape(apiExamples.error)}</code></div></div></div></div></section>  <section class="mb-12" id="rate-limiting" data-svelte-h="svelte-1nrc3fk"><div class="rounded-lg border bg-card p-6"><h2 class="text-2xl font-semibold mb-6">Rate Limiting</h2> <div class="space-y-4"><p class="text-sm text-muted-foreground">LLM Link respects the rate limits of each provider. Limits are applied per provider 
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
