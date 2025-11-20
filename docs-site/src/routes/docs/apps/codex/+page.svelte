<script>
	import Button from '$lib/components/ui/button.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { base } from '$app/paths';

	const basePath = base;
</script>

<div class="max-w-3xl space-y-8">
	<div class="space-y-2">
		<p class="text-sm text-muted-foreground uppercase tracking-[0.2em]">Applications · Codex</p>
		<h1 class="text-3xl font-bold tracking-tight">Codex CLI Integration</h1>
		<p class="text-base text-muted-foreground">
			Use llm-link as an OpenAI-compatible backend for Codex CLI, so you can route different
			providers and models without changing Codex configuration.
		</p>
	</div>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">1. Start llm-link for Codex</h2>
		<p class="text-sm text-muted-foreground">
			This preset starts an OpenAI-compatible endpoint on <code>http://localhost:8088</code>.
		</p>
		<CodeBlock code="llm-link --app codex --provider openai --model gpt-4" language="bash" />
		<p class="text-xs text-muted-foreground">
			Replace <code>gpt-4</code> with any supported provider/model pair as needed.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">2. Configure Codex CLI</h2>
		<p class="text-sm text-muted-foreground">
			Update your Codex configuration to use llm-link as the OpenAI backend:
		</p>
		<CodeBlock
			code='[model_providers.llm_link]
name = "LLM Link"
base_url = "http://localhost:8088/v1"
env_key = "LLM_LINK_API_KEY"

[profiles.default]
model = "glm-4-flash"  # Or gpt-4, claude-3-5-sonnet-20241022, etc.
model_provider = "llm_link"'
			language="toml"
		/>
		<p class="text-xs text-muted-foreground">
			Set <code>LLM_LINK_API_KEY</code> in your shell and Codex will send the token as
			<code>Authorization: Bearer</code>.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">3. Switching Providers</h2>
		<p class="text-sm text-muted-foreground">
			Restart llm-link with different providers while keeping Codex configuration unchanged:
		</p>
		<CodeBlock
			code={`# OpenAI
llm-link --app codex --provider openai --model gpt-4

# Zhipu GLM
llm-link --app codex --provider zhipu --model glm-4-flash

# Aliyun Qwen
llm-link --app codex --provider aliyun --model qwen-max`}
			language="bash"
		/>
	</section>

	<div class="pt-6 border-t flex justify-between text-sm text-muted-foreground">
		<a href={`${basePath}/docs`} class="hover:underline">← Back to Docs index</a>
		<a href={`${basePath}/docs/apps/claude`} class="hover:underline">Next: Claude Code →</a>
	</div>
</div>
