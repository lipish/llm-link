import { c as create_ssr_component, v as validate_component, f as each, e as escape, d as add_attribute } from "../../../chunks/ssr.js";
import { B as Button } from "../../../chunks/button.js";
/* empty css                                                       */import { A as Accordion } from "../../../chunks/Accordion.js";
import { b as base } from "../../../chunks/paths.js";
import { B as BookOpen, G as Github } from "../../../chunks/github.js";
import { L as Layers } from "../../../chunks/layers.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { E as ExternalLink } from "../../../chunks/external-link.js";
const Check = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M20 6 9 17l-5-5" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "check" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Check$1 = Check;
const providers = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Leading AI models including GPT-4, GPT-3.5, and more",
    models: ["GPT-4", "GPT-4 Turbo", "GPT-3.5 Turbo"],
    envVar: "OPENAI_API_KEY",
    apiType: "Native",
    baseUrl: "https://api.openai.com/v1",
    features: ["Streaming", "Function Calling", "Vision"],
    website: "https://openai.com"
  },
  {
    id: "anthropic",
    name: "Anthropic",
    description: "Advanced Claude models with strong reasoning capabilities",
    models: ["Claude 3.5 Sonnet", "Claude 3.5 Haiku", "Claude 3 Opus"],
    envVar: "ANTHROPIC_API_KEY",
    apiType: "Native",
    baseUrl: "https://api.anthropic.com",
    features: ["Streaming", "Long Context", "Vision"],
    website: "https://anthropic.com"
  },
  {
    id: "zhipu",
    name: "Zhipu AI",
    description: "Chinese AI models with multilingual support",
    models: ["GLM-4.6", "GLM-4.5", "GLM-4"],
    envVar: "ZHIPU_API_KEY",
    apiType: "OpenAI Compatible",
    baseUrl: "https://open.bigmodel.cn/api/paas/v4",
    features: ["Streaming", "Multilingual", "Code Generation"],
    website: "https://zhipuai.cn"
  },
  {
    id: "aliyun",
    name: "Aliyun",
    description: "Alibaba Cloud's powerful Qwen models",
    models: ["Qwen3 Max", "Qwen3 Plus", "Qwen3 Turbo"],
    envVar: "ALIYUN_API_KEY",
    apiType: "Native",
    baseUrl: "https://dashscope.aliyuncs.com/api/v1",
    features: ["Streaming", "Long Context", "Multilingual"],
    website: "https://aliyun.com"
  },
  {
    id: "volcengine",
    name: "Volcengine",
    description: "ByteDance's advanced Doubao models",
    models: ["Doubao Seed 1.6", "Doubao Pro", "Doubao Lite"],
    envVar: "VOLCENGINE_API_KEY",
    apiType: "Native",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    features: ["Streaming", "Cost Effective", "Fast Response"],
    website: "https://volcengine.com"
  },
  {
    id: "tencent",
    name: "Tencent",
    description: "Tencent's Hunyuan models for various applications",
    models: ["Hunyuan T1", "Hunyuan A13B", "Hunyuan Turbos"],
    envVar: "TENCENT_API_KEY",
    apiType: "Native",
    baseUrl: "https://hunyuan.tencentcloudapi.com",
    features: ["Streaming", "Chinese Optimized", "Enterprise Ready"],
    website: "https://cloud.tencent.com"
  },
  {
    id: "longcat",
    name: "Longcat",
    description: "High-performance models for general dialogue",
    models: ["LongCat Flash Chat", "LongCat Flash Thinking"],
    envVar: "LONGCAT_API_KEY",
    apiType: "OpenAI Compatible",
    baseUrl: "https://api.longcat.ai/v1",
    features: ["Streaming", "Fast Response", "Cost Effective"],
    website: "https://longcat.ai"
  },
  {
    id: "moonshot",
    name: "Moonshot",
    description: "Kimi models with large context windows",
    models: ["Kimi K2 Turbo", "Kimi K2", "Kimi K1.5"],
    envVar: "MOONSHOT_API_KEY",
    apiType: "OpenAI Compatible",
    baseUrl: "https://api.moonshot.cn/v1",
    features: ["Streaming", "200K Context", "Document Processing"],
    website: "https://moonshot.cn"
  },
  {
    id: "minimax",
    name: "Minimax",
    description: "Powerful AI models with OpenAI-compatible API",
    models: ["MiniMax-M2", "MiniMax-H2", "MiniMax-T2"],
    envVar: "MINIMAX_API_KEY",
    apiType: "OpenAI Compatible",
    baseUrl: "https://api.minimaxi.com/v1",
    features: ["Streaming", "Multilingual", "Fast Response"],
    website: "https://minimaxi.com"
  },
  {
    id: "ollama",
    name: "Ollama",
    description: "Local and open-source models",
    models: ["Llama 2", "Mistral", "Code Llama", "Custom Models"],
    envVar: "None Required",
    apiType: "Native",
    baseUrl: "http://localhost:11434",
    features: ["Local Deployment", "Privacy", "Custom Models"],
    website: "https://ollama.ai"
  }
];
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  const providers$1 = providers.filter((provider) => provider.id !== "openai" && provider.id !== "anthropic");
  const providerCount = providers$1.length;
  const nativeProviders = providers$1.filter((provider) => provider.apiType === "Native");
  const compatibleProviders = providers$1.filter((provider) => provider.apiType !== "Native");
  const features = [
    {
      title: "Universal LLM Proxy",
      description: "Run a single service that speaks OpenAI, Ollama, and Anthropic-style APIs to your favorite tools."
    },
    {
      title: "Multi-Provider Routing",
      description: "Connect to 10+ providers (OpenAI, Anthropic, Zhipu, Volcengine, Moonshot, Minimax, Tencent, Aliyun, Longcat, Ollama, and more)."
    },
    {
      title: "Editor & Agent Integrations",
      description: "First-class support for Zed.dev, Codex CLI and other dev tools via presets and protocols."
    },
    {
      title: "Hot-Reload Configuration",
      description: "Update API keys and routing rules at runtime using REST APIs, without restarting the service."
    }
  ];
  return `<div class="max-w-3xl space-y-12"><div class="space-y-3" data-svelte-h="svelte-1115lh3"><h1 class="text-4xl font-bold tracking-tight mb-4">Introduction to LLM Link</h1> <p class="text-lg text-muted-foreground">LLM Link is a universal LLM gateway that normalizes different providers and protocols into a single
			service. This page explains why it exists, what problems it solves, and how it fits into your stack.</p></div>  <section id="introduction" class="space-y-6"><h2 class="text-2xl font-semibold flex items-center">${validate_component(BookOpen, "BookOpen").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})}
			Introduction</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-j3y9pq">Modern editors, agents, and plugins all speak slightly different &quot;OpenAI-compatible&quot; dialects and
			expect you to copy API keys and endpoints into each of them. Switching providers or models usually
			means touching multiple configs, rotating secrets in many places, and dealing with protocol quirks.</p> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-2nz027">LLM Link sits in the middle as a single proxy between your tools and upstream LLM providers. You
			configure providers and routing once, then point Zed.dev, Codex CLI, and other clients
			to LLM Link. It unifies protocols, centralizes API key management, and makes it easy to experiment
			with different providers without rebuilding your setup.</p> <div class="grid gap-4 md:grid-cols-2">${each(features, (feature) => {
    return `<div class="rounded-lg border bg-card p-5"><h3 class="font-semibold mb-2">${escape(feature.title)}</h3> <p class="text-sm text-muted-foreground">${escape(feature.description)}</p> </div>`;
  })}</div></section>  <section class="space-y-6"><h2 class="text-2xl font-semibold flex items-center">${validate_component(Layers, "Layers").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})}
			Supported LLM Providers</h2> <p class="text-sm text-muted-foreground">LLM Link supports ${escape(providerCount)} major LLM providers with unified API access</p>  <div class="grid gap-4 md:grid-cols-3 mb-8"><div class="rounded-lg border bg-card p-6 text-center"><p class="text-sm text-muted-foreground uppercase mb-2" data-svelte-h="svelte-5bb50g">Total Providers</p> <p class="text-4xl font-bold">${escape(providerCount)}</p> <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-zlwu8d">Unified API access</p></div> <div class="rounded-lg border bg-card p-6 text-center"><p class="text-sm text-muted-foreground uppercase mb-2" data-svelte-h="svelte-4qs14">Native APIs</p> <p class="text-4xl font-bold">${escape(nativeProviders.length)}</p> <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-1c9oaz1">Custom implementations</p></div> <div class="rounded-lg border bg-card p-6 text-center"><p class="text-sm text-muted-foreground uppercase mb-2" data-svelte-h="svelte-51zryc">OpenAI Compatible</p> <p class="text-4xl font-bold">${escape(compatibleProviders.length)}</p> <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-12sfcdc">Standard protocol</p></div></div>  <div class="space-y-4 mb-8">${each(providers$1, (provider) => {
    return `${validate_component(Accordion, "Accordion").$$render($$result, { title: provider.name }, {}, {
      default: () => {
        return `<div class="grid md:grid-cols-2 gap-6"><div class="space-y-4"><div><h4 class="text-sm font-medium text-muted-foreground mb-2" data-svelte-h="svelte-1viozsj">Description</h4> <p class="text-sm">${escape(provider.description)}</p></div> <div><h4 class="text-sm font-medium text-muted-foreground mb-2" data-svelte-h="svelte-41nydu">Popular Models</h4> <div class="flex flex-wrap gap-2">${each(provider.models, (model) => {
          return `<span class="bg-muted px-3 py-1 rounded-md text-sm">${escape(model)}</span>`;
        })} </div></div> <div><h4 class="text-sm font-medium text-muted-foreground mb-2" data-svelte-h="svelte-34jfwo">Features</h4> <div class="flex flex-wrap gap-2">${each(provider.features, (feature) => {
          return `<span class="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm flex items-center gap-1">${validate_component(Check$1, "Check").$$render($$result, { class: "h-3 w-3" }, {}, {})} ${escape(feature)} </span>`;
        })}</div> </div></div> <div class="space-y-4"><div><h4 class="text-sm font-medium text-muted-foreground mb-2" data-svelte-h="svelte-nyg31n">Configuration</h4> <div class="space-y-2"><div class="flex items-center justify-between text-sm"><span class="text-muted-foreground" data-svelte-h="svelte-16g55i6">API Type:</span> <code class="bg-muted px-2 py-1 rounded text-xs">${escape(provider.apiType)}</code></div> <div class="flex items-center justify-between text-sm"><span class="text-muted-foreground" data-svelte-h="svelte-10vndau">Base URL:</span> <code class="bg-muted px-2 py-1 rounded text-xs truncate max-w-xs">${escape(provider.baseUrl)}</code></div> </div></div> <div><a${add_attribute("href", provider.website, 0)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm text-primary hover:underline">Visit official website
									${validate_component(ExternalLink, "ExternalLink").$$render($$result, { class: "h-4 w-4" }, {}, {})} </a></div> </div></div> `;
      }
    })}`;
  })}</div></section> <section class="space-y-6"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-1xo85fo">Next steps</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-3bvdtg">Continue with installation and architecture details in the dedicated guides.</p> <div class="grid gap-4 md:grid-cols-2"><div class="rounded-lg border bg-card p-5 space-y-2"><h3 class="font-semibold" data-svelte-h="svelte-1cdltdt">Quick Start</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-tvxpym">Step-by-step installation, key configuration, and running your first proxy.</p> <a href="${escape(basePath, true) + "/docs/quick-start"}" class="text-sm text-primary hover:underline">Open Quick Start guide</a></div> <div class="rounded-lg border bg-card p-5 space-y-2"><h3 class="font-semibold" data-svelte-h="svelte-1lfhfn5">Architecture</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-b2duxi">High-level diagram of clients, protocol adapters, and provider connectors.</p> <a href="${escape(basePath, true) + "/docs/architecture"}" class="text-sm text-primary hover:underline">Open Architecture overview</a></div></div></section>  <div class="flex gap-3 justify-center pt-8 border-t">${validate_component(Button, "Button").$$render(
    $$result,
    {
      size: "lg",
      href: "https://github.com/lipish/llm-link"
    },
    {},
    {
      default: () => {
        return `${validate_component(Github, "Github").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
			GitHub`;
      }
    }
  )}</div></div>`;
});
export {
  Page as default
};
