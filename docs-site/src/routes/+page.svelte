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
			description: 'Unified proxy for OpenAI, Ollama, and Anthropic APIs with automatic protocol detection.'
		},
		{
			icon: Zap,
			title: 'Hot Reload',
			description: 'Update API keys and configurations without service restart via REST API.'
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
		<p class="max-w-2xl text-base text-muted-foreground sm:text-lg">
			A unified proxy service supporting 10+ LLM providers with OpenAI, Ollama, and Anthropic API compatibility. Built with Rust for performance and reliability.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			<Button size="lg" href="https://github.com/lipish/llm-link">
				<Github class="mr-2 h-4 w-4" />
				GitHub
			</Button>
			<Button variant="outline" size="lg" href="#quickstart">
				<Download class="mr-2 h-4 w-4" />
				Get Started
			</Button>
			<Button variant="ghost" size="lg" href="{basePath}/docs">
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
			<Accordion title="Install via Cargo (Recommended)" open={true}>
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Install the latest stable version from crates.io:</p>
					<CodeBlock code="cargo install llm-link" language="bash" />
				</div>
			</Accordion>

			<Accordion title="Install via Homebrew (macOS)">
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Add the tap and install:</p>
					<CodeBlock code="brew tap lipish/llm-link\nbrew install llm-link" language="bash" />
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
			<p class="text-muted-foreground">Start with app presets or custom protocol configurations</p>
		</div>
		
		<div class="space-y-4">
			<Accordion title="For Zed Editor" open={true}>
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Optimized preset for Zed with Ollama-compatible API:</p>
					<CodeBlock code="llm-link --app zed" language="bash" />
					<p class="text-xs text-muted-foreground mt-2">Configure Zed: Settings → AI → Custom provider → http://localhost:11434</p>
				</div>
			</Accordion>

			<Accordion title="For Continue.dev / Cursor">
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">OpenAI-compatible API on port 8088:</p>
					<CodeBlock code="llm-link --app continue" language="bash" />
				</div>
			</Accordion>

			<Accordion title="Custom Protocol Configuration">
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Enable specific protocols:</p>
					<CodeBlock code="# Enable multiple protocols\nllm-link --protocols openai,anthropic,ollama\n\n# Custom port\nllm-link --protocols openai --port 8088" language="bash" />
				</div>
			</Accordion>

			<Accordion title="With Environment Variables">
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Set API keys via environment:</p>
					<CodeBlock code={'export OPENAI_API_KEY="sk-..."\nexport ANTHROPIC_API_KEY="sk-ant-..."\nexport ZHIPU_API_KEY="..."\n\nllm-link --protocols all'} language="bash" />
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
				<p class="font-semibold">OpenAI</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="font-semibold">Anthropic</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="font-semibold">Zhipu</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="font-semibold">Volcengine</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="font-semibold">Ollama</p>
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
			Explore the full documentation for advanced configurations, API reference, and integration guides.
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
