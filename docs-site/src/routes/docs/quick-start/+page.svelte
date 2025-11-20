<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import Accordion from '$lib/components/Accordion.svelte';
	import { Zap } from 'lucide-svelte';
</script>

<div class="max-w-3xl space-y-12">
	<div class="space-y-3">
		<h1 class="text-4xl font-bold tracking-tight mb-4">Quick Start</h1>
		<p class="text-lg text-muted-foreground">
			Install LLM Link, configure provider keys, and run your first proxy instance.
		</p>
	</div>

	<section class="space-y-6">
		<h2 class="text-2xl font-semibold flex items-center">
			<Zap class="h-6 w-6 mr-2 text-primary" />
			Steps
		</h2>

		<div class="space-y-4">
			<Accordion title="1. Install LLM Link" open={true}>
				<div class="space-y-4">
					<div>
						<h3 class="text-sm font-medium mb-2">Homebrew (Recommended, macOS)</h3>
						<CodeBlock
							code={'brew tap lipish/llm-link\nbrew install llm-link'}
							language="bash"
						/>
					</div>
					<div>
						<h3 class="text-sm font-medium mb-2">pip (macOS / Linux)</h3>
						<p class="text-xs text-muted-foreground mb-2">
							The Python wrapper downloads a matching prebuilt binary on first run.
						</p>
						<CodeBlock
							code={'pip install pyllmlink\n# First run downloads the prebuilt llm-link binary into ~/.cache/llm-link'}
							language="bash"
						/>
					</div>
					<div>
						<h3 class="text-sm font-medium mb-2">Cargo (Developers)</h3>
						<CodeBlock code="cargo install llm-link" language="bash" />
					</div>
				</div>
			</Accordion>

			<Accordion title="2. Configure provider keys">
				<div class="space-y-4">
					<div>
						<h3 class="text-sm font-medium mb-2">CLI flags (required for API keys)</h3>
						<p class="text-xs text-muted-foreground mb-2">
							Always pass provider API keys explicitly via CLI flags. Environment variables are not
							used by llm-link to avoid hidden configuration.
						</p>
						<CodeBlock
							code={`# GLM 4.6 (Zhipu)
llm-link --provider zhipu --api-key zhipu-... --model glm-4.6

# Qwen3 Coder Plus (Aliyun)
llm-link --provider aliyun --api-key qwen-... --model qwen3-coder-plus

# Doubao Seed 1.6 (Volcengine)
llm-link --provider volcengine --api-key volc-... --model doubao-seed-1.6`}
							language="bash"
						/>
					</div>
					<div>
						<h3 class="text-sm font-medium mb-2">Optional: protect HTTP APIs with --auth-key</h3>
						<p class="text-xs text-muted-foreground mb-2">
							Use <code>--auth-key</code> if you want clients to authenticate when calling llm-link's
							HTTP APIs (e.g. OpenAI-compatible <code>/v1</code> endpoints). This key is only checked by
							llm-link and is not forwarded to upstream providers.
						</p>
						<CodeBlock
							code={`llm-link --protocols openai \\
  --provider zhipu --api-key zhipu-... --model glm-4.6 \\
  --auth-key my-llm-link-token`}
							language="bash"
						/>
					</div>
				</div>
			</Accordion>

			<Accordion title="3. Run your first proxy">
				<div class="space-y-4">
					<div>
						<h3 class="text-sm font-medium mb-2">OpenAI-compatible endpoint (generic clients)</h3>
						<CodeBlock
							code={'llm-link --protocols openai --port 8088\n\n# Example curl request\ncurl http://localhost:8088/v1/models'}
							language="bash"
						/>
					</div>
					<div>
						<h3 class="text-sm font-medium mb-2">Zed.dev preset</h3>
						<CodeBlock
							code={'llm-link --app zed\n# Then configure Zed: Settings → AI → Custom provider → http://localhost:11434'}
							language="bash"
						/>
					</div>
				</div>
			</Accordion>
		</div>
	</section>
</div>
