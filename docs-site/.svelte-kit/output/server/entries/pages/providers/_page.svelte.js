import { c as create_ssr_component, v as validate_component, f as each, e as escape, d as add_attribute } from "../../../chunks/ssr.js";
import { I as Icon, B as Button, G as Github } from "../../../chunks/github.js";
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
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const providers = [
    {
      name: "OpenAI",
      description: "Leading AI models including GPT-4, GPT-3.5, and more",
      models: ["GPT-4", "GPT-4 Turbo", "GPT-3.5 Turbo"],
      envVar: "OPENAI_API_KEY",
      apiType: "Native",
      website: "https://openai.com"
    },
    {
      name: "Anthropic",
      description: "Advanced Claude models with strong reasoning capabilities",
      models: ["Claude 3.5 Sonnet", "Claude 3.5 Haiku", "Claude 3 Opus"],
      envVar: "ANTHROPIC_API_KEY",
      apiType: "Native",
      website: "https://anthropic.com"
    },
    {
      name: "Zhipu AI",
      description: "Chinese AI models with multilingual support",
      models: ["GLM-4.6", "GLM-4.5", "GLM-4"],
      envVar: "ZHIPU_API_KEY",
      apiType: "OpenAI Compatible",
      website: "https://zhipuai.cn"
    },
    {
      name: "Aliyun",
      description: "Alibaba Cloud's powerful Qwen models",
      models: ["Qwen3 Max", "Qwen3 Plus", "Qwen3 Turbo"],
      envVar: "ALIYUN_API_KEY",
      apiType: "Native",
      website: "https://aliyun.com"
    },
    {
      name: "Volcengine",
      description: "ByteDance's advanced Doubao models",
      models: ["Doubao Seed 1.6", "Doubao Pro", "Doubao Lite"],
      envVar: "VOLCENGINE_API_KEY",
      apiType: "Native",
      website: "https://volcengine.com"
    },
    {
      name: "Tencent",
      description: "Tencent's Hunyuan models for various applications",
      models: ["Hunyuan T1", "Hunyuan A13B", "Hunyuan Turbos"],
      envVar: "TENCENT_API_KEY",
      apiType: "Native",
      website: "https://cloud.tencent.com"
    },
    {
      name: "Longcat",
      description: "High-performance models for general dialogue",
      models: ["LongCat Flash Chat", "LongCat Flash Thinking"],
      envVar: "LONGCAT_API_KEY",
      apiType: "OpenAI Compatible",
      website: "https://longcat.ai"
    },
    {
      name: "Moonshot",
      description: "Kimi models with large context windows",
      models: ["Kimi K2 Turbo", "Kimi K2", "Kimi K1.5"],
      envVar: "MOONSHOT_API_KEY",
      apiType: "OpenAI Compatible",
      website: "https://moonshot.cn"
    },
    {
      name: "Ollama",
      description: "Local and open-source models",
      models: ["Llama 2", "Mistral", "Code Llama", "Custom Models"],
      envVar: "None Required",
      apiType: "Native",
      website: "https://ollama.ai"
    }
  ];
  return `<div class="container py-8"><div class="max-w-6xl mx-auto"><div class="text-center mb-12" data-svelte-h="svelte-xxr1m"><h1 class="text-4xl font-bold tracking-tight mb-4">Supported Providers</h1> <p class="text-lg text-muted-foreground">LLM Link supports 9 major LLM providers with unified API access and automatic format conversion.</p></div> <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">${each(providers, (provider) => {
    return `<div class="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow"><div class="flex items-start justify-between mb-4"><h3 class="text-xl font-semibold">${escape(provider.name)}</h3> <a${add_attribute("href", provider.website, 0)} target="_blank" rel="noopener noreferrer" class="text-muted-foreground hover:text-foreground">${validate_component(ExternalLink, "ExternalLink").$$render($$result, { class: "h-4 w-4" }, {}, {})} </a></div> <p class="text-sm text-muted-foreground mb-4">${escape(provider.description)}</p> <div class="space-y-3"><div><h4 class="text-sm font-medium mb-1" data-svelte-h="svelte-j8gz6s">Popular Models</h4> <div class="flex flex-wrap gap-1">${each(provider.models.slice(0, 3), (model) => {
      return `<span class="bg-muted px-2 py-1 rounded text-xs">${escape(model)}</span>`;
    })} ${provider.models.length > 3 ? `<span class="text-xs text-muted-foreground">+${escape(provider.models.length - 3)} more</span>` : ``} </div></div> <div class="space-y-1"><div class="flex items-center text-sm"><span class="font-medium mr-2" data-svelte-h="svelte-1h8w5kb">API Key:</span> <code class="bg-muted px-2 py-0.5 rounded text-xs">${escape(provider.envVar)}</code></div> <div class="flex items-center text-sm"><span class="font-medium mr-2" data-svelte-h="svelte-przt3s">API Type:</span> <span class="bg-muted px-2 py-0.5 rounded text-xs">${escape(provider.apiType)}</span></div> </div></div> </div>`;
  })}</div> <div class="mt-16 space-y-8"><div class="text-center" data-svelte-h="svelte-cm149b"><h2 class="text-3xl font-bold tracking-tight mb-4">Why Choose LLM Link?</h2> <p class="text-lg text-muted-foreground">Unified access to multiple providers with intelligent optimizations</p></div> <div class="grid gap-6 md:grid-cols-3"><div class="text-center space-y-3"><div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">${validate_component(Check$1, "Check").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold" data-svelte-h="svelte-rjgtbx">Unified API</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1ecoo1u">Access all providers through OpenAI, Ollama, or Anthropic API formats</p></div> <div class="text-center space-y-3"><div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">${validate_component(Check$1, "Check").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold" data-svelte-h="svelte-1ivnfa5">Smart Detection</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1hkcnkd">Automatic client detection and format optimization</p></div> <div class="text-center space-y-3"><div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">${validate_component(Check$1, "Check").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold" data-svelte-h="svelte-asgxud">Hot Reload</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-lzegxx">Update API keys and switch providers without service restart</p></div></div></div> <div class="mt-12 text-center">${validate_component(Button, "Button").$$render(
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
  )}</div></div></div>`;
});
export {
  Page as default
};
