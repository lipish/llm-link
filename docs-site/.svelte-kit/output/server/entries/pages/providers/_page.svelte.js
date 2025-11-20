import { c as create_ssr_component, v as validate_component, e as escape, f as each, d as add_attribute } from "../../../chunks/ssr.js";
import { I as Icon, B as Button } from "../../../chunks/Icon.js";
import { A as Accordion } from "../../../chunks/Accordion.js";
import { E as ExternalLink } from "../../../chunks/external-link.js";
import { G as Github } from "../../../chunks/github.js";
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
  const providerCount = providers.length;
  const nativeProviders = providers.filter((provider) => provider.apiType === "Native");
  const compatibleProviders = providers.filter((provider) => provider.apiType !== "Native");
  return `<div class="container py-8 max-w-6xl mx-auto"><div class="text-center mb-12"><h1 class="text-4xl font-bold tracking-tight mb-4" data-svelte-h="svelte-ngkwbu">Supported Providers</h1> <p class="text-lg text-muted-foreground">LLM Link supports ${escape(providerCount)} major LLM providers with unified API access</p></div>  <div class="grid gap-4 md:grid-cols-3 mb-12"><div class="rounded-lg border bg-card p-6 text-center"><p class="text-sm text-muted-foreground uppercase mb-2" data-svelte-h="svelte-5bb50g">Total Providers</p> <p class="text-4xl font-bold">${escape(providerCount)}</p> <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-zlwu8d">Unified API access</p></div> <div class="rounded-lg border bg-card p-6 text-center"><p class="text-sm text-muted-foreground uppercase mb-2" data-svelte-h="svelte-4qs14">Native APIs</p> <p class="text-4xl font-bold">${escape(nativeProviders.length)}</p> <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-1c9oaz1">Custom implementations</p></div> <div class="rounded-lg border bg-card p-6 text-center"><p class="text-sm text-muted-foreground uppercase mb-2" data-svelte-h="svelte-51zryc">OpenAI Compatible</p> <p class="text-4xl font-bold">${escape(compatibleProviders.length)}</p> <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-12sfcdc">Standard protocol</p></div></div>  <div class="space-y-4 mb-12">${each(providers, (provider) => {
    return `${validate_component(Accordion, "Accordion").$$render($$result, { title: provider.name }, {}, {
      default: () => {
        return `<div class="grid md:grid-cols-2 gap-6"><div class="space-y-4"><div><h4 class="text-sm font-medium text-muted-foreground mb-2" data-svelte-h="svelte-1viozsj">Description</h4> <p class="text-sm">${escape(provider.description)}</p></div> <div><h4 class="text-sm font-medium text-muted-foreground mb-2" data-svelte-h="svelte-41nydu">Popular Models</h4> <div class="flex flex-wrap gap-2">${each(provider.models, (model) => {
          return `<span class="bg-muted px-3 py-1 rounded-md text-sm">${escape(model)}</span>`;
        })} </div></div> <div><h4 class="text-sm font-medium text-muted-foreground mb-2" data-svelte-h="svelte-34jfwo">Features</h4> <div class="flex flex-wrap gap-2">${each(provider.features, (feature) => {
          return `<span class="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm flex items-center gap-1">${validate_component(Check$1, "Check").$$render($$result, { class: "h-3 w-3" }, {}, {})} ${escape(feature)} </span>`;
        })}</div> </div></div> <div class="space-y-4"><div><h4 class="text-sm font-medium text-muted-foreground mb-2" data-svelte-h="svelte-nyg31n">Configuration</h4> <div class="space-y-2"><div class="flex items-center justify-between text-sm"><span class="text-muted-foreground" data-svelte-h="svelte-16g55i6">API Type:</span> <code class="bg-muted px-2 py-1 rounded text-xs">${escape(provider.apiType)}</code></div> <div class="flex items-center justify-between text-sm"><span class="text-muted-foreground" data-svelte-h="svelte-udz405">Environment Variable:</span> <code class="bg-muted px-2 py-1 rounded text-xs">${escape(provider.envVar)}</code></div> <div class="flex items-center justify-between text-sm"><span class="text-muted-foreground" data-svelte-h="svelte-10vndau">Base URL:</span> <code class="bg-muted px-2 py-1 rounded text-xs truncate max-w-xs">${escape(provider.baseUrl)}</code></div> </div></div> <div><a${add_attribute("href", provider.website, 0)} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-sm text-primary hover:underline">Visit official website
								${validate_component(ExternalLink, "ExternalLink").$$render($$result, { class: "h-4 w-4" }, {}, {})} </a></div> </div></div> `;
      }
    })}`;
  })}</div>  <section class="mb-12"><div class="text-center mb-8" data-svelte-h="svelte-yai05p"><h2 class="text-3xl font-bold tracking-tight mb-4">Why Use LLM Link?</h2> <p class="text-lg text-muted-foreground">Unified access with intelligent optimizations</p></div> <div class="grid gap-6 md:grid-cols-3"><div class="rounded-lg border bg-card p-6"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">${validate_component(Check$1, "Check").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold mb-2" data-svelte-h="svelte-vgkak">Unified Interface</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1xbizo7">Access all providers through OpenAI, Ollama, or Anthropic API formats without changing client code</p></div> <div class="rounded-lg border bg-card p-6"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">${validate_component(Check$1, "Check").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold mb-2" data-svelte-h="svelte-vs5wmn">Hot Reload</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1905xwq">Update API keys and switch providers dynamically via REST API without service restart</p></div> <div class="rounded-lg border bg-card p-6"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">${validate_component(Check$1, "Check").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold mb-2" data-svelte-h="svelte-uxt49z">Smart Detection</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1f5x4y6">Automatic client detection and protocol optimization for seamless integration</p></div></div></section>  <div class="flex gap-3 justify-center pt-8 border-t">${validate_component(Button, "Button").$$render(
    $$result,
    {
      size: "lg",
      href: "https://github.com/lipish/llm-link"
    },
    {},
    {
      default: () => {
        return `${validate_component(Github, "Github").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
			Get Started`;
      }
    }
  )}</div></div>`;
});
export {
  Page as default
};
