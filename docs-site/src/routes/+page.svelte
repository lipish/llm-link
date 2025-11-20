<script>
	import Button from '$lib/components/ui/button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import { Github, Download, Zap, Shield, Layers } from 'lucide-svelte';
	import { base } from '$app/paths';

	const basePath = base;

	const highlights = [
		{
			icon: Layers,
			title: 'Multi-Protocol Support',
			description: 'Unified proxy for OpenAI-compatible and Ollama APIs with automatic protocol detection.'
		},
		{
			icon: Zap,
			title: 'Editor & Agent Integrations',
			description: 'First-class support for developer tools like Codex, Claude Code, and Zed.dev with unified LLM routing.'
		},
		{
			icon: Shield,
			title: 'Production Ready',
			description: 'Built with Rust for performance, reliability, and zero-downtime updates.'
		}
	];
</script>

<section class="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-24">
	<div class="container flex max-w-4xl flex-col items-center gap-4 text-center">
		<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
			LLM Link · Universal LLM Proxy
		</p>
		<h1 class="font-heading text-4xl font-bold sm:text-5xl md:text-6xl">
			One Proxy for All LLM Providers
		</h1>
		<p class="max-w-2xl text-base text-muted-foreground sm:text-lg mx-auto">
			A unified proxy service for multiple LLM providers with OpenAI-compatible and Ollama APIs. Built with Rust for performance and reliability.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			<Button variant="default" size="lg" href="#quickstart">
				<Download class="mr-2 h-4 w-4" />
				Get Started
			</Button>
			<Button variant="outline" size="lg" href="{basePath}/docs">
				Documentation
			</Button>
		</div>
	</div>
</section>

<section class="border-t bg-muted/40">
	<div class="container py-12">
		<div class="grid gap-8 md:grid-cols-3">
			{#each highlights as highlight}
				<div class="rounded-2xl border bg-background p-6">
					<div class="mb-3">
						<svelte:component this={highlight.icon} class="h-8 w-8 text-primary" />
					</div>
					<h3 class="text-lg font-semibold mb-2">{highlight.title}</h3>
					<p class="text-sm text-muted-foreground">{highlight.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section id="quickstart" class="py-16">
	<div class="container mx-auto max-w-4xl space-y-8">
		<div class="space-y-3 text-center">
			<h2 class="text-3xl font-bold tracking-tight">Quick Start</h2>
			<p class="text-muted-foreground">Get started in under 2 minutes</p>
		</div>
		
		<div class="space-y-4">
			<Accordion title="Install via Homebrew (Recommended)" open={true}>
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Add the tap and install:</p>
					<CodeBlock code={'brew tap lipish/llm-link\nbrew install llm-link'} language="bash" />
				</div>
			</Accordion>

			<Accordion title="Install via pip (macOS / Linux)">
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Use the Python wrapper which downloads the prebuilt binary on first run:</p>
					<CodeBlock code={'pip install pyllmlink\n# First run downloads the matching prebuilt binary into ~/.cache/llm-link'} language="bash" />
				</div>
			</Accordion>

			<Accordion title="Install via Cargo (Developers)">
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Install from crates.io (requires Rust toolchain):</p>
					<CodeBlock code="cargo install llm-link" language="bash" />
				</div>
			</Accordion>

			<Accordion title="Build from Source">
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Clone and build manually:</p>
					<CodeBlock code="git clone https://github.com/lipish/llm-link.git\ncd llm-link\ncargo build --release" language="bash" />
				</div>
			</Accordion>
		</div>
	</div>
</section>

<section class="border-t bg-muted/30 py-16">
	<div class="container mx-auto max-w-4xl space-y-8">
		<div class="space-y-3 text-center">
			<h2 class="text-3xl font-bold tracking-tight">Usage Examples</h2>
			<p class="text-muted-foreground">Real-world setups for editor and agent integrations</p>
		</div>
		
		<div class="space-y-4">
			<Accordion title="Zed.dev with Qwen3 via Ollama" open={true}>
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Run Zed against a local Qwen3 model exposed through the Ollama-compatible API:</p>
					<CodeBlock code="llm-link --app zed --provider ollama --model qwen3" language="bash" />
					<p class="text-xs text-muted-foreground mt-2">In Zed: Settings → AI → Custom provider → http://localhost:11434</p>
				</div>
			</Accordion>
		
			<Accordion title="Codex & Claude Code">
				<div class="space-y-4">
					<div class="space-y-2">
						<p class="text-sm text-muted-foreground">Route Codex CLI through llm-link using GLM 4.6 via the OpenAI-compatible API:</p>
						<CodeBlock code="llm-link --app codex --provider zhipu --api-key zhipu-... --model glm-4.6" language="bash" />
					</div>
					<div class="space-y-2">
						<p class="text-sm text-muted-foreground">Run Claude Code via llm-link routing to Qwen3 Coder Plus on Aliyun:</p>
						<CodeBlock code="llm-link --app claude --provider aliyun --api-key qwen-... --model qwen3-coder-plus" language="bash" />
					</div>
				</div>
			</Accordion>
		</div>
	</div>
</section>

<section class="py-16">
	<div class="container mx-auto max-w-4xl space-y-8">
		<div class="space-y-3 text-center">
			<h2 class="text-3xl font-bold tracking-tight">Supported Providers</h2>
			<p class="text-muted-foreground">10+ LLM providers with unified API access</p>
		</div>
		<div class="grid gap-4 grid-cols-2 md:grid-cols-5 text-center">
			<div class="rounded-lg border bg-card p-4">
				<p class="font-semibold">Zhipu</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="font-semibold">Volcengine</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="font-semibold">Moonshot</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="font-semibold">Minimax</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="font-semibold">Aliyun</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="font-semibold">Tencent</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="font-semibold">Longcat</p>
			</div>
		</div>
		<div class="text-center">
			<Button variant="outline" href="{basePath}/providers">
				View All Providers
			</Button>
		</div>
	</div>
</section>

<section class="border-t bg-muted/40">
	<div class="container flex flex-col items-center gap-4 py-12 text-center">
		<h3 class="text-2xl font-semibold">Ready to get started?</h3>
		<p class="max-w-2xl text-muted-foreground">
			Explore the docs for configuration details and API reference.
		</p>
		<div class="flex gap-3">
			<Button size="lg" href="{basePath}/docs">
				Documentation
			</Button>
			<Button variant="outline" size="lg" href="https://github.com/lipish/llm-link">
				<Github class="mr-2 h-4 w-4" />
				GitHub
			</Button>
		</div>
	</div>
</section>
