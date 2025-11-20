<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { Layers } from 'lucide-svelte';
	import { base } from '$app/paths';

	const basePath = base;
</script>

<div class="max-w-3xl space-y-12">
	<div class="space-y-3">
		<h1 class="text-4xl font-bold tracking-tight mb-4">Architecture</h1>
		<p class="text-lg text-muted-foreground">
			Understand how LLM Link is structured: client integrations, protocol adapters, and provider
			connectors, plus a small control API.
		</p>
	</div>

	<section class="space-y-6">
		<h2 class="text-2xl font-semibold flex items-center">
			<Layers class="h-6 w-6 mr-2 text-primary" />
			High-level Diagram
		</h2>

		<div class="rounded-lg border bg-card p-5">
			<CodeBlock
				language="bash"
				code={`Editors / Agents
  • Zed.dev, Codex CLI, Claude Code, Continue.dev
        │
        ▼
LLM Link (this project)
  • App presets (e.g. --app zed, --app claude)
  • Protocol layer (OpenAI / Ollama / Anthropic compatible)
        │
        ▼
Provider connectors
  • OpenAI, Anthropic, Zhipu, Volcengine, Moonshot, Minimax, Tencent, Aliyun, Longcat, Ollama`}
			/>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			<div class="rounded-lg border bg-card p-5 space-y-2">
				<h3 class="font-semibold">Control APIs</h3>
				<p class="text-sm text-muted-foreground">
					Use the built-in HTTP APIs to inspect and update the running service.
				</p>
				<ul class="text-sm text-muted-foreground list-disc pl-5 space-y-1">
					<li><code>GET /api/health</code> – service health and version</li>
					<li><code>GET /api/providers</code> – configured providers</li>
					<li><code>GET /api/models</code> – available models</li>
					<li><code>POST /api/config/update</code> – update keys and settings at runtime</li>
				</ul>
			</div>
			<div class="rounded-lg border bg-card p-5 space-y-2">
				<h3 class="font-semibold">Next steps</h3>
				<p class="text-sm text-muted-foreground">
					Dive into dedicated guides for specific editors, agents, and protocol setups.
				</p>
				<div class="space-y-1 text-sm">
					<a href="{basePath}/docs/apps/zed" class="text-primary hover:underline">Zed.dev integration</a>
					<a href="{basePath}/docs/apps/codex" class="block text-primary hover:underline">Codex CLI</a>
					<a href="{basePath}/docs/apps/claude" class="block text-primary hover:underline">Claude Code</a>
					<a href="{basePath}/docs/protocols" class="block text-primary hover:underline">Protocol configuration</a>
					<a href="{basePath}/providers" class="block text-primary hover:underline">All providers</a>
					<a href="{basePath}/api" class="block text-primary hover:underline">API reference</a>
				</div>
			</div>
		</div>
	</section>
</div>
