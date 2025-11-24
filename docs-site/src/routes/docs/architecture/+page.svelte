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

		<!-- Architecture Image -->
		<div class="rounded-lg border bg-card p-6">
			<img 
				src={`${basePath}/architecture.png`} 
				alt="LLM Link Architecture Diagram" 
				class="w-full h-auto rounded-md shadow-sm"
			/>
			<p class="text-xs text-muted-foreground mt-3 text-center">
				LLM Link architecture showing the flow from client applications through protocol adapters to provider connectors
			</p>
		</div>

		<!-- ASCII Diagram -->
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
			LLM Link is a single Rust binary built on top of <code>axum</code> and <code>tokio</code>. Its runtime
			pipeline consists of three distinct stages:
		</p>
		<div class="grid gap-6 md:grid-cols-3">
			<div class="space-y-2 border-l-2 pl-4 border-muted">
				<h3 class="font-medium">1. CLI & Config Loader</h3>
				<p class="text-sm text-muted-foreground">
					Parses arguments using <code>clap</code>. It determines whether to run in App Mode (e.g.,
					<code>--app zed</code>) or Protocol Mode. It generates a runtime <code>Settings</code> struct
					that defines active protocols, ports, and provider credentials.
				</p>
			</div>
			<div class="space-y-2 border-l-2 pl-4 border-muted">
				<h3 class="font-medium">2. Protocol Adapters</h3>
				<p class="text-sm text-muted-foreground">
					Axum routes that mimic upstream APIs (OpenAI <code>/v1/chat/completions</code>, Anthropic
					<code>/v1/messages</code>, etc.). These adapters accept inbound requests, validate headers,
					and convert them into a unified internal request model.
				</p>
			</div>
			<div class="space-y-2 border-l-2 pl-4 border-muted">
				<h3 class="font-medium">3. Connectors & Normalizer</h3>
				<p class="text-sm text-muted-foreground">
					The core logic that dispatches the unified request to the configured provider (e.g., Zhipu,
					DeepSeek). The <strong>Normalizer</strong> handles the response, converting provider-specific
					JSON or SSE streams back into the format the client expects.
				</p>
			</div>
		</div>
	</section>

	<!-- Request flow -->
	<section class="space-y-6">
		<h2 class="text-2xl font-semibold">Request flow</h2>
		<p class="text-sm text-muted-foreground">
			Trace the lifecycle of a request (e.g., from Codex CLI to Zhipu AI):
		</p>
		<div class="grid gap-6 lg:grid-cols-2">
			<div class="rounded-lg border bg-card p-5 text-xs h-fit">
				<CodeBlock
					language="bash"
					code={`      Client (Codex CLI)
             │
             ▼
   POST /v1/chat/completions
             │
┌───────────────────────────┐
│      Protocol Layer       │
│     (api/openai.rs)       │
└────────────┬──────────────┘
             ▼
┌───────────────────────────┐
│     Connector (Zhipu)     │
│    (provider/zhipu.rs)    │
└────────────┬──────────────┘
             ▼
┌───────────────────────────┐
│        Normalizer         │
│    (src/normalizer/*)     │
└────────────┬──────────────┘
             ▼
 Client receives OpenAI stream`}
				/>
			</div>
			<div class="space-y-4 text-sm text-muted-foreground">
				<div class="flex gap-3">
					<div
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium"
					>
						1
					</div>
					<div>
						<p class="font-medium text-foreground mb-1">Inbound Request</p>
						The client sends a standard OpenAI request. The <code>api/openai.rs</code> handler receives
						it and deserializes it using standard serde structs.
					</div>
				</div>
				<div class="flex gap-3">
					<div
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium"
					>
						2
					</div>
					<div>
						<p class="font-medium text-foreground mb-1">Internal Conversion</p>
						The handler converts the OpenAI request into a unified <code>ChatCompletionRequest</code>.
						This unifies differences between OpenAI, Anthropic, and Ollama inputs.
					</div>
				</div>
				<div class="flex gap-3">
					<div
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium"
					>
						3
					</div>
					<div>
						<p class="font-medium text-foreground mb-1">Provider Dispatch</p>
						The <code>Provider</code> trait implementation (e.g., <code>provider/zhipu.rs</code>) takes
						over, transforming the internal request into Zhipu's specific JSON format and signing headers.
					</div>
				</div>
				<div class="flex gap-3">
					<div
						class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-medium"
					>
						4
					</div>
					<div>
						<p class="font-medium text-foreground mb-1">Normalization</p>
						As chunks arrive from Zhipu, the <code>Normalizer</code> maps them back to standard OpenAI
						SSE chunks (deltas) in real-time, ensuring the client sees a perfect OpenAI simulation.
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Code structure -->
	<section class="space-y-6">
		<h2 class="text-2xl font-semibold">Code structure</h2>
		<p class="text-sm text-muted-foreground">
			The codebase follows a layered architecture, separating configuration, external interfaces,
			core logic, and provider adapters.
		</p>
		<CodeBlock
			language="bash"
			code={`src/
├── 1. Entry & Config
│   ├── main.rs           # Application entry point & server startup
│   ├── cli/              # CLI argument parsing & command handling
│   ├── apps/             # App presets (Zed, Claude, Codex) configuration logic
│   └── settings.rs       # Global configuration structs
│
├── 2. Interfaces (Inbound)
│   └── api/              # Axum handlers for external protocols
│       ├── openai.rs     # /v1/chat/completions, /v1/models
│       ├── anthropic.rs  # /v1/messages
│       └── ollama.rs     # /api/generate, /api/chat
│
├── 3. Core Logic
│   ├── service.rs        # Shared AppState & service lifecycle management
│   ├── normalizer/       # Unified request/response shaping & streaming adapters
│   └── models/           # Internal unified data models
│
└── 4. Providers (Outbound)
    └── provider/         # Concrete adapter implementations
        ├── zhipu.rs      # Zhipu AI (GLM) client
        ├── aliyun.rs     # Aliyun (Qwen) client
        ├── volcengine.rs # Volcengine (Doubao) client
        └── ...`}
		/>
		
		<div class="rounded-lg border bg-muted/40 p-4 space-y-3">
			<h3 class="font-medium text-sm">Where to start contributing?</h3>
			<ul class="text-xs text-muted-foreground space-y-2 list-disc pl-4">
				<li>
					<strong>Adding a new Provider:</strong> Create a new file in <code>src/provider/</code> implementing
					the <code>Provider</code> trait, then register it in <code>src/provider/mod.rs</code>.
				</li>
				<li>
					<strong>Adding a new App Preset:</strong> Add a new module in <code>src/apps/</code> to define
					default settings and CLI flags for the tool you want to support.
				</li>
				<li>
					<strong>Improving Protocol Support:</strong> Modify handlers in <code>src/api/</code> to support
					more endpoints or fields from OpenAI/Anthropic specs.
				</li>
			</ul>
		</div>
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
