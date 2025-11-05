<script>
	import Button from '$lib/components/ui/button.svelte';
	import { Github, Terminal, Package, Zap, Code, Settings, Key, Globe, Check, AlertCircle } from 'lucide-svelte';
	import { base } from '$app/paths';
	
	const basePath = base;
	
	const curlCommand = `curl -X POST http://localhost:8088/api/config/update \\
  -H "Content-Type: application/json" \\
  -d '{"provider": "openai", "api_key": "new_key"}'`;
	
	const rustExample1 = `use llm_link::provider::ProviderRegistry;

// List all available providers
let providers = ProviderRegistry::list_providers();
println!("Available providers: {:?}", providers)`;
	
	const rustExample2 = `use llm_link::models::ModelsConfig;

// Load models configuration
let models = ModelsConfig::load_with_fallback()
    .get_models_for_provider("openai");

for model in models {
    println!("Model: {}", model.name);
}`;
	
	const rustExample3 = `use llm_link::provider::{Provider, ProviderConfig};
use llm_link::provider::openai::OpenAIProvider;

let config = ProviderConfig {
    api_key: "your_key".to_string(),
    base_url: None,
};

let client = OpenAIProvider::create_client(&config)?;
// Use client for chat completions`;
	
	const providers = [
		{
			name: 'OpenAI',
			description: 'Leading AI models including GPT-4, GPT-3.5, and more',
			models: ['GPT-4', 'GPT-4 Turbo', 'GPT-3.5 Turbo'],
			envVar: 'OPENAI_API_KEY',
			apiType: 'Native',
			baseUrl: 'https://api.openai.com/v1',
			features: ['Streaming', 'Function Calling', 'Vision']
		},
		{
			name: 'Anthropic',
			description: 'Advanced Claude models with strong reasoning capabilities',
			models: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku', 'Claude 3 Opus'],
			envVar: 'ANTHROPIC_API_KEY',
			apiType: 'Native',
			baseUrl: 'https://api.anthropic.com',
			features: ['Streaming', 'Long Context', 'Vision']
		},
		{
			name: 'Zhipu AI',
			description: 'Chinese AI models with multilingual support',
			models: ['GLM-4.6', 'GLM-4.5', 'GLM-4'],
			envVar: 'ZHIPU_API_KEY',
			apiType: 'OpenAI Compatible',
			baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
			features: ['Streaming', 'Multilingual', 'Code Generation']
		},
		{
			name: 'Aliyun',
			description: 'Alibaba Cloud\'s powerful Qwen models',
			models: ['Qwen3 Max', 'Qwen3 Plus', 'Qwen3 Turbo'],
			envVar: 'ALIYUN_API_KEY',
			apiType: 'Native',
			baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
			features: ['Streaming', 'Long Context', 'Multilingual']
		},
		{
			name: 'Volcengine',
			description: 'ByteDance\'s advanced Doubao models',
			models: ['Doubao Seed 1.6', 'Doubao Pro', 'Doubao Lite'],
			envVar: 'VOLCENGINE_API_KEY',
			apiType: 'Native',
			baseUrl: 'https://ark.cn-beijing.volces.com/api/v3',
			features: ['Streaming', 'Cost Effective', 'Fast Response']
		},
		{
			name: 'Tencent',
			description: 'Tencent\'s Hunyuan models for various applications',
			models: ['Hunyuan T1', 'Hunyuan A13B', 'Hunyuan Turbos'],
			envVar: 'TENCENT_API_KEY',
			apiType: 'Native',
			baseUrl: 'https://hunyuan.tencentcloudapi.com',
			features: ['Streaming', 'Chinese Optimized', 'Enterprise Ready']
		},
		{
			name: 'Longcat',
			description: 'High-performance models for general dialogue',
			models: ['LongCat Flash Chat', 'LongCat Flash Thinking'],
			envVar: 'LONGCAT_API_KEY',
			apiType: 'OpenAI Compatible',
			baseUrl: 'https://api.longcat.ai/v1',
			features: ['Streaming', 'Fast Response', 'Cost Effective']
		},
		{
			name: 'Moonshot',
			description: 'Kimi models with large context windows',
			models: ['Kimi K2 Turbo', 'Kimi K2', 'Kimi K1.5'],
			envVar: 'MOONSHOT_API_KEY',
			apiType: 'OpenAI Compatible',
			baseUrl: 'https://api.moonshot.cn/v1',
			features: ['Streaming', '200K Context', 'Document Processing']
		},
		{
			name: 'Minimax',
			description: 'Powerful AI models with OpenAI-compatible API',
			models: ['MiniMax-M2', 'MiniMax-H2', 'MiniMax-T2'],
			envVar: 'MINIMAX_API_KEY',
			apiType: 'OpenAI Compatible',
			baseUrl: 'https://api.minimaxi.com/v1',
			features: ['Streaming', 'Multilingual', 'Fast Response']
		},
		{
			name: 'Ollama',
			description: 'Local and open-source models',
			models: ['Llama 2', 'Mistral', 'Code Llama', 'Custom Models'],
			envVar: 'None Required',
			apiType: 'Native',
			baseUrl: 'http://localhost:11434',
			features: ['Local Deployment', 'Privacy', 'Custom Models']
		}
	];
</script>

<div class="container py-8">
	<div class="max-w-6xl mx-auto">
		<div class="mb-8">
			<h1 class="text-4xl font-bold tracking-tight mb-4">Documentation</h1>
			<p class="text-lg text-muted-foreground">
				Complete guide to setting up and using LLM Link with 10 major LLM providers. 
				Universal proxy service with hot-reload configuration and multiple API format support.
			</p>
		</div>

		<!-- Installation Section -->
		<section class="mb-12">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex items-center mb-6">
					<Package class="h-6 w-6 mr-2 text-primary" />
					<h2 class="text-2xl font-semibold">Installation</h2>
				</div>
				
				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<h3 class="text-lg font-medium mb-3 flex items-center">
							<Check class="h-4 w-4 mr-2 text-green-600" />
							Option 1: Install from crates.io (Recommended)
						</h3>
						<div class="bg-muted rounded-md p-4">
							<code class="text-sm font-mono">cargo install llm-link</code>
						</div>
						<p class="text-sm text-muted-foreground mt-2">
							Installs the latest stable version from Rust package registry
						</p>
					</div>
					
					<div>
						<h3 class="text-lg font-medium mb-3 flex items-center">
							<Code class="h-4 w-4 mr-2 text-blue-600" />
							Option 2: Build from source
						</h3>
						<div class="bg-muted rounded-md p-4">
							<code class="text-sm font-mono">git clone https://github.com/lipish/llm-link.git<br>cd llm-link<br>cargo build --release</code>
						</div>
						<p class="text-sm text-muted-foreground mt-2">
							Get the latest features from the main branch
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Quick Start Section -->
		<section class="mb-12">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex items-center mb-6">
					<Terminal class="h-6 w-6 mr-2 text-primary" />
					<h2 class="text-2xl font-semibold">Quick Start</h2>
				</div>
				
				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-medium mb-3">Start with Application Presets</h3>
						<p class="text-sm text-muted-foreground mb-3">
							Optimized configurations for popular AI coding tools:
						</p>
						<div class="bg-muted rounded-md p-4">
							<code class="text-sm font-mono">
# For Codex CLI (GitHub Copilot CLI)<br>
llm-link --app codex-cli<br><br>
# For Zed editor<br>
llm-link --app zed<br><br>
# For Claude Code<br>
llm-link --app claude-code<br><br>
# For Continue.dev<br>
llm-link --app continue
							</code>
						</div>
					</div>
					
					<div>
						<h3 class="text-lg font-medium mb-3">Start with Specific Protocols</h3>
						<p class="text-sm text-muted-foreground mb-3">
							Choose which API protocols to enable:
						</p>
						<div class="bg-muted rounded-md p-4">
							<code class="text-sm font-mono">
# Enable specific protocols<br>
llm-link --protocols openai,anthropic,ollama<br><br>
# Enable all protocols<br>
llm-link --protocols all<br><br>
# Start on custom port<br>
llm-link --port 8088 --protocols openai,anthropic
							</code>
						</div>
					</div>
					
					<div>
						<h3 class="text-lg font-medium mb-3">Optional API Key Startup</h3>
						<div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
							<div class="flex items-start">
								<AlertCircle class="h-4 w-4 mr-2 text-yellow-600 mt-0.5" />
								<div>
									<p class="text-sm text-yellow-800">
										<strong>New in v0.3.3:</strong> LLM Link can now start without API keys!
									</p>
									<p class="text-sm text-yellow-700 mt-1">
										Service starts normally and displays warnings for missing keys. 
										Configure API keys later using hot-reload API.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Provider Configuration Section -->
		<section class="mb-12">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex items-center mb-6">
					<Settings class="h-6 w-6 mr-2 text-primary" />
					<h2 class="text-2xl font-semibold">Provider Configuration</h2>
				</div>
				
				<div class="mb-6">
					<h3 class="text-lg font-medium mb-3">Environment Variables</h3>
					<p class="text-sm text-muted-foreground mb-4">
						Set API keys as environment variables. For Ollama, no API key is required.
					</p>
					
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{#each providers as provider}
							<div class="border rounded-lg p-4">
								<div class="flex items-center mb-2">
									<Key class="h-4 w-4 mr-2 text-primary" />
									<h4 class="font-medium">{provider.name}</h4>
								</div>
								<div class="bg-muted rounded p-2 mb-2">
									<code class="text-xs font-mono">{provider.envVar}</code>
								</div>
								<p class="text-xs text-muted-foreground mb-2">
									{provider.description}
								</p>
								<div class="flex flex-wrap gap-1">
									{#each provider.features as feature}
										<span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
											{feature}
										</span>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
				
				<div>
					<h3 class="text-lg font-medium mb-3">Configuration File (Optional)</h3>
					<p class="text-sm text-muted-foreground mb-3">
						Create a <code>keys.yaml</code> file in the project directory:
					</p>
					<div class="bg-muted rounded-md p-4">
						<code class="text-sm font-mono">
providers:<br>
&nbsp;openai:<br>
&nbsp;&nbsp;api_key: "your_openai_key"<br>
&nbsp;anthropic:<br>
&nbsp;&nbsp;api_key: "your_anthropic_key"<br>
&nbsp;zhipu:<br>
&nbsp;&nbsp;api_key: "your_zhipu_key"<br>
&nbsp;# ... other providers
						</code>
					</div>
				</div>
			</div>
		</section>

		<!-- Hot Reload Section -->
		<section class="mb-12">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex items-center mb-6">
					<Zap class="h-6 w-6 mr-2 text-primary" />
					<h2 class="text-2xl font-semibold">Hot Reload Configuration</h2>
				</div>
				
				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-medium mb-3">Dynamic Configuration Update</h3>
						<p class="text-sm text-muted-foreground mb-3">
							Update provider configurations without restarting the service using the REST API:
						</p>
						<div class="bg-muted rounded-md p-4">
							<code class="text-sm font-mono">{curlCommand}</code>
						</div>
					</div>
					
					<div>
						<h3 class="text-lg font-medium mb-3">Available API Endpoints</h3>
						<div class="grid gap-4 md:grid-cols-2">
							<div class="border rounded-lg p-4">
								<h4 class="font-medium mb-2">Update Configuration</h4>
								<code class="text-xs font-mono">POST /api/config/update</code>
								<p class="text-xs text-muted-foreground mt-1">
									Update provider API keys and settings
								</p>
							</div>
							<div class="border rounded-lg p-4">
								<h4 class="font-medium mb-2">List Models</h4>
								<code class="text-xs font-mono">GET /api/models</code>
								<p class="text-xs text-muted-foreground mt-1">
									Get available models for all providers
								</p>
							</div>
							<div class="border rounded-lg p-4">
								<h4 class="font-medium mb-2">Provider Status</h4>
								<code class="text-xs font-mono">GET /api/providers</code>
								<p class="text-xs text-muted-foreground mt-1">
									Check status of all configured providers
								</p>
							</div>
							<div class="border rounded-lg p-4">
								<h4 class="font-medium mb-2">Health Check</h4>
								<code class="text-xs font-mono">GET /api/health</code>
								<p class="text-xs text-muted-foreground mt-1">
									Service health and version information
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- API Protocols Section -->
		<section class="mb-12">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex items-center mb-6">
					<Globe class="h-6 w-6 mr-2 text-primary" />
					<h2 class="text-2xl font-semibold">API Protocols</h2>
				</div>
				
				<div class="grid gap-6 md:grid-cols-3">
					<div class="border rounded-lg p-4">
						<h3 class="font-medium mb-2">OpenAI API</h3>
						<p class="text-sm text-muted-foreground mb-3">
							Compatible with OpenAI's API format
						</p>
						<div class="bg-muted rounded p-2 mb-2">
							<code class="text-xs font-mono">Endpoint: /v1</code>
						</div>
						<p class="text-xs text-muted-foreground">
							Supports chat completions, streaming, function calling
						</p>
					</div>
					
					<div class="border rounded-lg p-4">
						<h3 class="font-medium mb-2">Anthropic API</h3>
						<p class="text-sm text-muted-foreground mb-3">
							Native Anthropic Claude API
						</p>
						<div class="bg-muted rounded p-2 mb-2">
							<code class="text-xs font-mono">Endpoint: /v1/messages</code>
						</div>
						<p class="text-xs text-muted-foreground">
							Supports messages API, streaming, long context
						</p>
					</div>
					
					<div class="border rounded-lg p-4">
						<h3 class="font-medium mb-2">Ollama API</h3>
						<p class="text-sm text-muted-foreground mb-3">
							Compatible with Ollama's API format
						</p>
						<div class="bg-muted rounded p-2 mb-2">
							<code class="text-xs font-mono">Endpoint: /api/generate</code>
						</div>
						<p class="text-xs text-muted-foreground">
							Supports local models, custom models, streaming
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Rust Library Section -->
		<section class="mb-12">
			<div class="rounded-lg border bg-card p-6">
				<div class="flex items-center mb-6">
					<Code class="h-6 w-6 mr-2 text-primary" />
					<h2 class="text-2xl font-semibold">As a Rust Library</h2>
				</div>
				
				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-medium mb-3">Add to Cargo.toml</h3>
						<div class="bg-muted rounded-md p-4">
							<code class="text-sm font-mono">[dependencies]<br>llm-link = "0.3.5"</code>
						</div>
					</div>
					
					<div>
						<h3 class="text-lg font-medium mb-3">Usage Examples</h3>
						<div class="space-y-4">
							<div>
								<h4 class="font-medium mb-2">List All Providers</h4>
								<div class="bg-muted rounded-md p-4">
									<code class="text-sm font-mono">{rustExample1}</code>
								</div>
							</div>
							
							<div>
								<h4 class="font-medium mb-2">Get Models for Provider</h4>
								<div class="bg-muted rounded-md p-4">
									<code class="text-sm font-mono">{rustExample2}</code>
								</div>
							</div>
							
							<div>
								<h4 class="font-medium mb-2">Create LLM Client</h4>
								<div class="bg-muted rounded-md p-4">
									<code class="text-sm font-mono">{rustExample3}</code>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Troubleshooting Section -->
		<section class="mb-12">
			<div class="rounded-lg border bg-card p-6">
				<h2 class="text-2xl font-semibold mb-6">Troubleshooting</h2>
				
				<div class="space-y-4">
					<div class="border-l-4 border-yellow-400 pl-4">
						<h3 class="font-medium mb-2">Service fails to start</h3>
						<p class="text-sm text-muted-foreground">
							Check if required ports are available. Use <code>--port</code> to specify a different port.
						</p>
					</div>
					
					<div class="border-l-4 border-blue-400 pl-4">
						<h3 class="font-medium mb-2">API key not working</h3>
						<p class="text-sm text-muted-foreground">
							Verify API key format and permissions. Use hot-reload API to update keys without restart.
						</p>
					</div>
					
					<div class="border-l-4 border-green-400 pl-4">
						<h3 class="font-medium mb-2">Ollama connection failed</h3>
						<p class="text-sm text-muted-foreground">
							Ensure Ollama is running on localhost:11434. Use <code>ollama pull</code> to download models.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA Section -->
		<div class="mt-12 text-center">
			<Button size="lg" href="https://github.com/lipish/llm-link">
				<Github class="mr-2 h-4 w-4" />
				View on GitHub
			</Button>
			<Button variant="outline" size="lg" href="{basePath}/api" class="ml-4">
				<Code class="mr-2 h-4 w-4" />
				API Reference
			</Button>
			<Button variant="outline" size="lg" href="{basePath}/providers" class="ml-4">
				<Globe class="mr-2 h-4 w-4" />
				View All Providers
			</Button>
		</div>
	</div>
</div>
