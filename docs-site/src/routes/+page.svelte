<script>
	import Button from '$lib/components/ui/button.svelte';
	import { Github, Download, Plug, Terminal } from 'lucide-svelte';
	import { base } from '$app/paths';

	const basePath = base;

	const highlights = [
		{
			title: 'Unified proxy layer',
			description: 'Expose OpenAI / Ollama / Anthropic style endpoints from one host with shared credentials and monitoring.'
		},
		{
			title: 'Ready out of the box',
			description: 'Install with a single command, ship default ports and templates, skip hand-crafted configs.'
		},
		{
			title: 'Optimized for dev tools',
			description: 'Pre-tuned commands for Codex CLI, Zed, and Claude Code to eliminate guesswork.'
		}
	];

	const installOptions = [
		{
			title: 'Install via Homebrew (macOS)',
			description: 'Add the tap once per machine, then install like any other formula.',
			command: 'brew tap lipish/llm-link\nbrew install llm-link'
		},
		{
			title: 'Install via cargo (recommended)',
			description: 'Once Rust toolchain is ready, install the latest binary with:',
			command: 'cargo install llm-link'
		},
		{
			title: 'Build from source',
			description: 'For custom builds or debugging, clone and compile manually:',
			command: 'git clone https://github.com/lipish/llm-link.git\ncargo build --release'
		}
	];

	const protocolGuides = [
		{
			name: 'OpenAI-compatible protocol',
			providers: 'Works with OpenAI, Moonshot, Zhipu, Longcat or any /v1/chat/completions client.',
			env: 'export OPENAI_API_KEY="sk-xxxx" # or another compatible provider key',
			command: 'llm-link --protocols openai --port 8088'
		},
		{
			name: 'Ollama protocol',
			providers: 'Ideal for local/private models and editors that speak Ollama like Zed.',
			env: 'export OLLAMA_BASE_URL="http://localhost:11434" # optional override',
			command: 'llm-link --protocols ollama --port 11434'
		},
		{
			name: 'Anthropic protocol',
			providers: 'Claude SDK, Claude Code and other tools based on the Messages API.',
			env: 'export ANTHROPIC_API_KEY="sk-ant-xxxx"',
			command: 'llm-link --protocols anthropic --port 8089'
		}
	];

	const appGuides = [
		{
			name: 'Codex CLI',
			description: 'Reuse the OpenAI client profile, default port 8088.',
			command: 'llm-link --app codex-cli --api-key "your-auth-token"',
			tip: 'In Codex CLI set base_url to http://localhost:8088'
		},
		{
			name: 'Zed',
			description: 'Serve Ollama-compatible APIs so Zed can talk to local or remote providers.',
			command: 'llm-link --app zed',
			tip: 'Zed → Settings → AI → Custom provider -> http://localhost:11434'
		},
		{
			name: 'Claude Code',
			description: 'Mirror the official Anthropic client auth flow and schema.',
			command: 'llm-link --app claude-code',
			tip: 'Keep ANTHROPIC_API_KEY set, default port 8089'
		}
	];
</script>

<section class="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-24">
	<div class="container flex max-w-4xl flex-col items-center gap-4 text-center">
		<p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
			LLM Link · Universal LLM Proxy
		</p>
		<h1 class="font-heading text-4xl font-bold sm:text-5xl md:text-6xl">
			One command to bridge every LLM client
		</h1>
		<p class="max-w-2xl text-base text-muted-foreground sm:text-lg">
			llm-link exposes OpenAI, Ollama, and Anthropic-style APIs from the same machine so you can plug local tools or private networks into any provider with copy-paste commands.
		</p>
		<div class="flex flex-wrap items-center justify-center gap-3">
			<Button size="lg" href="https://github.com/lipish/llm-link">
				<Github class="mr-2 h-4 w-4" />
				GitHub
			</Button>
			<Button variant="outline" size="lg" href="#install">
				<Download class="mr-2 h-4 w-4" />
				Install now
			</Button>
			<Button variant="ghost" size="lg" href="{basePath}/docs">
				Read docs
			</Button>
		</div>
	</div>
</section>

<section class="border-t bg-muted/40">
	<div class="container py-12">
		<div class="grid gap-8 md:grid-cols-3">
			{#each highlights as highlight}
				<div class="rounded-2xl border bg-background p-6">
					<h3 class="text-lg font-semibold">{highlight.title}</h3>
					<p class="mt-2 text-sm text-muted-foreground">{highlight.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section id="install" class="py-16">
	<div class="container mx-auto max-w-5xl space-y-8">
		<div class="space-y-3 text-center">
			<h2 class="text-3xl font-bold tracking-tight">Install llm-link</h2>
			<p class="text-muted-foreground">Pick the fastest path to get the binary running on your machine.</p>
		</div>
		<div class="rounded-2xl border bg-background p-6 text-sm text-muted-foreground">
			<strong>macOS prerequisites</strong>
			<ul class="mt-2 list-disc space-y-1 pl-5">
				<li>Install Xcode Command Line Tools (<code>xcode-select --install</code>) for compilers.</li>
				<li>Install Rust via <code>rustup</code> (<code>brew install rustup-init</code> then <code>rustup-init</code>) or download from rustup.rs.</li>
				<li>Restart your terminal so <code>cargo</code> and <code>rustc</code> are on <code>$PATH</code>.</li>
				<li>Use <code>brew tap lipish/llm-link</code> once on each machine before running <code>brew install llm-link</code>.</li>
			</ul>
		</div>
		<div class="grid gap-6 md:grid-cols-2">
			{#each installOptions as option}
				<div class="rounded-2xl border bg-card p-6 shadow-sm">
					<div class="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
						<Download class="h-4 w-4" />
						{option.title}
					</div>
					<p class="mt-3 text-sm text-muted-foreground">{option.description}</p>
					<pre class="mt-4 w-full rounded-lg bg-muted px-4 py-3 text-sm text-left"><code>{option.command}</code></pre>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="border-t bg-muted/30 py-16">
	<div class="container mx-auto max-w-5xl space-y-8">
		<div class="space-y-3 text-center">
			<h2 class="text-3xl font-bold tracking-tight">Start services for each protocol</h2>
			<p class="text-muted-foreground">Three commands cover the most common OpenAI, Ollama, and Anthropic workflows.</p>
		</div>
		<div class="space-y-6">
			{#each protocolGuides as protocol}
				<div class="rounded-2xl border bg-background p-6">
					<div class="flex flex-wrap items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
						<Plug class="h-4 w-4" />
						{protocol.name}
					</div>
					<p class="mt-2 text-base font-medium">{protocol.providers}</p>
					<p class="mt-2 text-sm text-muted-foreground">{protocol.env}</p>
					<pre class="mt-4 rounded-lg bg-muted px-4 py-3 text-sm text-left"><code>{protocol.command}</code></pre>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="py-16">
	<div class="container mx-auto max-w-5xl space-y-8">
		<div class="space-y-3 text-center">
			<h2 class="text-3xl font-bold tracking-tight">Ready-made app presets</h2>
			<p class="text-muted-foreground">Each preset configures protocol, port, and auth flags so you can copy and run.</p>
		</div>
		<div class="grid gap-6 md:grid-cols-3">
			{#each appGuides as app}
				<div class="rounded-2xl border bg-card p-6">
					<div class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
						<Terminal class="h-4 w-4" />
						{app.name}
					</div>
					<p class="mt-2 text-sm text-muted-foreground">{app.description}</p>
					<pre class="mt-4 rounded-lg bg-muted px-4 py-3 text-sm text-left"><code>{app.command}</code></pre>
					<p class="mt-4 text-xs text-muted-foreground">{app.tip}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="border-t bg-muted/40">
	<div class="container flex flex-col items-center gap-4 py-12 text-center">
		<h3 class="text-2xl font-semibold">Need more configuration depth?</h3>
		<p class="max-w-2xl text-muted-foreground">
			Head to the full documentation for multi-provider setups, model overrides, and every CLI flag.
		</p>
		<Button variant="secondary" size="lg" href="{basePath}/docs">
			Open docs
		</Button>
	</div>
</section>
