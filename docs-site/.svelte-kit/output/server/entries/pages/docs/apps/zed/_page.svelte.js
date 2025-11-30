import { c as create_ssr_component, v as validate_component, d as add_attribute } from "../../../../../chunks/ssr.js";
import "clsx";
import { C as CodeBlock } from "../../../../../chunks/CodeBlock.js";
import { b as base } from "../../../../../chunks/paths.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  return `<div class="max-w-3xl space-y-8"><div class="space-y-2" data-svelte-h="svelte-zzcgcl"><p class="text-sm text-muted-foreground uppercase tracking-[0.2em]">Applications · Zed.dev</p> <h1 class="text-3xl font-bold tracking-tight">Zed.dev Integration</h1> <p class="text-base text-muted-foreground">Run Zed.dev against llm-link using the Ollama-compatible API, so you can route local or remote
			models through a single endpoint.</p></div> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-1y6xsop">1. Start llm-link for Zed</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1l2amf9">This preset starts an Ollama-compatible server on <code>http://localhost:11434</code> and forwards
			requests to your configured backend model.</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "llm-link --app zed --provider ollama --model qwen3",
      language: "bash"
    },
    {},
    {}
  )} <p class="text-xs text-muted-foreground" data-svelte-h="svelte-kksot3">You can swap <code>qwen3</code> for any supported model name exposed via the Ollama protocol.</p></section> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-osdvtf">2. Configure Zed</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-1b85v4p">Point Zed&#39;s custom AI provider to the llm-link endpoint:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `
				{
					"language_models": {
						"llm-link": {
							"api_url": "http://localhost:11434"
						}
					}
				}
			`,
      language: "json"
    },
    {},
    {}
  )} <p class="text-xs text-muted-foreground" data-svelte-h="svelte-9q35le">In Zed UI: <code>Settings → AI → Custom provider</code> and set the URL to
			<code>http://localhost:11434</code>.</p></section> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-1s2v40c">3. Switching Providers or Models</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-2da15j">To experiment with different providers or models, keep Zed configuration the same and restart
			llm-link with different flags:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: `# Use a different Ollama model
llm-link --app zed --provider ollama --model llama2

# Use a remote provider exposed via the Ollama bridge
llm-link --app zed --provider volcengine --model doubao-pro-32k`,
      language: "bash"
    },
    {},
    {}
  )}</section> <div class="pt-6 border-t flex justify-between text-sm text-muted-foreground"><a${add_attribute("href", `${basePath}/docs`, 0)} class="hover:underline">← Back to Docs index</a> <a${add_attribute("href", `${basePath}/docs/apps/codex`, 0)} class="hover:underline">Next: Codex CLI →</a></div></div>`;
});
export {
  Page as default
};
