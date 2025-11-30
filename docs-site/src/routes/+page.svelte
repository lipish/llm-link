<script>
	import Button from '$lib/components/ui/button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { Download, ArrowRight, Check } from 'lucide-svelte';
	import { base } from '$app/paths';

	const basePath = base;

	const integrations = [
		{ app: 'Aider', provider: 'Zhipu', model: 'GLM-4.6', status: '✅' },
		{ app: 'OpenHands', provider: 'Anthropic', model: 'Claude-3.5', status: '✅' },
		{ app: 'Codex CLI', provider: 'Aliyun', model: 'Qwen-2.5', status: '✅' },
		{ app: 'Zed.dev', provider: 'Ollama', model: 'Llama-3.1', status: '✅' },
	];
</script>

<section class="space-y-8 pb-12 pt-4 md:pb-16 md:pt-8 lg:py-16 bg-gray-50">
	<div class="container flex max-w-5xl flex-col items-center gap-4 text-center">
		<div class="w-full max-w-6xl my-4">
			<img src="/llmlink.jpg" alt="LLM Link Architecture" class="w-full h-auto" />
		</div>
		<p class="max-w-4xl text-lg text-muted-foreground sm:text-xl mx-auto">
			LLM Link bridges your favorite AI applications with any LLM provider through a unified proxy. 
			Use open-source models with commercial tools, switch providers instantly, and reduce costs.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-4">
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

<!-- Integration Matching Table -->
<section class="border-t bg-muted/30 py-16">
	<div class="container mx-auto max-w-5xl space-y-8">
		<div class="space-y-3 text-center">
			<h2 class="text-3xl font-bold tracking-tight">Application + Provider = ✅ Working Integration</h2>
			<p class="text-muted-foreground">Mix and match any AI tool with any LLM provider</p>
		</div>
		
		<div class="rounded-lg border bg-card overflow-hidden">
			<table class="w-full">
				<thead class="bg-muted/50">
					<tr>
						<th class="text-left p-4 font-semibold">AI Application</th>
						<th class="text-left p-4 font-semibold">LLM Provider</th>
						<th class="text-left p-4 font-semibold">Model</th>
						<th class="text-center p-4 font-semibold">Status</th>
					</tr>
				</thead>
				<tbody>
					{#each integrations as integration}
						<tr class="border-t hover:bg-muted/30">
							<td class="p-4 font-medium">{integration.app}</td>
							<td class="p-4">{integration.provider}</td>
							<td class="p-4 text-muted-foreground">{integration.model}</td>
							<td class="p-4 text-center">
								<span class="inline-flex items-center justify-center rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 w-6 h-6 text-xs font-bold">
									{integration.status}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		
		<div class="text-center">
			<p class="text-sm text-muted-foreground mb-4">
				Supports 10+ LLM providers: Zhipu, Anthropic, OpenAI, Aliyun, Volcengine, Moonshot, Minimax, Tencent, Longcat, Ollama
			</p>
			<Button variant="outline" href="{basePath}/docs">
				View All Providers & Applications
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
	</div>
</section>

<!-- Quick Start -->
<section id="quickstart" class="py-16">
	<div class="container mx-auto max-w-4xl space-y-8">
		<div class="space-y-3 text-center">
			<h2 class="text-3xl font-bold tracking-tight">Quick Start</h2>
			<p class="text-muted-foreground">Get started in 2 minutes</p>
		</div>
		
		<div class="space-y-6">
			<div class="rounded-lg border bg-card p-6">
				<h4 class="font-semibold mb-3">1. Install LLM Link</h4>
				<CodeBlock code="cargo install llm-link" language="bash" />
			</div>
			
			<div class="rounded-lg border bg-card p-6">
				<h4 class="font-semibold mb-3">2. Start with your preferred provider</h4>
				<CodeBlock code={'# Use Aider with Zhipu GLM-4.6\nllm-link --app aider --provider zhipu --model glm-4.6 --api-key "your-zhipu-key"\n\n# Use OpenHands with Anthropic Claude\nllm-link --app openhands --provider anthropic --model claude-3-5-sonnet --api-key "your-anthropic-key"'} language="bash" />
			</div>
			
			<div class="rounded-lg border bg-card p-6">
				<h4 class="font-semibold mb-3">3. Configure your AI tool</h4>
				<p class="text-sm text-muted-foreground mb-2">Point your AI application to the local proxy:</p>
				<CodeBlock code={'# For OpenAI-compatible tools\nBase URL: http://localhost:8090/v1\nAPI Key: your-auth-key\n\n# For Ollama-compatible tools  \nBase URL: http://localhost:11434/api'} language="bash" />
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-t bg-muted/40">
	<div class="container flex flex-col items-center gap-4 py-12 text-center">
		<h3 class="text-2xl font-semibold">Ready to connect your AI tools?</h3>
		<p class="max-w-2xl text-muted-foreground">
			Start using any LLM provider with your favorite AI applications in minutes.
		</p>
		<div class="flex gap-3">
			<Button size="lg" href="{basePath}/docs">
				View Documentation
			</Button>
			<Button variant="outline" size="lg" href="https://github.com/lipish/llm-link">
				<ArrowRight class="mr-2 h-4 w-4" />
				GitHub
			</Button>
		</div>
	</div>
</section>
