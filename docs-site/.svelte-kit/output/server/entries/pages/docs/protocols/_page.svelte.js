import { c as create_ssr_component, v as validate_component, d as add_attribute } from "../../../../chunks/ssr.js";
import "clsx";
import { C as CodeBlock } from "../../../../chunks/CodeBlock.js";
import { b as base } from "../../../../chunks/paths.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const basePath = base;
  return `<div class="max-w-3xl space-y-8"><div class="space-y-2" data-svelte-h="svelte-13v02he"><p class="text-sm text-muted-foreground uppercase tracking-[0.2em]">Protocols</p> <h1 class="text-3xl font-bold tracking-tight">Protocol Mode</h1> <p class="text-base text-muted-foreground">Run llm-link as a pure protocol bridge when you do not need a specific app preset. This is
			useful for integrating generic SDKs or tools that already speak OpenAI, Anthropic, or Ollama
			APIs directly.</p></div> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-19gzyaw">OpenAI Protocol</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-p9lpvs">Expose an OpenAI-compatible API on <code>http://localhost:8088</code>:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "llm-link --protocols openai --port 8088",
      language: "bash"
    },
    {},
    {}
  )} <p class="text-xs text-muted-foreground" data-svelte-h="svelte-137h4ks">Use this with OpenAI SDKs or tools like Continue.dev that expect the
			<code>/v1/chat/completions</code> and <code>/v1/models</code> endpoints.</p></section> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-mssg0u">Anthropic Protocol</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-zu8b4h">Expose an Anthropic-compatible API on <code>http://localhost:8089</code>:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "llm-link --protocols anthropic --port 8089",
      language: "bash"
    },
    {},
    {}
  )} <p class="text-xs text-muted-foreground" data-svelte-h="svelte-1empxfc">Provides <code>/v1/messages</code> and <code>/v1/models</code> endpoints for Claude-compatible
			clients.</p></section> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-1npscjo">Ollama Protocol</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-yw4anh">Expose an Ollama-compatible API on <code>http://localhost:11434</code>:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "llm-link --protocols ollama --port 11434",
      language: "bash"
    },
    {},
    {}
  )} <p class="text-xs text-muted-foreground" data-svelte-h="svelte-3jt60">Implements <code>/api/generate</code>, <code>/api/chat</code>, and <code>/api/tags</code> for
			clients like Zed and other Ollama-native tools.</p></section> <section class="space-y-4"><h2 class="text-2xl font-semibold" data-svelte-h="svelte-1wof0i1">Multiple Protocols</h2> <p class="text-sm text-muted-foreground" data-svelte-h="svelte-bzmshg">Serve several API formats from a single llm-link instance:</p> ${validate_component(CodeBlock, "CodeBlock").$$render(
    $$result,
    {
      code: "llm-link --protocols openai,ollama,anthropic",
      language: "bash"
    },
    {},
    {}
  )} <p class="text-xs text-muted-foreground" data-svelte-h="svelte-obz806">Clients can hit the OpenAI, Anthropic, or Ollama routes concurrently while llm-link routes all
			traffic to your configured provider and model.</p></section> <div class="pt-6 border-t flex justify-between text-sm text-muted-foreground"><a${add_attribute("href", `${basePath}/docs`, 0)} class="hover:underline">← Back to Docs index</a> <a${add_attribute("href", `${basePath}/api`, 0)} class="hover:underline">API Reference →</a></div></div>`;
});
export {
  Page as default
};
