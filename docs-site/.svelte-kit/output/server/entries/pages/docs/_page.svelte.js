import { c as create_ssr_component, v as validate_component, e as escape } from "../../../chunks/ssr.js";
import { I as Icon, B as Button, G as Github } from "../../../chunks/github.js";
import { Z as Zap } from "../../../chunks/zap.js";
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
  const curlCommand = `curl -X POST http://localhost:8088/api/config/update \\
  -H "Content-Type: application/json" \\
  -d '{"provider": "openai", "api_key": "new_key"}'`;
  return `<div class="container py-8"><div class="max-w-4xl mx-auto"><div class="mb-8" data-svelte-h="svelte-hp9e5w"><h1 class="text-4xl font-bold tracking-tight mb-4">Documentation</h1> <p class="text-lg text-muted-foreground">Get started with LLM Link in minutes. Choose your preferred installation method and start using the universal LLM proxy service.</p></div> <div class="grid gap-8 md:grid-cols-2"><div class="space-y-6"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-4">${validate_component(Package$1, "Package").$$render($$result, { class: "h-6 w-6 mr-2" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-1x5cl2e">Installation</h2></div> <div class="space-y-4" data-svelte-h="svelte-1xg0ovk"><div><h3 class="text-lg font-medium mb-2">Option 1: Install from crates.io (Recommended)</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm">cargo install llm-link</code></div></div> <div><h3 class="text-lg font-medium mb-2">Option 2: Build from source</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm">git clone https://github.com/lipish/llm-link.git<br>cd llm-link<br>cargo build --release</code></div></div></div></div> <div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-4">${validate_component(Terminal$1, "Terminal").$$render($$result, { class: "h-6 w-6 mr-2" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-ldtush">Quick Start</h2></div> <div class="space-y-4" data-svelte-h="svelte-1rfe7r8"><div><h3 class="text-lg font-medium mb-2">Start with application preset</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm"># For Codex CLI<br>llm-link --app codex-cli<br><br># For Zed<br>llm-link --app zed<br><br># For Claude Code<br>llm-link --app claude-code</code></div></div> <div><h3 class="text-lg font-medium mb-2">Or start with specific protocols</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm">llm-link --protocols openai,anthropic,ollama</code></div></div></div></div></div> <div class="space-y-6"><div class="rounded-lg border bg-card p-6"><div class="flex items-center mb-4">${validate_component(Zap, "Zap").$$render($$result, { class: "h-6 w-6 mr-2" }, {}, {})} <h2 class="text-2xl font-semibold" data-svelte-h="svelte-kzocp0">Configuration</h2></div> <div class="space-y-4"><div data-svelte-h="svelte-k1gzuz"><h3 class="text-lg font-medium mb-2">Environment Variables</h3> <div class="bg-muted rounded-md p-4 text-sm"><p class="mb-2"><strong>Provider API Keys:</strong></p> <code>OPENAI_API_KEY=your_openai_key<br>ANTHROPIC_API_KEY=your_anthropic_key<br>ZHIPU_API_KEY=your_zhipu_key<br>ALIYUN_API_KEY=your_aliyun_key</code></div></div> <div><h3 class="text-lg font-medium mb-2" data-svelte-h="svelte-122nm47">Hot Reload Configuration</h3> <p class="text-sm text-muted-foreground mb-2" data-svelte-h="svelte-w8956u">Update configuration without restart using the REST API:</p> <div class="bg-muted rounded-md p-4"><code class="text-sm">${escape(curlCommand)}</code></div></div></div></div> <div class="rounded-lg border bg-card p-6" data-svelte-h="svelte-1dukkzn"><h2 class="text-2xl font-semibold mb-4">As a Rust Library</h2> <div class="space-y-4"><div><h3 class="text-lg font-medium mb-2">Add to Cargo.toml</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm">[dependencies]<br>llm-link = &quot;0.3.4&quot;</code></div></div> <div><h3 class="text-lg font-medium mb-2">Usage Example</h3> <div class="bg-muted rounded-md p-4"><code class="text-sm">use llm_link::models::ModelsConfig;<br>use llm_link::provider::ProviderRegistry;<br><br>// List all providers<br>let providers = ProviderRegistry::list_providers();<br><br>// Get models for a provider<br>let models = ModelsConfig::load_with_fallback()<br>    .get_models_for_provider(&quot;openai&quot;);</code></div></div></div></div></div></div> <div class="mt-12 text-center">${validate_component(Button, "Button").$$render(
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
  )}</div></div></div>`;
});
export {
  Page as default
};
