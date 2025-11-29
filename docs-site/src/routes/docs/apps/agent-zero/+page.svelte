<script lang="ts">
	import { base } from '$app/paths';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Alert from '$lib/components/Alert.svelte';
	import Badge from '$lib/components/Badge.svelte';

	const basePath = base;
</script>

<svelte:head>
	<title>Agent Zero Integration | LLM Link</title>
</svelte:head>

<div class="prose prose-slate max-w-none">
	<h1>Agent Zero Integration</h1>
	
	<p>
		Agent Zero is a personal AI agent framework that grows and learns with you. LLM Link provides seamless integration with Agent Zero through LiteLLM, allowing you to use any supported LLM provider.
	</p>

	<Alert type="info">
		<strong>LiteLLM Compatible:</strong> Agent Zero uses LiteLLM for provider abstraction, making it easy to switch between different LLM providers through LLM Link.
	</Alert>

	<h2>Quick Start</h2>

	<h3>Option 1: Using Startup Script (Recommended)</h3>

	<CodeBlock code="./scripts/start-agent-zero.sh openai gpt-4 sk-your-key" language="bash" />

	<h3>Option 2: Manual Configuration</h3>

	<ol>
		<li>
			<strong>Start LLM Link:</strong>
			<CodeBlock code="./llm-link --app agent-zero --provider openai --model gpt-4 --api-key your-openai-key" language="bash" />
		</li>
		<li>
			<strong>Configure Agent Zero:</strong>
			<p>In Agent Zero's LiteLLM configuration, set the following parameters:</p>
		</li>
	</ol>

	<div class="bg-muted/50 rounded-lg p-4 my-4">
		<h4 class="font-semibold mb-2">Agent Zero LiteLLM Configuration:</h4>
		<ul class="space-y-1 text-sm font-mono">
			<li><strong>Base URL:</strong> http://localhost:8092/v1</li>
			<li><strong>API Key:</strong> your-openai-key</li>
			<li><strong>Model:</strong> gpt-4</li>
		</ul>
	</div>

	<h2>Supported Models</h2>

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
		<div class="border rounded-lg p-4">
			<h4 class="font-semibold mb-2">🔥 Recommended</h4>
			<ul class="space-y-1 text-sm">
				<li><Badge variant="secondary">OpenAI</Badge> GPT-4 - Strong reasoning capabilities</li>
				<li><Badge variant="secondary">Anthropic</Badge> Claude 3.5 Sonnet - Excellent for complex tasks</li>
				<li><Badge variant="secondary">Zhipu</Badge> GLM-4.6 - Large context window</li>
				<li><Badge variant="secondary">Aliyun</Badge> Qwen3 Coder Plus - Programming optimized</li>
			</ul>
		</div>
		<div class="border rounded-lg p-4">
			<h4 class="font-semibold mb-2">Cost-Effective</h4>
			<ul class="space-y-1 text-sm">
				<li><Badge variant="outline">MiniMax</Badge> M2 - High performance, lower cost</li>
				<li><Badge variant="outline">Moonshot</Badge> K2 - Good value for money</li>
				<li><Badge variant="outline">Volcengine</Badge> Doubao - Fast inference</li>
				<li><Badge variant="outline">Tencent</Badge> Hunyuan - Balanced performance</li>
			</ul>
		</div>
	</div>

	<h2>Configuration Examples</h2>

	<h3>Using Different Providers</h3>

	<CodeBlock code={`# Anthropic Claude 3.5 Sonnet
./llm-link --app agent-zero --provider anthropic --model claude-3-5-sonnet-20241022 --api-key your-anthropic-key

# Zhipu GLM-4.6
./llm-link --app agent-zero --provider zhipu --model glm-4.6 --api-key your-zhipu-key

# Aliyun Qwen3 Coder Plus
./llm-link --app agent-zero --provider aliyun --model qwen3-coder-plus --api-key your-aliyun-key

# MiniMax M2 (Cost-effective)
./llm-link --app agent-zero --provider minimax --model m2 --api-key your-minimax-key`} language="bash" />

	<h3>Local Models with Ollama</h3>

	<CodeBlock code={`# Pull a capable model
ollama pull qwen2.5-coder

# Start LLM Link with Ollama
./llm-link --app agent-zero --provider ollama --model qwen2.5-coder --api-key dummy

# Configure in Agent Zero:
# Base URL: http://localhost:8092/v1
# API Key: dummy
# Model: qwen2.5-coder`} language="bash" />

	<h2>LiteLLM Configuration</h2>

	<p>Agent Zero uses LiteLLM to abstract different LLM providers. Here's how to configure it with LLM Link:</p>

	<h3>Environment Variables</h3>

	<CodeBlock code={`export OPENAI_API_BASE=http://localhost:8092/v1
export OPENAI_API_KEY=your-api-key
export OPENAI_MODEL=gpt-4`} language="bash" />

	<h3>Configuration File</h3>

	<p>If Agent Zero uses a configuration file, add these settings:</p>

	<CodeBlock code={`{
  "model_list": [
    {
      "model_name": "gpt-4",
      "litellm_params": {
        "model": "openai/gpt-4",
        "api_base": "http://localhost:8092/v1",
        "api_key": "your-api-key"
      }
    }
  ]
}`} language="json" />

	<h2>Advanced Configuration</h2>

	<h3>Custom Port</h3>

	<CodeBlock code="./llm-link --app agent-zero --provider openai --model gpt-4 --api-key your-key --port 8095" language="bash" />

	<p>Update your Agent Zero configuration to use the new port:</p>

	<CodeBlock code="export OPENAI_API_BASE=http://localhost:8095/v1" language="bash" />

	<h3>Authentication</h3>

	<p>You can protect the LLM Link APIs with an authentication token:</p>

	<CodeBlock code="./llm-link --app agent-zero --provider openai --model gpt-4 --api-key your-openai-key --auth-key your-secret-token" language="bash" />

	<p>Then use the auth token in Agent Zero configuration:</p>

	<CodeBlock code="export OPENAI_API_KEY=your-secret-token" language="bash" />

	<h3>Multiple Models</h3>

	<p>Agent Zero can work with multiple models. Configure them in your LiteLLM settings:</p>

	<CodeBlock code={`{
  "model_list": [
    {
      "model_name": "gpt-4",
      "litellm_params": {
        "model": "openai/gpt-4",
        "api_base": "http://localhost:8092/v1",
        "api_key": "your-api-key"
      }
    },
    {
      "model_name": "claude-3-5-sonnet",
      "litellm_params": {
        "model": "anthropic/claude-3-5-sonnet-20241022",
        "api_base": "http://localhost:8092/v1",
        "api_key": "your-api-key"
      }
    }
  ]
}`} language="json" />

	<h2>Troubleshooting</h2>

	<div class="space-y-4">
		<div>
			<h4 class="font-semibold">Agent Zero can't connect to LLM Link</h4>
			<p class="text-sm text-muted-foreground">Verify the connection:</p>
			<CodeBlock code="curl http://localhost:8092/v1/models" language="bash" />
		</div>

		<div>
			<h4 class="font-semibold">Model not available</h4>
			<p class="text-sm text-muted-foreground">Check if the model is supported by the provider:</p>
			<CodeBlock code="./llm-link --app agent-zero --provider openai --model gpt-4 --api-key your-key --list-models" language="bash" />
		</div>

		<div>
			<h4 class="font-semibold">LiteLLM configuration errors</h4>
			<p class="text-sm text-muted-foreground">Ensure the API base URL is correct and accessible:</p>
			<CodeBlock code={`# Test the endpoint
curl -X POST http://localhost:8092/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello"}]
  }'`} language="bash" />
		</div>

		<div>
			<h4 class="font-semibold">Authentication issues</h4>
			<p class="text-sm text-muted-foreground">Check if you're using the correct API key:</p>
			<CodeBlock code={`# Verify the API key works
echo $OPENAI_API_KEY
# Test with a simple request`} language="bash" />
		</div>
	</div>

	<div class="pt-6 border-t text-sm text-muted-foreground">
		<a href={`${basePath}/docs`} class="hover:underline">← Back to Docs index</a>
	</div>
</div>
