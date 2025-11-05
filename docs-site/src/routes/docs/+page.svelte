<script>
	import Button from '$lib/components/ui/button.svelte';
	import { Github, Terminal, Package, Zap } from 'lucide-svelte';
	
	const curlCommand = `curl -X POST http://localhost:8088/api/config/update \\
  -H "Content-Type: application/json" \\
  -d '{"provider": "openai", "api_key": "new_key"}'`;
</script>

<div class="container py-8">
	<div class="max-w-4xl mx-auto">
		<div class="mb-8">
			<h1 class="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
			<p class="text-lg text-muted-foreground">
				Get started with LLM Link in minutes. Choose your preferred installation method and start using the universal LLM proxy service.
			</p>
		</div>

		<div class="grid gap-8 md:grid-cols-2">
			<div class="space-y-6">
				<div class="rounded-lg border bg-card p-6">
					<div class="flex items-center mb-4">
						<Package class="h-6 w-6 mr-2" />
						<h2 class="text-2xl font-semibold">Installation</h2>
					</div>
					
					<div class="space-y-4">
						<div>
							<h3 class="text-lg font-medium mb-2">Option 1: Install from crates.io (Recommended)</h3>
							<div class="bg-muted rounded-md p-4">
								<code class="text-sm">cargo install llm-link</code>
							</div>
						</div>
						
						<div>
							<h3 class="text-lg font-medium mb-2">Option 2: Build from source</h3>
							<div class="bg-muted rounded-md p-4">
								<code class="text-sm">git clone https://github.com/lipish/llm-link.git<br>cd llm-link<br>cargo build --release</code>
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-lg border bg-card p-6">
					<div class="flex items-center mb-4">
						<Terminal class="h-6 w-6 mr-2" />
						<h2 class="text-2xl font-semibold">Quick Start</h2>
					</div>
					
					<div class="space-y-4">
						<div>
							<h3 class="text-lg font-medium mb-2">Start with application preset</h3>
							<div class="bg-muted rounded-md p-4">
								<code class="text-sm"># For Codex CLI<br>llm-link --app codex-cli<br><br># For Zed<br>llm-link --app zed<br><br># For Claude Code<br>llm-link --app claude-code</code>
							</div>
						</div>
						
						<div>
							<h3 class="text-lg font-medium mb-2">Or start with specific protocols</h3>
							<div class="bg-muted rounded-md p-4">
								<code class="text-sm">llm-link --protocols openai,anthropic,ollama</code>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-6">
				<div class="rounded-lg border bg-card p-6">
					<div class="flex items-center mb-4">
						<Zap class="h-6 w-6 mr-2" />
						<h2 class="text-2xl font-semibold">Configuration</h2>
					</div>
					
					<div class="space-y-4">
						<div>
							<h3 class="text-lg font-medium mb-2">Environment Variables</h3>
							<div class="bg-muted rounded-md p-4 text-sm">
								<p class="mb-2"><strong>Provider API Keys:</strong></p>
								<code>OPENAI_API_KEY=your_openai_key<br>ANTHROPIC_API_KEY=your_anthropic_key<br>ZHIPU_API_KEY=your_zhipu_key<br>ALIYUN_API_KEY=your_aliyun_key</code>
							</div>
						</div>
						
						<div>
							<h3 class="text-lg font-medium mb-2">Hot Reload Configuration</h3>
							<p class="text-sm text-muted-foreground mb-2">
								Update configuration without restart using the REST API:
							</p>
							<div class="bg-muted rounded-md p-4">
								<code class="text-sm">{curlCommand}</code>
							</div>
						</div>
					</div>
				</div>

				<div class="rounded-lg border bg-card p-6">
					<h2 class="text-2xl font-semibold mb-4">As a Rust Library</h2>
					
					<div class="space-y-4">
						<div>
							<h3 class="text-lg font-medium mb-2">Add to Cargo.toml</h3>
							<div class="bg-muted rounded-md p-4">
								<code class="text-sm">[dependencies]<br>llm-link = "0.3.4"</code>
							</div>
						</div>
						
						<div>
							<h3 class="text-lg font-medium mb-2">Usage Example</h3>
							<div class="bg-muted rounded-md p-4">
								<code class="text-sm">use llm_link::models::ModelsConfig;<br>use llm_link::provider::ProviderRegistry;<br><br>// List all providers<br>let providers = ProviderRegistry::list_providers();<br><br>// Get models for a provider<br>let models = ModelsConfig::load_with_fallback()<br>    .get_models_for_provider("openai");</code>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-12 text-center">
			<Button size="lg" href="https://github.com/lipish/llm-link">
				<Github class="mr-2 h-4 w-4" />
				View on GitHub
			</Button>
		</div>
	</div>
</div>
