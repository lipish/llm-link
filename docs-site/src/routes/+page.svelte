<script>
	import Button from '$lib/components/ui/button.svelte';
	import { Github, Download, Zap, Shield, Code, Layers } from 'lucide-svelte';
	import { base } from '$app/paths';
</script>

<section class="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
	<div class="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
		<a
			href="https://github.com/lipish/llm-link"
			target="_blank"
			rel="noreferrer"
			class="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
		>
			🚀 Star us on GitHub
		</a>
		<h1
			class="font-heading text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
		>
			LLM Link
		</h1>
		<p
			class="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
		>
			Universal LLM proxy service providing zero-configuration access to 9 major providers through multiple API formats, with built-in optimizations for AI coding tools.
		</p>
		<div class="space-x-4">
			<Button size="lg" href="https://github.com/lipish/llm-link">
				<Github class="mr-2 h-4 w-4" />
				GitHub
			</Button>
			<Button variant="outline" size="lg" href="/docs">
				Documentation
			</Button>
		</div>
	</div>
</section>

<section
	id="features"
	class="container space-y-6 py-8 md:py-12 lg:py-24"
>
	<div class="mx-auto grid max-w-5xl items-start gap-10 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
		<div class="grid gap-1">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground"
			>
				<Zap class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-semibold">Zero Configuration</h3>
			<p class="text-sm text-muted-foreground">
				One-command startup for common use cases with built-in configurations for popular AI coding tools.
			</p>
		</div>
		<div class="grid gap-1">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground"
			>
				<Layers class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-semibold">Multi-Protocol</h3>
			<p class="text-sm text-muted-foreground">
				Simultaneous OpenAI, Ollama, and Anthropic API support with automatic format conversion.
			</p>
		</div>
		<div class="grid gap-1">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground"
			>
				<Shield class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-semibold">9 LLM Providers</h3>
			<p class="text-sm text-muted-foreground">
				Support for OpenAI, Anthropic, Zhipu, Aliyun, Volcengine, Tencent, Longcat, Moonshot, and Ollama.
			</p>
		</div>
		<div class="grid gap-1">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground"
			>
				<Code class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-semibold">AI Tool Optimized</h3>
			<p class="text-sm text-muted-foreground">
				Built-in optimizations for Codex CLI, Zed, and Claude Code with smart client detection.
			</p>
		</div>
		<div class="grid gap-1">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground"
			>
				<Download class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-semibold">Rust Library</h3>
			<p class="text-sm text-muted-foreground">
				Use as a Rust crate for direct programmatic access to provider and model information.
			</p>
		</div>
		<div class="grid gap-1">
			<div
				class="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-muted-foreground"
			>
				<Zap class="h-6 w-6" />
			</div>
			<h3 class="text-lg font-semibold">Hot-Reload</h3>
			<p class="text-sm text-muted-foreground">
				Update API keys and switch providers without restart with dynamic configuration updates.
			</p>
		</div>
	</div>
</section>

<section class="border-t bg-muted/50">
	<div class="container py-16">
		<div
			class="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2"
		>
			<div class="space-y-4">
				<h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
					Built for developers
				</h2>
				<p class="text-lg text-muted-foreground">
					LLM Link is designed to integrate seamlessly with your existing development workflow.
				</p>
			</div>
			<div class="grid gap-6">
				<div class="grid gap-1">
					<h3 class="text-lg font-semibold">🎯 Application-Oriented</h3>
					<p class="text-sm text-muted-foreground">
						Built-in configurations for popular AI coding tools like Codex CLI, Zed, and Claude Code.
					</p>
				</div>
				<div class="grid gap-1">
					<h3 class="text-lg font-semibold">🔧 CLI-First Design</h3>
					<p class="text-sm text-muted-foreground">
						Simple command-line interface with helpful guidance and automatic setup.
					</p>
				</div>
				<div class="grid gap-1">
					<h3 class="text-lg font-semibold">🚀 Production Ready</h3>
					<p class="text-sm text-muted-foreground">
						Built with Rust for performance, reliability, and memory safety.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="py-16">
	<div class="container mx-auto px-4">
		<div class="text-center mb-12">
			<h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
				Supported Applications
			</h2>
			<p class="mt-4 text-lg text-muted-foreground">
				Optimized configurations for popular AI development tools
			</p>
		</div>
		<div class="grid gap-6 md:grid-cols-3">
			<div class="rounded-lg border bg-card p-6">
				<h3 class="text-xl font-semibold mb-2">Codex CLI</h3>
				<p class="text-muted-foreground mb-4">OpenAI API client for AI-powered coding assistance</p>
				<div class="flex items-center text-sm text-muted-foreground">
					<span class="mr-2">🔗 Port:</span>
					<code class="bg-muted px-2 py-1 rounded">8088</code>
				</div>
			</div>
			<div class="rounded-lg border bg-card p-6">
				<h3 class="text-xl font-semibold mb-2">Zed</h3>
				<p class="text-muted-foreground mb-4">Modern editor with Ollama API integration</p>
				<div class="flex items-center text-sm text-muted-foreground">
					<span class="mr-2">🔗 Port:</span>
					<code class="bg-muted px-2 py-1 rounded">11434</code>
				</div>
			</div>
			<div class="rounded-lg border bg-card p-6">
				<h3 class="text-xl font-semibold mb-2">Claude Code</h3>
				<p class="text-muted-foreground mb-4">Anthropic client for advanced AI coding</p>
				<div class="flex items-center text-sm text-muted-foreground">
					<span class="mr-2">🔗 Port:</span>
					<code class="bg-muted px-2 py-1 rounded">8089</code>
				</div>
			</div>
		</div>
	</div>
</section>
