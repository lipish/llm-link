<script>
	import Button from '$lib/components/ui/button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { base } from '$app/paths';

	const basePath = base;
</script>

<div class="max-w-3xl space-y-8">
	<div class="space-y-2">
		<p class="text-sm text-muted-foreground uppercase tracking-[0.2em]">Applications · Claude Code</p>
		<h1 class="text-3xl font-bold tracking-tight">Claude Code Integration</h1>
		<p class="text-base text-muted-foreground">
			Run Claude Code against llm-link via an Anthropic-compatible endpoint, while llm-link handles
			provider switching and model selection.
		</p>
	</div>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">1. Start llm-link for Claude Code</h2>
		<p class="text-sm text-muted-foreground">
			This preset starts an Anthropic-compatible server on <code>http://localhost:8089</code>.
		</p>
		<CodeBlock code="llm-link --app claude --provider anthropic --api-key sk-ant-..." language="bash" />
		<p class="text-xs text-muted-foreground">
			Always pass the provider API key explicitly via <code>--api-key</code>. Environment variables
			are not used by llm-link for API keys.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">2. Configure Claude Code</h2>
		<p class="text-sm text-muted-foreground">
			Create or edit <code>~/.claude/settings.json</code> to point to llm-link:
		</p>
		<CodeBlock
			code={`
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "your-auth-token",
    "ANTHROPIC_BASE_URL": "http://localhost:8089",
    "API_TIMEOUT_MS": "300000"
  }
}`}
			language="json"
		/>
		<p class="text-xs text-muted-foreground">
			The auth token can be any non-empty string when using llm-link; it is validated by llm-link,
			not by Anthropic directly.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">3. Using Other Providers with Claude Code</h2>
		<p class="text-sm text-muted-foreground">
			To proxy other providers through the Anthropic-compatible endpoint, restart llm-link with a
			different <code>--provider</code> and <code>--model</code>:
		</p>
		<CodeBlock
			code={`# OpenAI via Claude Code
llm-link --app claude --provider openai --model gpt-4

# Zhipu GLM via Claude Code
llm-link --app claude --provider zhipu --model glm-4-flash

# Aliyun Qwen via Claude Code
llm-link --app claude --provider aliyun --model qwen-max`}
			language="bash"
		/>
	</section>

	<div class="pt-6 border-t flex justify-between text-sm text-muted-foreground">
		<a href={`${basePath}/docs`} class="hover:underline">← Back to Docs index</a>
		<a href={`${basePath}/docs/protocols`} class="hover:underline">Next: Protocol Mode →</a>
	</div>
</div>
