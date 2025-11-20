<script>
	import { base } from '$app/paths';
	import { Github } from 'lucide-svelte';
	
	const basePath = base;
</script>

<footer class="border-t bg-background">
	<div class="container py-8 md:py-12">
		<div class="grid grid-cols-1 gap-8 md:grid-cols-4">
			<div class="space-y-3">
				<h3 class="text-lg font-semibold">LLM Link</h3>
				<p class="text-sm text-muted-foreground max-w-xs">
					Universal LLM proxy service providing zero-configuration access to multiple providers.
				</p>
			</div>
			<div class="space-y-3">
				<h4 class="text-sm font-semibold">Product</h4>
				<ul class="space-y-2 text-sm">
					<li><a href="{basePath}/docs" class="text-muted-foreground hover:text-foreground">Documentation</a></li>
					<li><a href="{basePath}/api" class="text-muted-foreground hover:text-foreground">API Reference</a></li>
					<li><a href="{basePath}/providers" class="text-muted-foreground hover:text-foreground">Providers</a></li>
				</ul>
			</div>
			<div class="space-y-3">
				<h4 class="text-sm font-semibold">Resources</h4>
				<ul class="space-y-2 text-sm">
					<li><a href="https://github.com/lipish/llm-link" class="text-muted-foreground hover:text-foreground">GitHub</a></li>
					<li><a href="https://crates.io/crates/llm-link" class="text-muted-foreground hover:text-foreground">Crates.io</a></li>
					<li><a href="https://docs.rs/llm-link" class="text-muted-foreground hover:text-foreground">API Docs</a></li>
				</ul>
			</div>
			<div class="space-y-3">
				<h4 class="text-sm font-semibold">Community</h4>
				<ul class="space-y-2 text-sm">
					<li><a href="https://github.com/lipish/llm-link/issues" class="text-muted-foreground hover:text-foreground">Issues</a></li>
					<li><a href="https://github.com/lipish/llm-link/releases" class="text-muted-foreground hover:text-foreground">Releases</a></li>
				</ul>
			</div>
		</div>
		<div class="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
			<p>&copy; 2025 LLM Link. MIT License.</p>
		</div>
	</div>
</footer>
