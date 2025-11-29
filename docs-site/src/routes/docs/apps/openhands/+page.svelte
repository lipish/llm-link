<script lang="ts">
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import Badge from '$lib/components/Badge.svelte';

	const basePath = base;
</script>

<svelte:head>
	<title>OpenHands Integration | LLM Link</title>
</svelte:head>

<div class="prose prose-slate max-w-none">
	<h1>OpenHands Integration</h1>
	
	<p>
		OpenHands is an AI agent framework for software development. LLM Link provides seamless integration with OpenHands through OpenAI-compatible APIs, allowing you to use any supported LLM provider.
	</p>

	<Alert type="info">
		<strong>Docker Network:</strong> OpenHands runs in Docker, so use <code>host.docker.internal</code> as the hostname when configuring the API endpoint.
	</Alert>

	<h2>Quick Start</h2>

	<h3>Option 1: Using Startup Script (Recommended)</h3>

	<CodeBlock code="./scripts/start-openhands.sh openai gpt-4 sk-your-key" language="bash" />

	<h3>Option 2: Manual Configuration</h3>

	<ol>
		<li>
			<strong>Start LLM Link:</strong>
			<CodeBlock code="./llm-link --app openhands --provider openai --model gpt-4 --api-key your-openai-key" language="bash" />
		</li>
		<li>
			<strong>Configure OpenHands in Web UI:</strong>
			<ul class="list-disc list-inside space-y-2 mt-2">
				<li>Click "see advanced settings"</li>
				<li>Enable the Advanced toggle at the top</li>
				<li>Set the following parameters:</li>
			</ul>
		</li>
	</ol>

	<div class="bg-muted/50 rounded-lg p-4 my-4">
		<h4 class="font-semibold mb-2">OpenHands Configuration:</h4>
		<ul class="space-y-1 text-sm font-mono">
			<li><strong>Custom Model:</strong> openai/gpt-4</li>
			<li><strong>Base URL:</strong> http://host.docker.internal:8091/v1</li>
			<li><strong>API Key:</strong> your-openai-key (or dummy for local models)</li>
		</ul>
	</div>

	<h2>Supported Models</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
		<div class="border rounded-lg p-4">
			<h4 class="font-semibold mb-2">🔥 Recommended</h4>
			<ul class="space-y-1 text-sm">
				<li><Badge variant="secondary">OpenAI</Badge> GPT-4 - Strong reasoning</li>
				<li><Badge variant="secondary">Anthropic</Badge> Claude 3.5 Sonnet - Excellent coding</li>
				<li><Badge variant="secondary">Zhipu</Badge> GLM-4.6 - 200K context</li>
				<li><Badge variant="secondary">Aliyun</Badge> Qwen3 Coder Plus - Programming optimized</li>
			</ul>
		</div>
		<div class="border rounded-lg p-4">
			<h4 class="font-semibold mb-2">Local Models</h4>
			<ul class="space-y-1 text-sm">
				<li><Badge variant="outline">Ollama</Badge> Qwen2.5 Coder</li>
				<li><Badge variant="outline">Ollama</Badge> DeepSeek Coder</li>
				<li><Badge variant="outline">Ollama</Badge> Code Llama</li>
				<li><Badge variant="outline">Custom</Badge> Any OpenAI-compatible model</li>
			</ul>
		</div>
	</div>

	<h2>Configuration Examples</h2>

	<h3>Using Different Providers</h3>

	<CodeBlock code={`# Anthropic Claude 3.5 Sonnet
./llm-link --app openhands --provider anthropic --model claude-3-5-sonnet-20241022 --api-key your-anthropic-key

# Zhipu GLM-4.6
./llm-link --app openhands --provider zhipu --model glm-4.6 --api-key your-zhipu-key

# Aliyun Qwen3 Coder Plus
./llm-link --app openhands --provider aliyun --model qwen3-coder-plus --api-key your-aliyun-key

# MiniMax M2
./llm-link --app openhands --provider minimax --model m2 --api-key your-minimax-key`} language="bash" />

	<h3>Local Models with Ollama</h3>

	<CodeBlock code={`# Pull a coding model
ollama pull qwen2.5-coder

# Start LLM Link with Ollama
./llm-link --app openhands --provider ollama --model qwen2.5-coder --api-key dummy

# Configure in OpenHands:
# Custom Model: openai/qwen2.5-coder
# Base URL: http://host.docker.internal:8091/v1
# API Key: dummy`} language="bash" />

	<h2>Docker Network Configuration</h2>

	<p>Since OpenHands runs in Docker containers, you need to use the special hostname <code>host.docker.internal</code> to connect to services running on your host machine.</p>

	<Alert type="warning">
		<strong>Important:</strong> Always use <code>host.docker.internal:PORT</code> instead of <code>localhost:PORT</code> when configuring OpenHands.
	</Alert>

	<h3>Port Mapping</h3>

	<div class="bg-muted/50 rounded-lg p-4 my-4">
		<h4 class="font-semibold mb-2">Default Ports:</h4>
		<ul class="space-y-1 text-sm">
			<li><strong>LLM Link:</strong> 8091 (OpenHands default)</li>
			<li><strong>OpenHands Web UI:</strong> 3000</li>
			<li><strong>OpenHands API:</strong> 3001</li>
		</ul>
	</div>

	<h2>Advanced Configuration</h2>

	<h3>Custom Port</h3>

	<CodeBlock code="./llm-link --app openhands --provider openai --model gpt-4 --api-key your-key --port 8095" language="bash" />

	<p>Remember to update the Base URL in OpenHands configuration to match your custom port:</p>

	<CodeBlock code="http://host.docker.internal:8095/v1" language="bash" />

	<h3>Authentication</h3>

	<p>You can protect the LLM Link APIs with an authentication token:</p>

	<CodeBlock code="./llm-link --app openhands --provider openai --model gpt-4 --api-key your-openai-key --auth-key your-secret-token" language="bash" />

	<p>Then use the auth token in OpenHands configuration:</p>

	<CodeBlock code="API Key: your-secret-token" language="bash" />

	<h2>Troubleshooting</h2>

	<div class="space-y-4">
		<div>
			<h4 class="font-semibold">OpenHands can't connect to LLM Link</h4>
			<p class="text-sm text-muted-foreground">Make sure you're using the correct hostname:</p>
			<CodeBlock code="# Correct: http://host.docker.internal:8091/v1
# Wrong: http://localhost:8091/v1" language="bash" />
		</div>

		<div>
			<h4 class="font-semibold">Connection refused</h4>
			<p class="text-sm text-muted-foreground">Verify LLM Link is running on the correct port:</p>
			<CodeBlock code="curl http://localhost:8091/health" language="bash" />
		</div>

		<div>
			<h4 class="font-semibold">Model not found</h4>
			<p class="text-sm text-muted-foreground">Check the model name and provider availability:</p>
			<CodeBlock code="./llm-link --app openhands --provider openai --model gpt-4 --api-key your-key --list-models" language="bash" />
		</div>

		<div>
			<h4 class="font-semibold">Docker network issues</h4>
			<p class="text-sm text-muted-foreground">Test the Docker network connectivity:</p>
			<CodeBlock code="docker run --rm alpine ping -c 1 host.docker.internal" language="bash" />
		</div>
	</div>

	<div class="pt-6 border-t text-sm text-muted-foreground">
		<a href={`${basePath}/docs`} class="hover:underline">← Back to Docs index</a>
	</div>
</div>
