<script>
	import Button from '$lib/components/ui/button.svelte';
	import { Github, Check, ExternalLink } from 'lucide-svelte';
	import { providers } from '$lib/data/providers.js';

	const providerCount = providers.length;
	const nativeProviders = providers.filter((provider) => provider.apiType === 'Native');
	const compatibleProviders = providers.filter((provider) => provider.apiType !== 'Native');
</script>

<div class="container py-8">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12">
			<h1 class="text-4xl font-bold tracking-tight mb-4">Supported Providers</h1>
			<p class="text-lg text-muted-foreground">
				LLM Link 支持 {providerCount} 个 LLM Provider，覆盖 Native 与 OpenAI-Compatible API 类型。
			</p>
		</div>

		<div class="grid gap-4 md:grid-cols-3 mb-10">
			<div class="rounded-lg border bg-card p-4">
				<p class="text-xs text-muted-foreground uppercase">Provider 数量</p>
				<p class="text-3xl font-bold">{providerCount}</p>
				<p class="text-xs text-muted-foreground">统一格式暴露，便于协议切换</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="text-xs text-muted-foreground uppercase">Native API</p>
				<p class="text-3xl font-bold">{nativeProviders.length}</p>
				<p class="text-xs text-muted-foreground">OpenAI / Anthropic / Volcengine / Ollama ...</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<p class="text-xs text-muted-foreground uppercase">OpenAI-Compatible</p>
				<p class="text-3xl font-bold">{compatibleProviders.length}</p>
				<p class="text-xs text-muted-foreground">Zhipu / Moonshot / Minimax / Longcat ...</p>
			</div>
		</div>

		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each providers as provider}
				<div class="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
					<div class="flex items-start justify-between mb-4">
						<h3 class="text-xl font-semibold">{provider.name}</h3>
						<a 
							href={provider.website} 
							target="_blank" 
							rel="noopener noreferrer"
							class="text-muted-foreground hover:text-foreground"
						>
							<ExternalLink class="h-4 w-4" />
						</a>
					</div>
					
					<p class="text-sm text-muted-foreground mb-4">{provider.description}</p>
					
					<div class="space-y-3">
						<div>
							<h4 class="text-sm font-medium mb-1">Popular Models</h4>
							<div class="flex flex-wrap gap-1">
								{#each provider.models.slice(0, 3) as model}
									<span class="bg-muted px-2 py-1 rounded text-xs">{model}</span>
								{/each}
								{#if provider.models.length > 3}
									<span class="text-xs text-muted-foreground">+{provider.models.length - 3} more</span>
								{/if}
							</div>
						</div>
						
						<div class="space-y-1">
							<div class="flex items-center text-sm">
								<span class="font-medium mr-2">API Key:</span>
								<code class="bg-muted px-2 py-0.5 rounded text-xs">{provider.envVar}</code>
							</div>
							<div class="flex items-center text-sm">
								<span class="font-medium mr-2">API Type:</span>
								<span class="bg-muted px-2 py-0.5 rounded text-xs">{provider.apiType}</span>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="mt-16 space-y-8">
			<div class="text-center">
				<h2 class="text-3xl font-bold tracking-tight mb-4">Why Choose LLM Link?</h2>
				<p class="text-lg text-muted-foreground">
					Unified access to multiple providers with intelligent optimizations
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-3">
				<div class="text-center space-y-3">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<Check class="h-6 w-6" />
					</div>
					<h3 class="text-lg font-semibold">Unified API</h3>
					<p class="text-sm text-muted-foreground">
						Access all providers through OpenAI, Ollama, or Anthropic API formats
					</p>
				</div>
				
				<div class="text-center space-y-3">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<Check class="h-6 w-6" />
					</div>
					<h3 class="text-lg font-semibold">Smart Detection</h3>
					<p class="text-sm text-muted-foreground">
						Automatic client detection and format optimization
					</p>
				</div>
				
				<div class="text-center space-y-3">
					<div class="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
						<Check class="h-6 w-6" />
					</div>
					<h3 class="text-lg font-semibold">Hot Reload</h3>
					<p class="text-sm text-muted-foreground">
						Update API keys and switch providers without service restart
					</p>
				</div>
			</div>
		</div>

		<div class="mt-12 text-center">
			<Button size="lg" href="https://github.com/lipish/llm-link">
				<Github class="mr-2 h-4 w-4" />
				Get Started
			</Button>
		</div>
	</div>
</div>
