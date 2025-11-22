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
			Start the proxy pointing to Aliyun's <strong>Qwen3 Coder Plus</strong>. The <code>--app codex</code>
			preset opens an OpenAI-compatible endpoint at <code>http://localhost:8088/v1</code>.
		</p>
		<CodeBlock
			code="llm-link --app codex --provider aliyun --api-key <YOUR_ALIYUN_KEY> --model qwen3-coder-plus"
			language="bash"
		/>
		<p class="text-xs text-muted-foreground">
			You can also use <code>--provider zhipu --model glm-4.6</code> or others.
		</p>
	</section>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">2. Configure Codex CLI</h2>
		<p class="text-sm text-muted-foreground">
			Update your <code>codex.toml</code> to define LLM Link as a provider and create a profile for Qwen:
		</p>
		<CodeBlock
			code={`# 1. Define LLM Link as a model provider
[model_providers.llm_link]
name = "LLM Link (Qwen3 Coder)"
base_url = "http://localhost:8088/v1"
env_key = "LLM_LINK_AUTH_TOKEN"

# 2. Define a profile using the Qwen model
[profiles.qwen3_coder]
model = "qwen3-coder-plus"
model_provider = "llm_link"`}
			language="toml"
		/>
		<div class="space-y-2 text-xs text-muted-foreground">
			<p class="font-semibold text-foreground text-sm">Setting <code>LLM_LINK_AUTH_TOKEN</code></p>
			<CodeBlock
				code={`# llm-link without --auth-key (token can be arbitrary)
llm-link --app codex --provider aliyun --model qwen3-coder-plus
export LLM_LINK_AUTH_TOKEN="dev-token"

# llm-link with --auth-key
llm-link --app codex --provider aliyun --model qwen3-coder-plus --auth-key my-secret
export LLM_LINK_AUTH_TOKEN="my-secret"`}
				language="bash"
			/>
			<p>
				Codex will send this value as <code>Authorization: Bearer ...</code> when calling llm-link. If you start
				llm-link without <code>--auth-key</code>, you can omit <code>env_key</code> and the environment
				variable entirely (Codex will still be able to reach the proxy).
			</p>
		</div>
	</section>

	<section class="space-y-4">
		<h2 class="text-2xl font-semibold">3. Switching Providers</h2>
		<p class="text-sm text-muted-foreground">
			You can switch to other coding models (like GLM-4.6) by simply restarting llm-link.
			No changes to <code>codex.toml</code> are strictly necessary if you reuse the profile name,
			or you can add a new profile:
		</p>
		<CodeBlock
			code={`# Switch to Zhipu GLM-4.6
llm-link --app codex --provider zhipu --api-key <ZHIPU_KEY> --model glm-4.6

# Switch to Volcengine Doubao
llm-link --app codex --provider volcengine --api-key <VOLC_KEY> --model doubao-seed-1.6`}
			language="bash"
		/>
	</section>

	<div class="pt-6 border-t flex justify-between text-sm text-muted-foreground">
		<a href={`${basePath}/docs`} class="hover:underline">← Back to Docs index</a>
		<a href={`${basePath}/docs/apps/claude`} class="hover:underline">Next: Claude Code →</a>
	</div>
</div>
