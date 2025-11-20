<script>
	import Button from '$lib/components/ui/button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { base } from '$app/paths';

	const basePath = base;
</script>

<div class="max-w-3xl space-y-8">
	<div class="space-y-2">
		<p class="text-sm text-muted-foreground uppercase tracking-[0.2em]">Protocols</p>
		<h1 class="text-3xl font-bold tracking-tight">Protocol Mode</h1>
		<p class="text-base text-muted-foreground">
			Run llm-link as a pure protocol bridge when you do not need a specific app preset. This is
			useful for integrating generic SDKs or tools that already speak OpenAI, Anthropic, or Ollama
			APIs directly.
		</p>
	</div>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">OpenAI Protocol</h2>
		<p class="text-sm text-muted-foreground">
			Expose an OpenAI-compatible API on <code>http://localhost:8088</code>:
		</p>
		<CodeBlock code="llm-link --protocols openai --port 8088" language="bash" />
		<p class="text-xs text-muted-foreground">
			Use this with OpenAI SDKs or tools like Continue.dev that expect the
			<code>/v1/chat/completions</code> and <code>/v1/models</code> endpoints.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Anthropic Protocol</h2>
		<p class="text-sm text-muted-foreground">
			Expose an Anthropic-compatible API on <code>http://localhost:8089</code>:
		</p>
		<CodeBlock code="llm-link --protocols anthropic --port 8089" language="bash" />
		<p class="text-xs text-muted-foreground">
			Provides <code>/v1/messages</code> and <code>/v1/models</code> endpoints for Claude-compatible
			clients.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Ollama Protocol</h2>
		<p class="text-sm text-muted-foreground">
			Expose an Ollama-compatible API on <code>http://localhost:11434</code>:
		</p>
		<CodeBlock code="llm-link --protocols ollama --port 11434" language="bash" />
		<p class="text-xs text-muted-foreground">
			Implements <code>/api/generate</code>, <code>/api/chat</code>, and <code>/api/tags</code> for
			clients like Zed and other Ollama-native tools.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">Multiple Protocols</h2>
		<p class="text-sm text-muted-foreground">
			Serve several API formats from a single llm-link instance:
		</p>
		<CodeBlock code="llm-link --protocols openai,ollama,anthropic" language="bash" />
		<p class="text-xs text-muted-foreground">
			Clients can hit the OpenAI, Anthropic, or Ollama routes concurrently while llm-link routes all
			traffic to your configured provider and model.
		</p>
	</section>

	<div class="pt-6 border-t flex justify-between text-sm text-muted-foreground">
		<a href={`${basePath}/docs`} class="hover:underline">← Back to Docs index</a>
		<a href={`${basePath}/api`} class="hover:underline">API Reference →</a>
	</div>
</div>
