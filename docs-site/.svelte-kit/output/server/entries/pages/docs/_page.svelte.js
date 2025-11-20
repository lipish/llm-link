import { c as create_ssr_component, v as validate_component, f as each, e as escape } from "../../../chunks/ssr.js";
import { I as Icon, B as Button } from "../../../chunks/Icon.js";
import { C as CodeBlock } from "../../../chunks/CodeBlock.js";
import { A as Accordion } from "../../../chunks/Accordion.js";
import { b as base } from "../../../chunks/paths.js";
import { B as BookOpen, S as Settings } from "../../../chunks/settings.js";
import { Z as Zap } from "../../../chunks/zap.js";
import { G as Github } from "../../../chunks/github.js";
const Globe = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    [
      "path",
      {
        "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
      }
    ],
    ["path", { "d": "M2 12h20" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "globe" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Globe$1 = Globe;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  const features = [
    {
      title: "Multi-Provider Support",
      description: "Connect to 10+ LLM providers including OpenAI, Anthropic, Zhipu, Volcengine, and more through a single unified interface."
    },
    {
      title: "Protocol Flexibility",
      description: "Expose OpenAI, Ollama, or Anthropic-compatible APIs. Switch protocols without changing your client code."
    },
    {
      title: "Hot Configuration Reload",
      description: "Update API keys, switch providers, and modify settings via REST API without service restart."
    },
    {
      title: "App Presets",
      description: "First-class presets for Zed.dev, Codex CLI, and Claude Code with optimized ports and protocols."
    }
  ];
  return `<div class="container py-8 max-w-5xl mx-auto"><div class="mb-12" data-svelte-h="svelte-14cupso"><h1 class="text-4xl font-bold tracking-tight mb-4">Documentation</h1> <p class="text-lg text-muted-foreground">Complete guide to LLM Link - a universal proxy for multiple LLM providers with hot-reload configuration and multi-protocol support.</p></div>  <section class="mb-12"><h2 class="text-2xl font-semibold mb-6 flex items-center">${validate_component(BookOpen, "BookOpen").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})}
			Key Features</h2> <div class="grid gap-4 md:grid-cols-2">${each(features, (feature) => {
    return `<div class="rounded-lg border bg-card p-5"><h3 class="font-semibold mb-2">${escape(feature.title)}</h3> <p class="text-sm text-muted-foreground">${escape(feature.description)}</p> </div>`;
  })}</div></section>  <section class="mb-12"><h2 class="text-2xl font-semibold mb-6 flex items-center">${validate_component(Settings, "Settings").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})}
			Installation</h2> <div class="space-y-4">${validate_component(Accordion, "Accordion").$$render(
    $$result,
    {
      title: "Install via Cargo (Recommended)",
      open: true
    },
    {},
    {
      default: () => {
        return `<div class="space-y-3"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-or99cn">Install from crates.io:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
          $$result,
          {
            code: "cargo install llm-link",
            language: "bash"
          },
          {},
          {}
        )}</div>`;
      }
    }
  )} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "Install via Homebrew (macOS)" }, {}, {
    default: () => {
      return `<div class="space-y-3"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-1nmei4y">Add tap and install:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "brew tap lipish/llm-link\\nbrew install llm-link",
          language: "bash"
        },
        {},
        {}
      )}</div>`;
    }
  })} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "Build from Source" }, {}, {
    default: () => {
      return `<div class="space-y-3"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-2shz92">Clone and build:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "git clone https://github.com/lipish/llm-link.git\\ncd llm-link\\ncargo build --release",
          language: "bash"
        },
        {},
        {}
      )}</div>`;
    }
  })}</div></section>  <section class="mb-12"><h2 class="text-2xl font-semibold mb-6 flex items-center">${validate_component(Zap, "Zap").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})}
			Configuration</h2> <div class="space-y-4">${validate_component(Accordion, "Accordion").$$render(
    $$result,
    {
      title: "Environment Variables",
      open: true
    },
    {},
    {
      default: () => {
        return `<div class="space-y-3"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-pbhlia">Set API keys via environment variables:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
          $$result,
          {
            code: 'export OPENAI_API_KEY="sk-..."\nexport ANTHROPIC_API_KEY="sk-ant-..."\nexport ZHIPU_API_KEY="..."\nexport VOLCENGINE_API_KEY="..."\n\nllm-link --protocols all',
            language: "bash"
          },
          {},
          {}
        )}</div>`;
      }
    }
  )} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "Configuration File (keys.yaml)" }, {}, {
    default: () => {
      return `<div class="space-y-3"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-ahh572">Create a keys.yaml file in your project directory:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: 'providers:\n  openai:\n    api_key: "sk-..."\n  anthropic:\n    api_key: "sk-ant-..."\n  zhipu:\n    api_key: "..."\n  volcengine:\n    api_key: "..."\n    base_url: "https://ark.cn-beijing.volces.com/api/v3"',
          language: "yaml"
        },
        {},
        {}
      )}</div>`;
    }
  })} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "Hot Reload API" }, {}, {
    default: () => {
      return `<div class="space-y-3"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-hispqi">Update configuration without restart:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: `curl -X POST http://localhost:8088/api/config/update \\
  -H "Content-Type: application/json" \\
  -d '{"provider": "openai", "api_key": "new_key"}'`,
          language: "bash"
        },
        {},
        {}
      )}</div>`;
    }
  })}</div></section>  <section class="mb-12"><h2 class="text-2xl font-semibold mb-6 flex items-center">${validate_component(Globe$1, "Globe").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})}
			Usage by Applications &amp; Protocols</h2> <div class="space-y-4">${validate_component(Accordion, "Accordion").$$render(
    $$result,
    {
      title: "Application Guides (Recommended)",
      open: true
    },
    {},
    {
      default: () => {
        return `<div class="space-y-4"><div><h4 class="font-medium mb-2" data-svelte-h="svelte-6m4wew">Zed.dev</h4> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1l6vssw">Runs an Ollama-compatible endpoint for Zed on port 11434:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
          $$result,
          {
            code: "llm-link --app zed --provider ollama --model qwen3",
            language: "bash"
          },
          {},
          {}
        )} <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-14iwfu8">In Zed: Settings → AI → Custom provider → http://localhost:11434</p></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-144p1n7">Codex CLI</h4> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-bjoj7m">OpenAI-compatible endpoint for Codex on port 8088:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
          $$result,
          {
            code: "llm-link --app codex --provider openai",
            language: "bash"
          },
          {},
          {}
        )} <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-1w1evoe">Configure Codex to use http://localhost:8088/v1 as OpenAI endpoint.</p></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-1mw3j2h">Claude Code</h4> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1tnk4q5">Anthropic-compatible endpoint for Claude Code on port 8089:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
          $$result,
          {
            code: "llm-link --app claude --provider anthropic",
            language: "bash"
          },
          {},
          {}
        )} <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-1djgedk">Point Claude Code base URL to http://localhost:8089 and set a dummy API token.</p></div></div>`;
      }
    }
  )} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "Protocol Mode (Advanced)" }, {}, {
    default: () => {
      return `<div class="space-y-4"><p class="text-sm text-muted-foreground" data-svelte-h="svelte-1gn1ms1">Start llm-link directly in protocol mode when you only need a specific API surface:</p> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-1je6v3c">OpenAI Protocol</h4> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "llm-link --protocols openai --port 8088",
          language: "bash"
        },
        {},
        {}
      )} <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-4pokm7">Use this with generic OpenAI-compatible tools or SDKs.</p></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-3o2wwo">Ollama Protocol</h4> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "llm-link --protocols ollama --port 11434",
          language: "bash"
        },
        {},
        {}
      )} <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-hqi5sp">Expose Ollama-style /api/chat and /api/tags endpoints.</p></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-1ux7l3i">Anthropic Protocol</h4> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "llm-link --protocols anthropic --port 8089",
          language: "bash"
        },
        {},
        {}
      )} <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-1870jd6">Provides /v1/messages and /v1/models for Claude-compatible clients.</p></div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-1havp4l">Multiple Protocols</h4> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "llm-link --protocols openai,ollama,anthropic",
          language: "bash"
        },
        {},
        {}
      )} <p class="text-xs text-muted-foreground mt-2" data-svelte-h="svelte-nls35u">Serve multiple API formats from a single llm-link instance.</p></div></div>`;
    }
  })} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "CLI Overrides" }, {}, {
    default: () => {
      return `<div class="space-y-4"><div><h4 class="font-medium mb-2" data-svelte-h="svelte-hcs9y8">Custom Port</h4> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "llm-link --port 9000 --protocols openai",
          language: "bash"
        },
        {},
        {}
      )}</div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-m24bg4">Specific Provider &amp; Model</h4> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "llm-link --provider openai --model gpt-4",
          language: "bash"
        },
        {},
        {}
      )}</div> <div><h4 class="font-medium mb-2" data-svelte-h="svelte-1a7pjxx">Enable All Protocols</h4> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "llm-link --protocols all",
          language: "bash"
        },
        {},
        {}
      )}</div></div>`;
    }
  })}</div></section>  <section class="mb-12" data-svelte-h="svelte-17smt6r"><h2 class="text-2xl font-semibold mb-6">API Endpoints</h2> <div class="grid gap-4 md:grid-cols-2"><div class="rounded-lg border bg-card p-4"><code class="text-sm font-mono text-primary">GET /api/health</code> <p class="text-sm text-muted-foreground mt-2">Service health and version</p></div> <div class="rounded-lg border bg-card p-4"><code class="text-sm font-mono text-primary">GET /api/providers</code> <p class="text-sm text-muted-foreground mt-2">List configured providers</p></div> <div class="rounded-lg border bg-card p-4"><code class="text-sm font-mono text-primary">GET /api/models</code> <p class="text-sm text-muted-foreground mt-2">Available models</p></div> <div class="rounded-lg border bg-card p-4"><code class="text-sm font-mono text-primary">POST /api/config/update</code> <p class="text-sm text-muted-foreground mt-2">Update configuration</p></div></div></section>  <section class="mb-12" data-svelte-h="svelte-wguoih"><h2 class="text-2xl font-semibold mb-6">Troubleshooting</h2> <div class="space-y-4"><div class="border-l-4 border-yellow-400 pl-4 py-2"><h3 class="font-medium mb-1">Port already in use</h3> <p class="text-sm text-muted-foreground">Use <code>--port</code> flag to specify a different port</p></div> <div class="border-l-4 border-blue-400 pl-4 py-2"><h3 class="font-medium mb-1">API key not working</h3> <p class="text-sm text-muted-foreground">Verify key format and use hot-reload API to update</p></div> <div class="border-l-4 border-green-400 pl-4 py-2"><h3 class="font-medium mb-1">Connection timeout</h3> <p class="text-sm text-muted-foreground">Check network and provider base URL configuration</p></div></div></section>  <div class="flex gap-3 justify-center pt-8 border-t">${validate_component(Button, "Button").$$render(
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
      href: basePath + "/providers"
    },
    {},
    {
      default: () => {
        return `View All Providers`;
      }
    }
  )} ${validate_component(Button, "Button").$$render(
    $$result,
    {
      variant: "outline",
      size: "lg",
      href: basePath + "/api"
    },
    {},
    {
      default: () => {
        return `API Reference`;
      }
    }
  )}</div></div>`;
});
export {
  Page as default
};
