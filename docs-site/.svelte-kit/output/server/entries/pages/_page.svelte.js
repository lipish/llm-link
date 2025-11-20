import { c as create_ssr_component, v as validate_component, f as each, m as missing_component, e as escape } from "../../chunks/ssr.js";
import { I as Icon, B as Button } from "../../chunks/Icon.js";
import { C as CodeBlock } from "../../chunks/CodeBlock.js";
import { A as Accordion } from "../../chunks/Accordion.js";
import { b as base } from "../../chunks/paths.js";
import { G as Github } from "../../chunks/github.js";
import { Z as Zap } from "../../chunks/zap.js";
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
  const highlights = [
    {
      icon: Layers$1,
      title: "Multi-Protocol Support",
      description: "Unified proxy for OpenAI, Ollama, and Anthropic APIs with automatic protocol detection."
    },
    {
      icon: Zap,
      title: "Editor & Agent Integrations",
      description: "First-class support for developer tools like Codex, Claude Code, and Zed.dev with unified LLM routing."
    },
    {
      icon: Shield$1,
      title: "Production Ready",
      description: "Built with Rust for performance, reliability, and zero-downtime updates."
    }
  ];
  return `<section class="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-24"><div class="container flex max-w-4xl flex-col items-center gap-4 text-center"><p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground" data-svelte-h="svelte-hb4txv">LLM Link · Universal LLM Proxy</p> <h1 class="font-heading text-4xl font-bold sm:text-5xl md:text-6xl" data-svelte-h="svelte-mrnprm">One Proxy for All LLM Providers</h1> <p class="max-w-2xl text-base text-muted-foreground sm:text-lg mx-auto" data-svelte-h="svelte-1ks2mg4">A unified proxy service supporting 10+ LLM providers with OpenAI, Ollama, and Anthropic API compatibility. Built with Rust for performance and reliability.</p> <div class="flex flex-wrap items-center justify-center gap-3">${validate_component(Button, "Button").$$render(
    $$result,
    {
      variant: "default",
      size: "lg",
      href: "#quickstart"
    },
    {},
    {
      default: () => {
        return `${validate_component(Download$1, "Download").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
				Get Started`;
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
  )}</div></div></section> <section class="border-t bg-muted/40"><div class="container py-12"><div class="grid gap-8 md:grid-cols-3">${each(highlights, (highlight) => {
    return `<div class="rounded-2xl border bg-background p-6"><div class="mb-3">${validate_component(highlight.icon || missing_component, "svelte:component").$$render($$result, { class: "h-8 w-8 text-primary" }, {}, {})}</div> <h3 class="text-lg font-semibold mb-2">${escape(highlight.title)}</h3> <p class="text-sm text-muted-foreground">${escape(highlight.description)}</p> </div>`;
  })}</div></div></section> <section id="quickstart" class="py-16"><div class="container mx-auto max-w-4xl space-y-8"><div class="space-y-3 text-center" data-svelte-h="svelte-1sjzysh"><h2 class="text-3xl font-bold tracking-tight">Quick Start</h2> <p class="text-muted-foreground">Get started in under 2 minutes</p></div> <div class="space-y-4">${validate_component(Accordion, "Accordion").$$render(
    $$result,
    {
      title: "Install via Homebrew (Recommended)",
      open: true
    },
    {},
    {
      default: () => {
        return `<div class="space-y-3"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-uycy85">Add the tap and install:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
          $$result,
          {
            code: "brew tap lipish/llm-link\nbrew install llm-link",
            language: "bash"
          },
          {},
          {}
        )}</div>`;
      }
    }
  )} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "Install via pip (macOS / Linux)" }, {}, {
    default: () => {
      return `<div class="space-y-3"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-ps32eq">Use the Python wrapper which downloads the prebuilt binary on first run:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "pip install pyllmlink\n# First run downloads the matching prebuilt binary into ~/.cache/llm-link",
          language: "bash"
        },
        {},
        {}
      )}</div>`;
    }
  })} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "Install via Cargo (Developers)" }, {}, {
    default: () => {
      return `<div class="space-y-3"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-b27pbn">Install from crates.io (requires Rust toolchain):</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "cargo install llm-link",
          language: "bash"
        },
        {},
        {}
      )}</div>`;
    }
  })} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "Build from Source" }, {}, {
    default: () => {
      return `<div class="space-y-3"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-brz6ep">Clone and build manually:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "git clone https://github.com/lipish/llm-link.git\\ncd llm-link\\ncargo build --release",
          language: "bash"
        },
        {},
        {}
      )}</div>`;
    }
  })}</div></div></section> <section class="border-t bg-muted/30 py-16"><div class="container mx-auto max-w-4xl space-y-8"><div class="space-y-3 text-center" data-svelte-h="svelte-pree6r"><h2 class="text-3xl font-bold tracking-tight">Usage Examples</h2> <p class="text-muted-foreground">Real-world setups for editor and agent integrations</p></div> <div class="space-y-4">${validate_component(Accordion, "Accordion").$$render(
    $$result,
    {
      title: "Zed.dev with Qwen3 via Ollama",
      open: true
    },
    {},
    {
      default: () => {
        return `<div class="space-y-3"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-6amyjz">Run Zed against a local Qwen3 model exposed through the Ollama-compatible API:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
          $$result,
          {
            code: "llm-link --app zed --provider ollama --model qwen3",
            language: "bash"
          },
          {},
          {}
        )} <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-14iwfu8">In Zed: Settings → AI → Custom provider → http://localhost:11434</p></div>`;
      }
    }
  )} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "Codex & Claude Code" }, {}, {
    default: () => {
      return `<div class="space-y-4"><div class="space-y-2"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-ys07ka">Route Codex CLI through llm-link with OpenAI-compatible API:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "llm-link --app codex --provider openai",
          language: "bash"
        },
        {},
        {}
      )}</div> <div class="space-y-2"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-1idxs36">Run Claude Code via llm-link using the Anthropic-compatible API:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "llm-link --app claude --provider anthropic",
          language: "bash"
        },
        {},
        {}
      )}</div></div>`;
    }
  })}</div></div></section> <section class="py-16"><div class="container mx-auto max-w-4xl space-y-8"><div class="space-y-3 text-center" data-svelte-h="svelte-1qer14e"><h2 class="text-3xl font-bold tracking-tight">Supported Providers</h2> <p class="text-muted-foreground">10+ LLM providers with unified API access</p></div> <div class="grid gap-4 grid-cols-2 md:grid-cols-5 text-center" data-svelte-h="svelte-1pjrhc2"><div class="rounded-lg border bg-card p-4"><p class="font-semibold">OpenAI</p></div> <div class="rounded-lg border bg-card p-4"><p class="font-semibold">Anthropic</p></div> <div class="rounded-lg border bg-card p-4"><p class="font-semibold">Zhipu</p></div> <div class="rounded-lg border bg-card p-4"><p class="font-semibold">Volcengine</p></div> <div class="rounded-lg border bg-card p-4"><p class="font-semibold">Ollama</p></div> <div class="rounded-lg border bg-card p-4"><p class="font-semibold">Moonshot</p></div> <div class="rounded-lg border bg-card p-4"><p class="font-semibold">Minimax</p></div> <div class="rounded-lg border bg-card p-4"><p class="font-semibold">Aliyun</p></div> <div class="rounded-lg border bg-card p-4"><p class="font-semibold">Tencent</p></div> <div class="rounded-lg border bg-card p-4"><p class="font-semibold">Longcat</p></div></div> <div class="text-center">${validate_component(Button, "Button").$$render(
    $$result,
    {
      variant: "outline",
      href: basePath + "/providers"
    },
    {},
    {
      default: () => {
        return `View All Providers`;
      }
    }
  )}</div></div></section> <section class="border-t bg-muted/40"><div class="container flex flex-col items-center gap-4 py-12 text-center"><h3 class="text-2xl font-semibold" data-svelte-h="svelte-1pttnma">Ready to get started?</h3> <p class="max-w-2xl text-muted-foreground" data-svelte-h="svelte-2he4em">Explore the docs for configuration details and API reference.</p> <div class="flex gap-3">${validate_component(Button, "Button").$$render($$result, { size: "lg", href: basePath + "/docs" }, {}, {
    default: () => {
      return `Documentation`;
    }
  })} ${validate_component(Button, "Button").$$render(
    $$result,
    {
      variant: "outline",
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
  )}</div></div></section>`;
});
export {
  Page as default
};
