import { c as create_ssr_component, v as validate_component, e as escape, f as each } from "../../chunks/ssr.js";
import { B as Button } from "../../chunks/button.js";
import { C as CodeBlock } from "../../chunks/CodeBlock.js";
import { b as base } from "../../chunks/paths.js";
import { I as Icon } from "../../chunks/Icon.js";
const Arrow_right = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["path", { "d": "M5 12h14" }], ["path", { "d": "m12 5 7 7-7 7" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "arrow-right" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const ArrowRight = Arrow_right;
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
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  const integrations = [
    {
      app: "Aider",
      provider: "Zhipu",
      model: "GLM-4.6",
      status: "✅"
    },
    {
      app: "OpenHands",
      provider: "Anthropic",
      model: "Claude-3.5",
      status: "✅"
    },
    {
      app: "Codex CLI",
      provider: "Aliyun",
      model: "Qwen-2.5",
      status: "✅"
    },
    {
      app: "Zed.dev",
      provider: "Ollama",
      model: "Llama-3.1",
      status: "✅"
    }
  ];
  return `<section class="space-y-8 pb-12 pt-4 md:pb-16 md:pt-8 lg:py-16 bg-gray-50"><div class="container flex max-w-5xl flex-col items-center gap-4 text-center"><div class="w-full max-w-6xl my-4"><img src="${escape(basePath, true) + "/llmlink.jpg"}" alt="LLM Link Architecture" class="w-full h-auto"></div> <p class="max-w-4xl text-lg text-muted-foreground sm:text-xl mx-auto" data-svelte-h="svelte-15lty77">LLM Link bridges your favorite AI applications with any LLM provider through a unified proxy. 
			Use open-source models with commercial tools, switch providers instantly, and reduce costs.</p> <div class="flex flex-wrap items-center justify-center gap-4">${validate_component(Button, "Button").$$render(
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
  )}</div></div></section>  <section class="border-t bg-muted/30 py-16"><div class="container mx-auto max-w-5xl space-y-8"><div class="space-y-3 text-center" data-svelte-h="svelte-6itv6q"><h2 class="text-3xl font-bold tracking-tight">Application + Provider = ✅ Working Integration</h2> <p class="text-muted-foreground">Mix and match any AI tool with any LLM provider</p></div> <div class="rounded-lg border bg-card overflow-hidden"><table class="w-full"><thead class="bg-muted/50" data-svelte-h="svelte-qrr8ck"><tr><th class="text-left p-4 font-semibold">AI Application</th> <th class="text-left p-4 font-semibold">LLM Provider</th> <th class="text-left p-4 font-semibold">Model</th> <th class="text-center p-4 font-semibold">Status</th></tr></thead> <tbody>${each(integrations, (integration) => {
    return `<tr class="border-t hover:bg-muted/30"><td class="p-4 font-medium">${escape(integration.app)}</td> <td class="p-4">${escape(integration.provider)}</td> <td class="p-4 text-muted-foreground">${escape(integration.model)}</td> <td class="p-4 text-center"><span class="inline-flex items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 w-6 h-6 text-xs font-bold">${escape(integration.status)} </span></td> </tr>`;
  })}</tbody></table></div> <div class="text-center"><p class="text-sm text-muted-foreground mb-4" data-svelte-h="svelte-fzjs6v">Supports 10+ LLM providers: Zhipu, Anthropic, OpenAI, Aliyun, Volcengine, Moonshot, Minimax, Tencent, Longcat, Ollama</p> ${validate_component(Button, "Button").$$render(
    $$result,
    {
      variant: "outline",
      href: basePath + "/docs"
    },
    {},
    {
      default: () => {
        return `View All Providers &amp; Applications
				${validate_component(ArrowRight, "ArrowRight").$$render($$result, { class: "ml-2 h-4 w-4" }, {}, {})}`;
      }
    }
  )}</div></div></section>  <section id="quickstart" class="py-16"><div class="container mx-auto max-w-4xl space-y-8"><div class="space-y-3 text-center" data-svelte-h="svelte-11gfkpf"><h2 class="text-3xl font-bold tracking-tight">Quick Start</h2> <p class="text-muted-foreground">Get started in 2 minutes</p></div> <div class="space-y-6"><div class="rounded-lg border bg-card p-6"><h4 class="font-semibold mb-3" data-svelte-h="svelte-t1j4o4">1. Install LLM Link</h4> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "cargo install llm-link",
      language: "bash"
    },
    {},
    {}
  )}</div> <div class="rounded-lg border bg-card p-6"><h4 class="font-semibold mb-3" data-svelte-h="svelte-7oc2i2">2. Start with your preferred provider</h4> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: '# Use Aider with Zhipu GLM-4.6\nllm-link --app aider --provider zhipu --model glm-4.6 --api-key "your-zhipu-key"\n\n# Use OpenHands with Anthropic Claude\nllm-link --app openhands --provider anthropic --model claude-3-5-sonnet --api-key "your-anthropic-key"',
      language: "bash"
    },
    {},
    {}
  )}</div> <div class="rounded-lg border bg-card p-6"><h4 class="font-semibold mb-3" data-svelte-h="svelte-xohth">3. Configure your AI tool</h4> <p class="text-sm text-muted-foreground mb-2" data-svelte-h="svelte-144qpre">Point your AI application to the local proxy:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "# For OpenAI-compatible tools\nBase URL: http://localhost:8090/v1\nAPI Key: your-auth-key\n\n# For Ollama-compatible tools  \nBase URL: http://localhost:11434/api",
      language: "bash"
    },
    {},
    {}
  )}</div></div></div></section>  <section class="border-t bg-muted/40"><div class="container flex flex-col items-center gap-4 py-12 text-center"><h3 class="text-2xl font-semibold" data-svelte-h="svelte-mnn6uj">Ready to connect your AI tools?</h3> <p class="max-w-2xl text-muted-foreground" data-svelte-h="svelte-8rugxi">Start using any LLM provider with your favorite AI applications in minutes.</p> <div class="flex gap-3">${validate_component(Button, "Button").$$render($$result, { size: "lg", href: basePath + "/docs" }, {}, {
    default: () => {
      return `View Documentation`;
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
        return `${validate_component(ArrowRight, "ArrowRight").$$render($$result, { class: "mr-2 h-4 w-4" }, {}, {})}
				GitHub`;
      }
    }
  )}</div></div></section>`;
});
export {
  Page as default
};
