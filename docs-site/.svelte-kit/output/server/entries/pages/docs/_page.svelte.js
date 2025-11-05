import { c as create_ssr_component, v as validate_component, f as each, e as escape } from "../../../chunks/ssr.js";
import { I as Icon, B as Button, G as Github } from "../../../chunks/github.js";
import { b as base } from "../../../chunks/paths.js";
import { C as Check } from "../../../chunks/check.js";
import { C as Code, Z as Zap } from "../../../chunks/zap.js";
import { T as Terminal, S as Settings, K as Key, G as Globe } from "../../../chunks/terminal.js";
const Alert_circle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "8",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "12",
        "x2": "12.01",
        "y1": "16",
        "y2": "16"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "alert-circle" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const AlertCircle = Alert_circle;
const Package = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "m7.5 4.27 9 5.15" }],
    [
      "path",
      {
        "d": "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
      }
    ],
    ["path", { "d": "m3.3 7 8.7 5 8.7-5" }],
    ["path", { "d": "M12 22V12" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "package" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Package$1 = Package;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  const curlCommand = `curl -X POST http://localhost:8088/api/config/update \\
  -H "Content-Type: application/json" \\
  -d '{"provider": "openai", "api_key": "new_key"}'`;
  const rustExample1 = `use llm_link::provider::ProviderRegistry;

// List all available providers
let providers = ProviderRegistry::list_providers();
println!("Available providers: {:?}", providers)`;
  const rustExample2 = `use llm_link::models::ModelsConfig;

// Load models configuration
let models = ModelsConfig::load_with_fallback()
    .get_models_for_provider("openai");

for model in models {
    println!("Model: {}", model.name);
}`;
  const rustExample3 = `use llm_link::provider::{Provider, ProviderConfig};
use llm_link::provider::openai::OpenAIProvider;

let config = ProviderConfig {
    api_key: "your_key".to_string(),
    base_url: None,
};

let client = OpenAIProvider::create_client(&config)?;
// Use client for chat completions`;
  const providers = [
    {
      name: "OpenAI",
      description: "Leading AI models including GPT-4, GPT-3.5, and more",
      models: ["GPT-4", "GPT-4 Turbo", "GPT-3.5 Turbo"],
      envVar: "OPENAI_API_KEY",
      apiType: "Native",
      baseUrl: "https://api.openai.com/v1",
      features: ["Streaming", "Function Calling", "Vision"]
    },
    {
      name: "Anthropic",
      description: "Advanced Claude models with strong reasoning capabilities",
      models: ["Claude 3.5 Sonnet", "Claude 3.5 Haiku", "Claude 3 Opus"],
      envVar: "ANTHROPIC_API_KEY",
      apiType: "Native",
      baseUrl: "https://api.anthropic.com",
      features: ["Streaming", "Long Context", "Vision"]
    },
    {
      name: "Zhipu AI",
      description: "Chinese AI models with multilingual support",
      models: ["GLM-4.6", "GLM-4.5", "GLM-4"],
      envVar: "ZHIPU_API_KEY",
      apiType: "OpenAI Compatible",
      baseUrl: "https://open.bigmodel.cn/api/paas/v4",
      features: ["Streaming", "Multilingual", "Code Generation"]
    },
    {
      name: "Aliyun",
      description: "Alibaba Cloud's powerful Qwen models",
      models: ["Qwen3 Max", "Qwen3 Plus", "Qwen3 Turbo"],
      envVar: "ALIYUN_API_KEY",
      apiType: "Native",
      baseUrl: "https://dashscope.aliyuncs.com/api/v1",
      features: ["Streaming", "Long Context", "Multilingual"]
    },
    {
      name: "Volcengine",
      description: "ByteDance's advanced Doubao models",
      models: ["Doubao Seed 1.6", "Doubao Pro", "Doubao Lite"],
      envVar: "VOLCENGINE_API_KEY",
      apiType: "Native",
      baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
      features: ["Streaming", "Cost Effective", "Fast Response"]
    },
    {
      name: "Tencent",
      description: "Tencent's Hunyuan models for various applications",
      models: ["Hunyuan T1", "Hunyuan A13B", "Hunyuan Turbos"],
      envVar: "TENCENT_API_KEY",
      apiType: "Native",
      baseUrl: "https://hunyuan.tencentcloudapi.com",
      features: ["Streaming", "Chinese Optimized", "Enterprise Ready"]
    },
    {
      name: "Longcat",
      description: "High-performance models for general dialogue",
      models: ["LongCat Flash Chat", "LongCat Flash Thinking"],
      envVar: "LONGCAT_API_KEY",
      apiType: "OpenAI Compatible",
      baseUrl: "https://api.longcat.ai/v1",
      features: ["Streaming", "Fast Response", "Cost Effective"]
    },
    {
      name: "Moonshot",
      description: "Kimi models with large context windows",
      models: ["Kimi K2 Turbo", "Kimi K2", "Kimi K1.5"],
      envVar: "MOONSHOT_API_KEY",
      apiType: "OpenAI Compatible",
      baseUrl: "https://api.moonshot.cn/v1",
      features: ["Streaming", "200K Context", "Document Processing"]
    },
    {
      name: "Minimax",
      description: "Powerful AI models with OpenAI-compatible API",
      models: ["MiniMax-M2", "MiniMax-H2", "MiniMax-T2"],
      envVar: "MINIMAX_API_KEY",
      apiType: "OpenAI Compatible",
      baseUrl: "https://api.minimaxi.com/v1",
      features: ["Streaming", "Multilingual", "Fast Response"]
    },
    {
      name: "Ollama",
      description: "Local and open-source models",
      models: ["Llama 2", "Mistral", "Code Llama", "Custom Models"],
      envVar: "None Required",
      apiType: "Native",
      baseUrl: "http://localhost:11434",
      features: ["Local Deployment", "Privacy", "Custom Models"]
    }
  ];
  return `<div class="container py-8"><div class="max-w-6xl mx-auto"><div class="mb-8" data-svelte-h="svelte-7jaur9"><h1 class="text-4xl font-bold tracking-tight mb-4">Documentation</h1> <p class="text-lg text-muted-foreground">Complete guide to setting up and using LLM Link with 10 major LLM providers. 
				Universal proxy service with hot-reload configuration and multiple API format support.</p></div>  <section class="mb-12"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(Package$1, "Package").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-1x5cl2e">Installation</h2></div> <div class="grid gap-6 md:grid-cols-2"><div><h3 class="text-lg font-medium mb-3 flex items-center">${validate_component(Check, "Check").$$render($$result, { class: "h-4 w-4 mr-2 text-green-600" }, {}, {})}
							Option 1: Install from crates.io (Recommended)</h3> <div class="bg-muted rounded-md p-4" data-svelte-h="svelte-gz56n"><code class="text-sm font-mono">cargo install llm-link</code></div> <p class="text-sm text-muted-foreground mt-2" data-svelte-h="svelte-9m6453">Installs the latest stable version from Rust package registry</p></div> <div><h3 class="text-lg font-medium mb-3 flex items-center">${validate_component(Code, "Code").$$render($$result, { class: "h-4 w-4 mr-2 text-blue-600" }, {}, {})}
							Option 2: Build from source</h3> <div class="bg-muted rounded-md p-4" data-svelte-h="svelte-10c086x"><code class="text-sm font-mono">git clone https://github.com/lipish/llm-link.git<br>cd llm-link<br>cargo build --release</code></div> <p class="text-sm text-muted-foreground mt-2" data-svelte-h="svelte-mdyt2e">Get the latest features from the main branch</p></div></div></div></section>  <section class="mb-12"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(Terminal, "Terminal").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-ldtush">Quick Start</h2></div> <div class="space-y-6"><div data-svelte-h="svelte-11x92ry"><h3 class="text-lg font-medium mb-3">Start with Application Presets</h3> <p class="text-sm text-muted-foreground mb-3">Optimized configurations for popular AI coding tools:</p> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono"># For Codex CLI (GitHub Copilot CLI)<br>
llm-link --app codex-cli<br><br>
# For Zed editor<br>
llm-link --app zed<br><br>
# For Claude Code<br>
llm-link --app claude-code<br><br>
# For Continue.dev<br>
llm-link --app continue</code></div></div> <div data-svelte-h="svelte-kwmvgl"><h3 class="text-lg font-medium mb-3">Start with Specific Protocols</h3> <p class="text-sm text-muted-foreground mb-3">Choose which API protocols to enable:</p> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono"># Enable specific protocols<br>
llm-link --protocols openai,anthropic,ollama<br><br>
# Enable all protocols<br>
llm-link --protocols all<br><br>
# Start on custom port<br>
llm-link --port 8088 --protocols openai,anthropic</code></div></div> <div><h3 class="text-lg font-medium mb-3" data-svelte-h="svelte-abr04u">Optional API Key Startup</h3> <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4"><div class="flex items-start">${validate_component(AlertCircle, "AlertCircle").$$render(
    $$result,
    {
      class: "h-4 w-4 mr-2 text-yellow-600 mt-0.5"
    },
    {},
    {}
  )} <div data-svelte-h="svelte-10789z1"><p class="text-sm text-yellow-800"><strong>New in v0.3.3:</strong> LLM Link can now start without API keys!</p> <p class="text-sm text-yellow-700 mt-1">Service starts normally and displays warnings for missing keys. 
										Configure API keys later using hot-reload API.</p></div></div></div></div></div></div></section>  <section class="mb-12"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(Settings, "Settings").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-1kawov">Provider Configuration</h2></div> <div class="mb-6"><h3 class="text-lg font-medium mb-3" data-svelte-h="svelte-1c2u4k2">Environment Variables</h3> <p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-13la46v">Set API keys as environment variables. For Ollama, no API key is required.</p> <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">${each(providers, (provider) => {
    return `<div class="border rounded-lg p-4"><div class="flex items-center mb-2">${validate_component(Key, "Key").$$render($$result, { class: "h-4 w-4 mr-2 text-primary" }, {}, {})} <h4 class="font-medium">${escape(provider.name)}</h4></div> <div class="bg-muted rounded p-2 mb-2"><code class="text-xs font-mono">${escape(provider.envVar)}</code></div> <p class="text-xs text-muted-foreground mb-2">${escape(provider.description)}</p> <div class="flex flex-wrap gap-1">${each(provider.features, (feature) => {
      return `<span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">${escape(feature)} </span>`;
    })}</div> </div>`;
  })}</div></div> <div data-svelte-h="svelte-1nn7nit"><h3 class="text-lg font-medium mb-3">Configuration File (Optional)</h3> <p class="text-sm text-muted-foreground mb-3">Create a <code>keys.yaml</code> file in the project directory:</p> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">providers:<br>
 openai:<br>
  api_key: &quot;your_openai_key&quot;<br>
 anthropic:<br>
  api_key: &quot;your_anthropic_key&quot;<br>
 zhipu:<br>
  api_key: &quot;your_zhipu_key&quot;<br>
 # ... other providers</code></div></div></div></section>  <section class="mb-12"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(Zap, "Zap").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-12rx1o8">Hot Reload Configuration</h2></div> <div class="space-y-6"><div><h3 class="text-lg font-medium mb-3" data-svelte-h="svelte-rxjhwk">Dynamic Configuration Update</h3> <p class="text-sm text-muted-foreground mb-3" data-svelte-h="svelte-8dokgn">Update provider configurations without restarting the service using the REST API:</p> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">${escape(curlCommand)}</code></div></div> <div data-svelte-h="svelte-1pzniip"><h3 class="text-lg font-medium mb-3">Available API Endpoints</h3> <div class="grid gap-4 md:grid-cols-2"><div class="border rounded-lg p-4"><h4 class="font-medium mb-2">Update Configuration</h4> <code class="text-xs font-mono">POST /api/config/update</code> <p class="text-xs text-muted-foreground mt-1">Update provider API keys and settings</p></div> <div class="border rounded-lg p-4"><h4 class="font-medium mb-2">List Models</h4> <code class="text-xs font-mono">GET /api/models</code> <p class="text-xs text-muted-foreground mt-1">Get available models for all providers</p></div> <div class="border rounded-lg p-4"><h4 class="font-medium mb-2">Provider Status</h4> <code class="text-xs font-mono">GET /api/providers</code> <p class="text-xs text-muted-foreground mt-1">Check status of all configured providers</p></div> <div class="border rounded-lg p-4"><h4 class="font-medium mb-2">Health Check</h4> <code class="text-xs font-mono">GET /api/health</code> <p class="text-xs text-muted-foreground mt-1">Service health and version information</p></div></div></div></div></div></section>  <section class="mb-12"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(Globe, "Globe").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-5opwpn">API Protocols</h2></div> <div class="grid gap-6 md:grid-cols-3" data-svelte-h="svelte-rd2bhc"><div class="border rounded-lg p-4"><h3 class="font-medium mb-2">OpenAI API</h3> <p class="text-sm text-muted-foreground mb-3">Compatible with OpenAI&#39;s API format</p> <div class="bg-muted rounded p-2 mb-2"><code class="text-xs font-mono">Endpoint: /v1</code></div> <p class="text-xs text-muted-foreground">Supports chat completions, streaming, function calling</p></div> <div class="border rounded-lg p-4"><h3 class="font-medium mb-2">Anthropic API</h3> <p class="text-sm text-muted-foreground mb-3">Native Anthropic Claude API</p> <div class="bg-muted rounded p-2 mb-2"><code class="text-xs font-mono">Endpoint: /v1/messages</code></div> <p class="text-xs text-muted-foreground">Supports messages API, streaming, long context</p></div> <div class="border rounded-lg p-4"><h3 class="font-medium mb-2">Ollama API</h3> <p class="text-sm text-muted-foreground mb-3">Compatible with Ollama&#39;s API format</p> <div class="bg-muted rounded p-2 mb-2"><code class="text-xs font-mono">Endpoint: /api/generate</code></div> <p class="text-xs text-muted-foreground">Supports local models, custom models, streaming</p></div></div></div></section>  <section class="mb-12"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-6">${validate_component(Code, "Code").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-otsuu6">As a Rust Library</h2></div> <div class="space-y-6"><div data-svelte-h="svelte-1ezjy1f"><h3 class="text-lg font-medium mb-3">Add to Cargo.toml</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">[dependencies]<br>llm-link = &quot;0.3.5&quot;</code></div></div> <div><h3 class="text-lg font-medium mb-3" data-svelte-h="svelte-1rr7nhu">Usage Examples</h3> <div class="space-y-4"><div><h4 class="font-medium mb-2" data-svelte-h="svelte-9z6udh">List All Providers</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">${escape(rustExample1)}</code></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-1iz98fs">Get Models for Provider</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">${escape(rustExample2)}</code></div></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-1jsu91s">Create LLM Client</h4> <div class="bg-muted rounded-md p-4"><code class="text-sm font-mono">${escape(rustExample3)}</code></div></div></div></div></div></div></section>  <section class="mb-12" data-svelte-h="svelte-j5rzn6"><div class="rounded-lg border bg-card p-6"><h2 class="text-2xl font-semibold mb-6">Troubleshooting</h2> <div class="space-y-4"><div class="border-l-4 border-yellow-400 pl-4"><h3 class="font-medium mb-2">Service fails to start</h3> <p class="text-sm text-muted-foreground">Check if required ports are available. Use <code>--port</code> to specify a different port.</p></div> <div class="border-l-4 border-blue-400 pl-4"><h3 class="font-medium mb-2">API key not working</h3> <p class="text-sm text-muted-foreground">Verify API key format and permissions. Use hot-reload API to update keys without restart.</p></div> <div class="border-l-4 border-green-400 pl-4"><h3 class="font-medium mb-2">Ollama connection failed</h3> <p class="text-sm text-muted-foreground">Ensure Ollama is running on localhost:11434. Use <code>ollama pull</code> to download models.</p></div></div></div></section>  <div class="mt-12 text-center">${validate_component(Button, "Button").$$render(
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
      href: basePath + "/api",
      class: "ml-4"
    },
    {},
    {
      default: () => {
        return `${validate_component(Code, "Code").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
				API Reference`;
      }
    }
  )} ${validate_component(Button, "Button").$$render(
    $$result,
    {
      variant: "outline",
      size: "lg",
      href: basePath + "/providers",
      class: "ml-4"
    },
    {},
    {
      default: () => {
        return `${validate_component(Globe, "Globe").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
				View All Providers`;
      }
    }
  )}</div></div></div>`;
});
export {
  Page as default
};
