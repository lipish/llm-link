<script>
	import Button from '$lib/components/ui/button.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import { Github, ExternalLink, Check } from 'lucide-svelte';
	import { providers } from '$lib/data/providers.js';

	const providerCount = providers.length;
	const nativeProviders = providers.filter((provider) => provider.apiType === 'Native');
	const compatibleProviders = providers.filter((provider) => provider.apiType !== 'Native');
</script>

<div class="container py-8 max-w-6xl mx-auto">
	<div class="text-center mb-12">
		<h1 class="text-4xl font-bold tracking-tight mb-4">Supported Providers</h1>
		<p class="text-lg text-muted-foreground">
			LLM Link supports {providerCount} major LLM providers with unified API access
		</p>
	</div>

	<!-- Stats -->
	<div class="grid gap-4 md:grid-cols-3 mb-12">
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
	<div class="space-y-4 mb-12">
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
									<span class="text-muted-foreground">Environment Variable:</span>
									<code class="bg-muted px-2 py-1 rounded text-xs">{provider.envVar}</code>
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

	<!-- Benefits -->
	<section class="mb-12">
		<div class="text-center mb-8">
			<h2 class="text-3xl font-bold tracking-tight mb-4">Why Use LLM Link?</h2>
			<p class="text-lg text-muted-foreground">
				Unified access with intelligent optimizations
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-3">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
					<Check class="h-6 w-6" />
				</div>
				<h3 class="text-lg font-semibold mb-2">Unified Interface</h3>
				<p class="text-sm text-muted-foreground">
					Access all providers through OpenAI, Ollama, or Anthropic API formats without changing client code
				</p>
			</div>
			
			<div class="rounded-lg border bg-card p-6">
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
					<Check class="h-6 w-6" />
				</div>
				<h3 class="text-lg font-semibold mb-2">Hot Reload</h3>
				<p class="text-sm text-muted-foreground">
					Update API keys and switch providers dynamically via REST API without service restart
				</p>
			</div>
			
			<div class="rounded-lg border bg-card p-6">
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4">
					<Check class="h-6 w-6" />
				</div>
				<h3 class="text-lg font-semibold mb-2">Smart Detection</h3>
				<p class="text-sm text-muted-foreground">
					Automatic client detection and protocol optimization for seamless integration
				</p>
			</div>
		</div>
	</section>

	<!-- CTA -->
	<div class="flex gap-3 justify-center pt-8 border-t">
		<Button size="lg" href="https://github.com/lipish/llm-link">
			<Github class="mr-2 h-4 w-4" />
			Get Started
		</Button>
	</div>
</div>
