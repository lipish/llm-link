<script>
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import { Layers } from 'lucide-svelte';
	import { base } from '$app/paths';

	const basePath = base;
</script>

<div class="max-w-3xl space-y-12">
	<div class="space-y-3">
		<h1 class="text-4xl font-bold tracking-tight mb-4">Architecture</h1>
		<p class="text-lg text-muted-foreground">
			See how LLM Link is structured as a single service in front of many providers: client
			integrations, protocol adapters, provider connectors, and the control APIs that tie everything
			together.
		</p>
	</div>

	<!-- High-level Diagram -->
	<section class="space-y-8">
		<h2 class="text-2xl font-semibold flex items-center">
			<Layers class="h-6 w-6 mr-2 text-primary" />
			High-level Diagram
		</h2>

		<div class="rounded-lg border bg-card p-5 text-xs">
			<CodeBlock
				language="bash"
				code={`┌──────────────────────────────────────────────────────────┐
│                    Editors / Agents                      │
│  Zed.dev  •  Codex CLI  •  Claude Code  •  Continue.dev  │
└─────────────────────┬────────────────────────────────────┘
                      │ HTTP (OpenAI/Anthropic/Ollama style)
                      ▼
┌──────────────────────────────────────────────────────────┐
│                     LLM Link                             │
│  ┌─────────────────┐   ┌─────────────────────────────┐   │
│  │ CLI & App       │   │ Protocol Layer              │   │
│  │ Presets         │   │ • OpenAI / Anthropic        │   │
│  │ (--app zed…)    │   │ • Unified request format    │   │
│  └─────────────────┘   └─────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────┐   │
│  │ Normalizer                                        │   │
│  │ • Shape requests/responses across providers       │   │
│  │ • Streaming helpers                               │   │
│  └───────────────────────────────────────────────────┘   │
└─────────────────────┬────────────────────────────────────┘
                      │ Provider-specific HTTP calls
                      ▼
┌──────────────────────────────────────────────────────────┐
│                Provider Connectors                       │
│  OpenAI • Anthropic • Zhipu • Volcengine • Moonshot      │
│  Minimax • Tencent • Aliyun • Longcat • Ollama           │
└──────────────────────────────────────────────────────────┘`}
			/>
		</div>
	</section>

	<!-- Runtime components -->
	<section class="space-y-6">
		<h2 class="text-2xl font-semibold">Runtime components</h2>
		<p class="text-sm text-muted-foreground">
			At runtime, LLM Link is a single binary with three main layers:
		</p>
		<ul class="text-sm text-muted-foreground list-disc pl-5 space-y-1">
			<li>
				<strong>CLI & app presets</strong> – parse flags, choose between app mode
				(<code>--app zed</code>, <code>--app codex</code>, <code>--app claude</code>) or protocol
				mode (<code>--protocols openai,ollama,anthropic</code>), and build a <code>Settings</code>
				object.
			</li>
			<li>
				<strong>Protocol layer</strong> – exposes OpenAI-style, Anthropic-style, and
				Ollama-style HTTP endpoints and routes them into a unified internal request type.
			</li>
			<li>
				<strong>Provider connectors & normalizer</strong> – map the internal request into the
				provider-specific HTTP call, and normalize responses and streaming back to the client.
			</li>
		</ul>
	</section>

	<!-- Request flow -->
	<section class="space-y-6">
		<h2 class="text-2xl font-semibold">Request flow</h2>
		<p class="text-sm text-muted-foreground">
			A typical request travels through the layers in order:
		</p>
		<div class="rounded-lg border bg-card p-5">
			<CodeBlock
				language="bash"
				code={`Client (e.g. Codex CLI)
        │
        ▼ HTTP POST /v1/chat/completions (OpenAI endpoint)
Protocol layer
        │ – parse request → internal ChatCompletionRequest
        │ – route to chosen provider (e.g. Zhipu)
        ▼
Provider connector (src/provider/zhipu.rs)
        │ – map internal request → Zhipu API call
        │ – forward to https://open.bigmodel.cn/...
        ▼
Normalizer (src/normalizer/*)
        │ – translate Zhipu response → OpenAI-style JSON/stream
        ▼
Client receives OpenAI-compatible response`}
			/>
		</div>
	</section>

	<!-- Code structure -->
	<section class="space-y-6">
		<h2 class="text-2xl font-semibold">Code structure</h2>
		<p class="text-sm text-muted-foreground">
			The core crate is organized by responsibility; each runtime component maps to concrete modules:
		</p>
		<CodeBlock
			language="bash"
			code={`src/
main.rs       # entrypoint, starts HTTP server
service.rs    # shared application state and server wiring
settings.rs   # configuration model loaded from CLI and presets

api/          # HTTP handlers for OpenAI, Anthropic, Ollama-compatible APIs
apps/         # app presets and generators (--app zed / codex / claude)
cli/          # CLI args, subcommands, and loader logic
normalizer/   # request/response shaping and streaming helpers
provider/     # concrete provider clients (OpenAI, Anthropic, Zhipu, ...)
models/       # shared data models and types`}
		/>
		<p class="text-xs text-muted-foreground">
			For example, <code>src/apps/mod.rs</code> exposes <code>SupportedApp</code> and
			<code>AppConfigGenerator</code>, while <code>src/provider/mod.rs</code> wires concrete
			provider clients behind a stable internal interface.
		</p>
	</section>

	<!-- Design principles -->
	<section class="space-y-6">
		<h2 class="text-2xl font-semibold">Design principles</h2>
		<div class="space-y-4">
			<div>
				<h3 class="text-lg font-medium">Single binary, many clients</h3>
				<p class="text-sm text-muted-foreground">
					One deployment serves editors, agents, and SDKs. This reduces operational overhead and
					provides a stable local API surface for all tools.
				</p>
			</div>
			<div>
				<h3 class="text-lg font-medium">Explicit API keys</h3>
				<p class="text-sm text-muted-foreground">
					Provider keys are passed via CLI or config APIs, not read from global env. This avoids
					accidental leakage and makes multi‑tenant setups safe.
				</p>
			</div>
			<div>
				<h3 class="text-lg font-medium">Stable local API surface</h3>
				<p class="text-sm text-muted-foreground">
					External tools only talk to LLM Link; provider churn stays behind it. Adding or swapping
					providers never requires client changes.
				</p>
			</div>
			<div>
				<h3 class="text-lg font-medium">Extensible connectors</h3>
				<p class="text-sm text-muted-foreground">
					New providers live under <code>src/provider</code> without touching callers. The internal
					interface stays the same, only the concrete implementation changes.
				</p>
			</div>
		</div>
	</section>

	<!-- Control APIs -->
	<section class="space-y-6">
		<h2 class="text-2xl font-semibold">Control APIs</h2>
		<p class="text-sm text-muted-foreground">
			Use the built‑in HTTP APIs to inspect and update the running service:
		</p>
		<ul class="text-sm text-muted-foreground list-disc pl-5 space-y-1">
			<li><code>GET /api/health</code> – service health and version</li>
			<li><code>GET /api/providers</code> – configured providers</li>
			<li><code>GET /api/models</code> – available models</li>
			<li><code>POST /api/config/update</code> – update keys and settings at runtime</li>
		</ul>
	</section>

	<!-- Next steps -->
	<section class="space-y-6">
		<h2 class="text-2xl font-semibold">Next steps</h2>
		<p class="text-sm text-muted-foreground">
			Dive into dedicated guides for specific editors, agents, and protocol setups:
		</p>
		<div class="space-y-1 text-sm">
			<a href="{basePath}/docs/apps/zed" class="text-primary hover:underline">Zed.dev integration</a>
			<a href="{basePath}/docs/apps/codex" class="block text-primary hover:underline">Codex CLI</a>
			<a href="{basePath}/docs/apps/claude" class="block text-primary hover:underline">Claude Code</a>
			<a href="{basePath}/docs/protocols" class="block text-primary hover:underline">Protocol configuration</a>
			<a href="{basePath}/providers" class="block text-primary hover:underline">All providers</a>
			<a href="{basePath}/api" class="block text-primary hover:underline">API reference</a>
		</div>
	</section>
</div>
