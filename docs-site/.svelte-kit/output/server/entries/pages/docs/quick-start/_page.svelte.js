import { c as create_ssr_component, v as validate_component } from "../../../../chunks/ssr.js";
import { C as CodeBlock } from "../../../../chunks/CodeBlock.js";
import { A as Accordion } from "../../../../chunks/Accordion.js";
import { I as Icon } from "../../../../chunks/Icon.js";
const Zap = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "polygon",
      {
        "points": "13 2 3 14 12 14 11 22 21 10 12 10 13 2"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "zap" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Zap$1 = Zap;
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="max-w-3xl space-y-12"><div class="space-y-3" data-svelte-h="svelte-q7wbvg"><h1 class="text-4xl font-bold tracking-tight mb-4">Quick Start</h1> <p class="text-lg text-muted-foreground">Install LLM Link, configure provider keys, and run your first proxy instance.</p></div> <section class="space-y-6"><h2 class="text-2xl font-semibold flex items-center">${validate_component(Zap$1, "Zap").$$render($$result, { class: "h-6 w-6 mr-2 text-primary" }, {}, {})}
			Steps</h2> <div class="space-y-4">${validate_component(Accordion, "Accordion").$$render($$result, { title: "1. Install LLM Link", open: true }, {}, {
    default: () => {
      return `<div class="space-y-4"><div><h3 class="text-sm font-medium mb-2" data-svelte-h="svelte-1tj2h0w">Homebrew (Recommended, macOS)</h3> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "brew tap lipish/llm-link\nbrew install llm-link",
          language: "bash"
        },
        {},
        {}
      )}</div> <div><h3 class="text-sm font-medium mb-2" data-svelte-h="svelte-zk2mai">pip (macOS / Linux)</h3> <p class="text-xs text-muted-foreground mb-2" data-svelte-h="svelte-9x7g7">The Python wrapper downloads a matching prebuilt binary on first run.</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "pip install pyllmlink\n# First run downloads the prebuilt llm-link binary into ~/.cache/llm-link",
          language: "bash"
        },
        {},
        {}
      )}</div> <div><h3 class="text-sm font-medium mb-2" data-svelte-h="svelte-br5vl2">Cargo (Developers)</h3> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "cargo install llm-link",
          language: "bash"
        },
        {},
        {}
      )}</div></div>`;
    }
  })} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "2. Configure provider keys" }, {}, {
    default: () => {
      return `<div class="space-y-4"><div><h3 class="text-sm font-medium mb-2" data-svelte-h="svelte-12gs07i">CLI flags (required for API keys)</h3> <p class="text-xs text-muted-foreground mb-2" data-svelte-h="svelte-345a3n">Always pass provider API keys explicitly via CLI flags. Environment variables are not
							used by llm-link to avoid hidden configuration.</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: `# GLM 4.6 (Zhipu)
llm-link --provider zhipu --api-key zhipu-... --model glm-4.6

# Qwen3 Coder Plus (Aliyun)
llm-link --provider aliyun --api-key qwen-... --model qwen3-coder-plus

# Doubao Seed 1.6 (Volcengine)
llm-link --provider volcengine --api-key volc-... --model doubao-seed-1.6`,
          language: "bash"
        },
        {},
        {}
      )}</div> <div><h3 class="text-sm font-medium mb-2" data-svelte-h="svelte-121usqs">Optional: protect HTTP APIs with --auth-key</h3> <p class="text-xs text-muted-foreground mb-2" data-svelte-h="svelte-1pmidtj">Use <code>--auth-key</code> if you want clients to authenticate when calling llm-link&#39;s
							HTTP APIs (e.g. OpenAI-compatible <code>/v1</code> endpoints). This key is only checked by
							llm-link and is not forwarded to upstream providers.</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: `llm-link --protocols openai \\
  --provider zhipu --api-key zhipu-... --model glm-4.6 \\
  --auth-key my-llm-link-token`,
          language: "bash"
        },
        {},
        {}
      )}</div></div>`;
    }
  })} ${validate_component(Accordion, "Accordion").$$render($$result, { title: "3. Run your first proxy" }, {}, {
    default: () => {
      return `<div class="space-y-4"><div><h3 class="text-sm font-medium mb-2" data-svelte-h="svelte-1tbvkvg">OpenAI-compatible endpoint (generic clients)</h3> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "llm-link --protocols openai --port 8088\n\n# Example curl request\ncurl http://localhost:8088/v1/models",
          language: "bash"
        },
        {},
        {}
      )}</div> <div><h3 class="text-sm font-medium mb-2" data-svelte-h="svelte-h9yslv">Zed.dev preset</h3> ${validate_component(CodeBlock, "CodeBlock").$$render(
        $$result,
        {
          code: "llm-link --app zed\n# Then configure Zed: Settings → AI → Custom provider → http://localhost:11434",
          language: "bash"
        },
        {},
        {}
      )}</div></div>`;
    }
  })}</div></section></div>`;
});
export {
  Page as default
};
