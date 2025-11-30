<script>
	import Button from '$lib/components/ui/button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import { Github, BookOpen, Zap, Layers, Check, ExternalLink } from 'lucide-svelte';
	import { base } from '$app/paths';
	import { providers as allProviders } from '$lib/data/providers.js';

	const basePath = base;

	// Hide providers that are not yet tested (e.g. openai/anthropic)
	const providers = allProviders.filter((provider) => provider.id !== 'openai' && provider.id !== 'anthropic');
	const providerCount = providers.length;
	const nativeProviders = providers.filter((provider) => provider.apiType === 'Native');
	const compatibleProviders = providers.filter((provider) => provider.apiType !== 'Native');

	const features = [
		{
			title: 'Universal LLM Proxy',
			description:
				'Run a single service that speaks OpenAI, Ollama, and Anthropic-style APIs to your favorite tools.'
		},
		{
			title: 'Multi-Provider Routing',
			description:
				'Connect to 10+ providers (OpenAI, Anthropic, Zhipu, Volcengine, Moonshot, Minimax, Tencent, Aliyun, Longcat, Ollama, and more).'
		},
		{
			title: 'Editor & Agent Integrations',
			description:
				'First-class support for Zed.dev, Codex CLI and other dev tools via presets and protocols.'
		},
		{
			title: 'Hot-Reload Configuration',
			description: 'Update API keys and routing rules at runtime using REST APIs, without restarting the service.'
		}
	];
</script>

<div class="max-w-3xl space-y-12">
	<div class="space-y-3">
		<h1 class="text-4xl font-bold tracking-tight mb-4">Introduction to LLM Link</h1>
		<p class="text-lg text-muted-foreground">
			LLM Link is a universal LLM gateway that normalizes different providers and protocols into a single
			service. This page explains why it exists, what problems it solves, and how it fits into your stack.
		</p>
	</div>

	<!-- Introduction -->
	<section id="introduction" class="space-y-6">
		<h2 class="text-2xl font-semibold flex items-center">
			<BookOpen class="h-6 w-6 mr-2 text-primary" />
			Introduction
		</h2>
		<p class="text-sm text-muted-foreground">
			Modern editors, agents, and plugins all speak slightly different "OpenAI-compatible" dialects and
			expect you to copy API keys and endpoints into each of them. Switching providers or models usually
			means touching multiple configs, rotating secrets in many places, and dealing with protocol quirks.
		</p>
		<p class="text-sm text-muted-foreground">
			LLM Link sits in the middle as a single proxy between your tools and upstream LLM providers. You
			configure providers and routing once, then point Zed.dev, Codex CLI, and other clients
			to LLM Link. It unifies protocols, centralizes API key management, and makes it easy to experiment
			with different providers without rebuilding your setup.
		</p>
		<div class="grid gap-4 md:grid-cols-2">
			{#each features as feature}
				<div class="rounded-lg border bg-card p-5">
					<h3 class="font-semibold mb-2">{feature.title}</h3>
					<p class="text-sm text-muted-foreground">{feature.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Supported Providers Section -->
	<section class="space-y-6">
		<h2 class="text-2xl font-semibold flex items-center">
			<Layers class="h-6 w-6 mr-2 text-primary" />
			Supported LLM Providers
		</h2>
		<p class="text-sm text-muted-foreground">
			LLM Link supports {providerCount} major LLM providers with unified API access
		</p>

		<!-- Stats -->
		<div class="grid gap-4 md:grid-cols-3 mb-8">
			<div class="rounded-lg border bg-card p-6 text-center">
				<p class="text-sm text-muted-foreground uppercase mb-2">Total Providers</p>
				<p class="text-4xl font-bold">{providerCount}</p>
				<p class="text-xs text-muted-foreground mt-2">Unified API access</p>
			</div>
			<div class="rounded-lg border bg-card p-6 text-center">
				<p class="text-sm text-muted-foreground uppercase mb-2">Native APIs</p>
				<p class="text-4xl font-bold">{nativeProviders.length}</p>
				<p class="text-xs text-muted-foreground mt-2">Custom implementations</p>
			</div>
			<div class="rounded-lg border bg-card p-6 text-center">
				<p class="text-sm text-muted-foreground uppercase mb-2">OpenAI Compatible</p>
				<p class="text-4xl font-bold">{compatibleProviders.length}</p>
				<p class="text-xs text-muted-foreground mt-2">Standard protocol</p>
			</div>
		</div>

		<!-- Provider List -->
		<div class="space-y-4 mb-8">
			{#each providers as provider}
				<Accordion title={provider.name}>
					<div class="grid md:grid-cols-2 gap-6">
						<div class="space-y-4">
							<div>
								<h4 class="text-sm font-medium text-muted-foreground mb-2">Description</h4>
								<p class="text-sm">{provider.description}</p>
							</div>
							
							<div>
								<h4 class="text-sm font-medium text-muted-foreground mb-2">Popular Models</h4>
								<div class="flex flex-wrap gap-2">
									{#each provider.models as model}
										<span class="bg-muted px-3 py-1 rounded-md text-sm">{model}</span>
									{/each}
								</div>
							</div>

							<div>
								<h4 class="text-sm font-medium text-muted-foreground mb-2">Features</h4>
								<div class="flex flex-wrap gap-2">
									{#each provider.features as feature}
										<span class="bg-primary/10 text-primary px-3 py-1 rounded-md text-sm flex items-center gap-1">
											<Check class="h-3 w-3" />
											{feature}
										</span>
									{/each}
								</div>
							</div>
						</div>

						<div class="space-y-4">
							<div>
								<h4 class="text-sm font-medium text-muted-foreground mb-2">Configuration</h4>
								<div class="space-y-2">
									<div class="flex items-center justify-between text-sm">
										<span class="text-muted-foreground">API Type:</span>
										<code class="bg-muted px-2 py-1 rounded text-xs">{provider.apiType}</code>
									</div>
									<div class="flex items-center justify-between text-sm">
										<span class="text-muted-foreground">Base URL:</span>
										<code class="bg-muted px-2 py-1 rounded text-xs truncate max-w-xs">{provider.baseUrl}</code>
									</div>
								</div>
							</div>

							<div>
								<a 
									href={provider.website} 
									target="_blank" 
									rel="noopener noreferrer"
									class="inline-flex items-center gap-2 text-sm text-primary hover:underline"
								>
									Visit official website
									<ExternalLink class="h-4 w-4" />
								</a>
							</div>
						</div>
					</div>
				</Accordion>
			{/each}
		</div>
	</section>

	<section class="space-y-6">
		<h2 class="text-2xl font-semibold">Next steps</h2>
		<p class="text-sm text-muted-foreground">
			Continue with installation and architecture details in the dedicated guides.
		</p>
		<div class="grid gap-4 md:grid-cols-2">
			<div class="rounded-lg border bg-card p-5 space-y-2">
				<h3 class="font-semibold">Quick Start</h3>
				<p class="text-sm text-muted-foreground">
					Step-by-step installation, key configuration, and running your first proxy.
				</p>
				<a href="{basePath}/docs/quick-start" class="text-sm text-primary hover:underline">
					Open Quick Start guide
				</a>
			</div>
			<div class="rounded-lg border bg-card p-5 space-y-2">
				<h3 class="font-semibold">Architecture</h3>
				<p class="text-sm text-muted-foreground">
					High-level diagram of clients, protocol adapters, and provider connectors.
				</p>
				<a href="{basePath}/docs/architecture" class="text-sm text-primary hover:underline">
					Open Architecture overview
				</a>
			</div>
		</div>
	</section>

	<!-- Footer Links -->
	<div class="flex gap-3 justify-center pt-8 border-t">
		<Button size="lg" href="https://github.com/lipish/llm-link">
			<Github class="mr-2 h-4 w-4" />
			GitHub
		</Button>
	</div>
</div>
