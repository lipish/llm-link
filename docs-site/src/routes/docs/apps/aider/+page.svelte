<script lang="ts">
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import Badge from '$lib/components/Badge.svelte';

	const basePath = base;
</script>

<svelte:head>
	<title>Aider Integration | LLM Link</title>
</svelte:head>

<div class="prose prose-slate max-w-none">
	<h1>Aider Integration</h1>
	
	<p>
		Aider is an AI pair programming tool that works in your terminal. LLM Link provides seamless integration with Aider using OpenAI-compatible APIs.
	</p>

	<Alert type="info">
		<strong>Recommended Models:</strong> Use open-source models like GLM-4.6, Qwen3 Coder Plus, MiniMax M2, or Moonshot K2 for better performance and cost efficiency.
	</Alert>

	<h2>Quick Start</h2>

	<h3>Option 1: Using Startup Script (Recommended)</h3>

	<CodeBlock code="./scripts/start-aider.sh" language="bash" />

	<p>This will start Aider with the recommended Zhipu GLM-4.6 model by default.</p>

	<h3>Option 2: Manual Configuration</h3>

	<ol>
		<li>
			<strong>Start LLM Link:</strong>
			<CodeBlock code="./llm-link --app aider --provider zhipu --model glm-4.6 --api-key your-zhipu-key" language="bash" />
		</li>
		<li>
			<strong>Set environment variables:</strong>
			<CodeBlock code={`export OPENAI_API_BASE=http://localhost:8090/v1
export OPENAI_API_KEY="your-auth-token"`} language="bash" />
		</li>
		<li>
			<strong>Run Aider:</strong>
			<CodeBlock code="aider --model openai/glm-4.6" language="bash" />
		</li>
	</ol>

	<h2>Supported Models</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
		<div class="border rounded-lg p-4">
			<h4 class="font-semibold mb-2">🔥 Recommended</h4>
			<ul class="space-y-1 text-sm">
				<li><Badge variant="secondary">Zhipu</Badge> GLM-4.6 - 200K context, strong coding</li>
				<li><Badge variant="secondary">Aliyun</Badge> Qwen3 Coder Plus - Programming optimized</li>
				<li><Badge variant="secondary">MiniMax</Badge> M2 - High performance</li>
				<li><Badge variant="secondary">Moonshot</Badge> K2 - Open source model</li>
			</ul>
		</div>
		<div class="border rounded-lg p-4">
			<h4 class="font-semibold mb-2">Available</h4>
			<ul class="space-y-1 text-sm">
				<li><Badge variant="outline">OpenAI</Badge> GPT-4, GPT-3.5</li>
				<li><Badge variant="outline">Anthropic</Badge> Claude 3.5 Sonnet</li>
				<li><Badge variant="outline">Volcengine</Badge> Doubao models</li>
				<li><Badge variant="outline">Tencent</Badge> Hunyuan models</li>
			</ul>
		</div>
	</div>

	<h2>Configuration Examples</h2>

	<h3>Using Different Providers</h3>

	<CodeBlock code={`# Aliyun Qwen3 Coder Plus
./llm-link --app aider --provider aliyun --model qwen3-coder-plus --api-key your-aliyun-key

# MiniMax M2
./llm-link --app aider --provider minimax --model m2 --api-key your-minimax-key

# Moonshot K2
./llm-link --app aider --provider moonshot --model k2 --api-key your-moonshot-key

# OpenAI GPT-4
./llm-link --app aider --provider openai --model gpt-4 --api-key your-openai-key`} language="bash" />

	<h3>Local Models with Ollama</h3>

	<CodeBlock code={`# Pull a coding model
ollama pull qwen2.5-coder

# Start LLM Link with Ollama
./llm-link --app aider --provider ollama --model qwen2.5-coder --api-key dummy

# Use with Aider
export OPENAI_API_BASE=http://localhost:8090/v1
export OPENAI_API_KEY=dummy
aider --model openai/qwen2.5-coder`} language="bash" />

	<h2>Advanced Configuration</h2>

	<h3>Custom Port</h3>

	<CodeBlock code="./llm-link --app aider --provider zhipu --model glm-4.6 --api-key your-key --port 8095" language="bash" />

	<h3>Authentication</h3>

	<p>You can protect the LLM Link APIs with an authentication token:</p>

	<CodeBlock code="./llm-link --app aider --provider zhipu --model glm-4.6 --api-key your-zhipu-key --auth-key your-secret-token" language="bash" />

	<p>Then use the auth token when setting the API key:</p>

	<CodeBlock code="export OPENAI_API_KEY=your-secret-token" language="bash" />

	<h2>Troubleshooting</h2>

	<div class="space-y-4">
		<div>
			<h4 class="font-semibold">Connection refused</h4>
			<p class="text-sm text-muted-foreground">Make sure LLM Link is running on port 8090:</p>
			<CodeBlock code="curl http://localhost:8090/health" language="bash" />
		</div>

		<div>
			<h4 class="font-semibold">Model not found</h4>
			<p class="text-sm text-muted-foreground">Check that the model name is correct and available in the provider:</p>
			<CodeBlock code="./llm-link --app aider --provider zhipu --model glm-4.6 --api-key your-key --list-models" language="bash" />
		</div>

		<div>
			<h4 class="font-semibold">Aider can't connect</h4>
			<p class="text-sm text-muted-foreground">Verify the environment variables are set correctly:</p>
			<CodeBlock code={`echo $OPENAI_API_BASE  # Should be: http://localhost:8090/v1
echo $OPENAI_API_KEY   # Should be your auth token or dummy`} language="bash" />
		</div>
	</div>

	<div class="pt-6 border-t text-sm text-muted-foreground">
		<a href={`${basePath}/docs`} class="hover:underline">← Back to Docs index</a>
	</div>
</div>
