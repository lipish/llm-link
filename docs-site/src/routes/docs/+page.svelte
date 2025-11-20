<script>
	import Button from '$lib/components/ui/button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import { Github, BookOpen, Zap, Settings, Globe } from 'lucide-svelte';
	import { base } from '$app/paths';

	const basePath = base;

	const features = [
		{
			title: 'Multi-Provider Support',
			description: 'Connect to 10+ LLM providers including OpenAI, Anthropic, Zhipu, Volcengine, and more through a single unified interface.'
		},
		{
			title: 'Protocol Flexibility',
			description: 'Expose OpenAI, Ollama, or Anthropic-compatible APIs. Switch protocols without changing your client code.'
		},
		{
			title: 'Hot Configuration Reload',
			description: 'Update API keys, switch providers, and modify settings via REST API without service restart.'
		},
		{
			title: 'App Presets',
			description: 'Pre-configured setups for Zed, Continue.dev, Cursor, and other popular AI coding tools.'
		}
	];
</script>

<div class="container py-8 max-w-5xl mx-auto">
	<div class="mb-12">
		<h1 class="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
		<p class="text-lg text-muted-foreground">
			Complete guide to LLM Link - a universal proxy for multiple LLM providers with hot-reload configuration and multi-protocol support.
		</p>
	</div>

	<!-- Key Features -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-6 flex items-center">
			<BookOpen class="h-6 w-6 mr-2 text-primary" />
			Key Features
		</h2>
		<div class="grid gap-4 md:grid-cols-2">
			{#each features as feature}
				<div class="rounded-lg border bg-card p-5">
					<h3 class="font-semibold mb-2">{feature.title}</h3>
					<p class="text-sm text-muted-foreground">{feature.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<!-- Installation -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-6 flex items-center">
			<Settings class="h-6 w-6 mr-2 text-primary" />
			Installation
		</h2>
		<div class="space-y-4">
			<Accordion title="Install via Cargo (Recommended)" open={true}>
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Install from crates.io:</p>
					<CodeBlock code="cargo install llm-link" language="bash" />
				</div>
			</Accordion>

			<Accordion title="Install via Homebrew (macOS)">
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Add tap and install:</p>
					<CodeBlock code="brew tap lipish/llm-link\nbrew install llm-link" language="bash" />
				</div>
			</Accordion>

			<Accordion title="Build from Source">
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Clone and build:</p>
					<CodeBlock code="git clone https://github.com/lipish/llm-link.git\ncd llm-link\ncargo build --release" language="bash" />
				</div>
			</Accordion>
		</div>
	</section>

	<!-- Configuration -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-6 flex items-center">
			<Zap class="h-6 w-6 mr-2 text-primary" />
			Configuration
		</h2>
		<div class="space-y-4">
			<Accordion title="Environment Variables" open={true}>
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Set API keys via environment variables:</p>
					<CodeBlock code={'export OPENAI_API_KEY="sk-..."\nexport ANTHROPIC_API_KEY="sk-ant-..."\nexport ZHIPU_API_KEY="..."\nexport VOLCENGINE_API_KEY="..."\n\nllm-link --protocols all'} language="bash" />
				</div>
			</Accordion>

			<Accordion title="Configuration File (keys.yaml)">
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Create a keys.yaml file in your project directory:</p>
					<CodeBlock code={'providers:\n  openai:\n    api_key: "sk-..."\n  anthropic:\n    api_key: "sk-ant-..."\n  zhipu:\n    api_key: "..."\n  volcengine:\n    api_key: "..."\n    base_url: "https://ark.cn-beijing.volces.com/api/v3"'} language="yaml" />
				</div>
			</Accordion>

			<Accordion title="Hot Reload API">
				<div class="space-y-3">
					<p class="text-sm text-muted-foreground">Update configuration without restart:</p>
					<CodeBlock code={'curl -X POST http://localhost:8088/api/config/update \\\n  -H "Content-Type: application/json" \\\n  -d \'{"provider": "openai", "api_key": "new_key"}\''} language="bash" />
				</div>
			</Accordion>
		</div>
	</section>

	<!-- Usage Examples -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-6 flex items-center">
			<Globe class="h-6 w-6 mr-2 text-primary" />
			Usage Examples
		</h2>
		<div class="space-y-4">
			<Accordion title="App Presets" open={true}>
				<div class="space-y-4">
					<div>
						<h4 class="font-medium mb-2">Zed Editor</h4>
						<CodeBlock code="llm-link --app zed" language="bash" />
						<p class="text-xs text-muted-foreground mt-2">Starts Ollama-compatible API on port 11434</p>
					</div>
					<div>
						<h4 class="font-medium mb-2">Continue.dev / Cursor</h4>
						<CodeBlock code="llm-link --app continue" language="bash" />
						<p class="text-xs text-muted-foreground mt-2">Starts OpenAI-compatible API on port 8088</p>
					</div>
				</div>
			</Accordion>

			<Accordion title="Protocol-Based Configuration">
				<div class="space-y-4">
					<div>
						<h4 class="font-medium mb-2">OpenAI Protocol</h4>
						<CodeBlock code="llm-link --protocols openai --port 8088" language="bash" />
					</div>
					<div>
						<h4 class="font-medium mb-2">Ollama Protocol</h4>
						<CodeBlock code="llm-link --protocols ollama --port 11434" language="bash" />
					</div>
					<div>
						<h4 class="font-medium mb-2">Anthropic Protocol</h4>
						<CodeBlock code="llm-link --protocols anthropic --port 8089" language="bash" />
					</div>
					<div>
						<h4 class="font-medium mb-2">Multiple Protocols</h4>
						<CodeBlock code="llm-link --protocols openai,ollama,anthropic" language="bash" />
					</div>
				</div>
			</Accordion>

			<Accordion title="Advanced Options">
				<div class="space-y-4">
					<div>
						<h4 class="font-medium mb-2">Custom Port</h4>
						<CodeBlock code="llm-link --port 9000 --protocols openai" language="bash" />
					</div>
					<div>
						<h4 class="font-medium mb-2">Specific Provider</h4>
						<CodeBlock code="llm-link --provider openai --model gpt-4" language="bash" />
					</div>
					<div>
						<h4 class="font-medium mb-2">Enable All Protocols</h4>
						<CodeBlock code="llm-link --protocols all" language="bash" />
					</div>
				</div>
			</Accordion>
		</div>
	</section>

	<!-- API Reference -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-6">API Endpoints</h2>
		<div class="grid gap-4 md:grid-cols-2">
			<div class="rounded-lg border bg-card p-4">
				<code class="text-sm font-mono text-primary">GET /api/health</code>
				<p class="text-sm text-muted-foreground mt-2">Service health and version</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<code class="text-sm font-mono text-primary">GET /api/providers</code>
				<p class="text-sm text-muted-foreground mt-2">List configured providers</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<code class="text-sm font-mono text-primary">GET /api/models</code>
				<p class="text-sm text-muted-foreground mt-2">Available models</p>
			</div>
			<div class="rounded-lg border bg-card p-4">
				<code class="text-sm font-mono text-primary">POST /api/config/update</code>
				<p class="text-sm text-muted-foreground mt-2">Update configuration</p>
			</div>
		</div>
	</section>

	<!-- Troubleshooting -->
	<section class="mb-12">
		<h2 class="text-2xl font-semibold mb-6">Troubleshooting</h2>
		<div class="space-y-4">
			<div class="border-l-4 border-yellow-400 pl-4 py-2">
				<h3 class="font-medium mb-1">Port already in use</h3>
				<p class="text-sm text-muted-foreground">Use <code>--port</code> flag to specify a different port</p>
			</div>
			<div class="border-l-4 border-blue-400 pl-4 py-2">
				<h3 class="font-medium mb-1">API key not working</h3>
				<p class="text-sm text-muted-foreground">Verify key format and use hot-reload API to update</p>
			</div>
			<div class="border-l-4 border-green-400 pl-4 py-2">
				<h3 class="font-medium mb-1">Connection timeout</h3>
				<p class="text-sm text-muted-foreground">Check network and provider base URL configuration</p>
			</div>
		</div>
	</section>

	<!-- Footer Links -->
	<div class="flex gap-3 justify-center pt-8 border-t">
		<Button size="lg" href="https://github.com/lipish/llm-link">
			<Github class="mr-2 h-4 w-4" />
			GitHub
		</Button>
		<Button variant="outline" size="lg" href="{basePath}/providers">
			View All Providers
		</Button>
		<Button variant="outline" size="lg" href="{basePath}/api">
			API Reference
		</Button>
	</div>
</div>
