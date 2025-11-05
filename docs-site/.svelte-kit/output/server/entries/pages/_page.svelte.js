import { c as create_ssr_component, v as validate_component } from "../../chunks/ssr.js";
import { I as Icon, B as Button, G as Github } from "../../chunks/github.js";
import { b as base } from "../../chunks/paths.js";
import { Z as Zap } from "../../chunks/zap.js";
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
const Download = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
      }
    ],
    ["polyline", { "points": "7 10 12 15 17 10" }],
    [
      "line",
      {
        "x1": "12",
        "x2": "12",
        "y1": "15",
        "y2": "3"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "download" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Download$1 = Download;
const Layers = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"
      }
    ],
    [
      "path",
      {
        "d": "m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"
      }
    ],
    [
      "path",
      {
        "d": "m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "layers" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Layers$1 = Layers;
const Shield = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "shield" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Shield$1 = Shield;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  return `<section class="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32"><div class="container flex max-w-[64rem] flex-col items-center gap-4 text-center"><a href="https://github.com/lipish/llm-link" target="_blank" rel="noreferrer" class="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium" data-svelte-h="svelte-119ax5f">🚀 Star us on GitHub</a> <h1 class="font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent" data-svelte-h="svelte-7eva05">LLM Link</h1> <p class="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8" data-svelte-h="svelte-10rfs9o">Universal LLM proxy service providing zero-configuration access to 9 major providers through multiple API formats, with built-in optimizations for AI coding tools.</p> <div class="space-x-4">${validate_component(Button, "Button").$$render(
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
  )} ${validate_component(Button, "Button").$$render(
    $$result,
    {
      variant: "outline",
      size: "lg",
      href: basePath + "/docs"
    },
    {},
    {
      default: () => {
        return `Documentation`;
      }
    }
  )}</div></div></section> <section id="features" class="container space-y-6 py-8 md:py-12 lg:py-24"><div class="mx-auto grid max-w-5xl items-start gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-3"><div class="grid gap-1"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">${validate_component(Zap, "Zap").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold" data-svelte-h="svelte-1gzs0wp">Zero Configuration</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-uklcos">One-command startup for common use cases with built-in configurations for popular AI coding tools.</p></div> <div class="grid gap-1"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">${validate_component(Layers$1, "Layers").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold" data-svelte-h="svelte-9ewhqp">Multi-Protocol</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1xn727y">Simultaneous OpenAI, Ollama, and Anthropic API support with automatic format conversion.</p></div> <div class="grid gap-1"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">${validate_component(Shield$1, "Shield").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold" data-svelte-h="svelte-kmw885">9 LLM Providers</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-14ckaog">Support for OpenAI, Anthropic, Zhipu, Aliyun, Volcengine, Tencent, Longcat, Moonshot, and Ollama.</p></div> <div class="grid gap-1"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">${validate_component(Code$1, "Code").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold" data-svelte-h="svelte-okajlk">AI Tool Optimized</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-pg3bd">Built-in optimizations for Codex CLI, Zed, and Claude Code with smart client detection.</p></div> <div class="grid gap-1"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">${validate_component(Download$1, "Download").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold" data-svelte-h="svelte-4p2tf8">Rust Library</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1il9ewc">Use as a Rust crate for direct programmatic access to provider and model information.</p></div> <div class="grid gap-1"><div class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">${validate_component(Zap, "Zap").$$render($$result, { class: "h-6 w-6" }, {}, {})}</div> <h3 class="text-lg font-semibold" data-svelte-h="svelte-hso2vu">Hot-Reload</h3> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-fd5txf">Update API keys and switch providers without restart with dynamic configuration updates.</p></div></div></section> <section class="border-t bg-muted/50" data-svelte-h="svelte-ozcspk"><div class="container py-16"><div class="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2"><div class="space-y-4"><h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Built for developers</h2> <p class="text-lg text-muted-foreground">LLM Link is designed to integrate seamlessly with your existing development workflow.</p></div> <div class="grid gap-6"><div class="grid gap-1"><h3 class="text-lg font-semibold">🎯 Application-Oriented</h3> <p class="text-sm text-muted-foreground">Built-in configurations for popular AI coding tools like Codex CLI, Zed, and Claude Code.</p></div> <div class="grid gap-1"><h3 class="text-lg font-semibold">🔧 CLI-First Design</h3> <p class="text-sm text-muted-foreground">Simple command-line interface with helpful guidance and automatic setup.</p></div> <div class="grid gap-1"><h3 class="text-lg font-semibold">🚀 Production Ready</h3> <p class="text-sm text-muted-foreground">Built with Rust for performance, reliability, and memory safety.</p></div></div></div></div></section> <section class="py-16" data-svelte-h="svelte-4b42u"><div class="container mx-auto px-4"><div class="text-center mb-12"><h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Supported Applications</h2> <p class="mt-4 text-lg text-muted-foreground">Optimized configurations for popular AI development tools</p></div> <div class="grid gap-6 md:grid-cols-3"><div class="rounded-lg border bg-card p-6"><h3 class="text-xl font-semibold mb-2">Codex CLI</h3> <p class="text-muted-foreground mb-4">OpenAI API client for AI-powered coding assistance</p> <div class="flex items-center text-sm text-muted-foreground"><span class="mr-2">🔗 Port:</span> <code class="bg-muted px-2 py-1 rounded">8088</code></div></div> <div class="rounded-lg border bg-card p-6"><h3 class="text-xl font-semibold mb-2">Zed</h3> <p class="text-muted-foreground mb-4">Modern editor with Ollama API integration</p> <div class="flex items-center text-sm text-muted-foreground"><span class="mr-2">🔗 Port:</span> <code class="bg-muted px-2 py-1 rounded">11434</code></div></div> <div class="rounded-lg border bg-card p-6"><h3 class="text-xl font-semibold mb-2">Claude Code</h3> <p class="text-muted-foreground mb-4">Anthropic client for advanced AI coding</p> <div class="flex items-center text-sm text-muted-foreground"><span class="mr-2">🔗 Port:</span> <code class="bg-muted px-2 py-1 rounded">8089</code></div></div></div></div></section>`;
});
export {
  Page as default
};
