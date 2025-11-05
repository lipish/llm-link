<script>
	import { Github, ExternalLink } from 'lucide-svelte';
</script>

<footer class="border-t bg-background">
	<div class="container py-8 md:py-12">
		<div class="grid grid-cols-2 gap-8 lg:grid-cols-4">
			<div class="space-y-3">
				<h3 class="text-lg font-semibold">LLM Link</h3>
				<p class="text-sm text-muted-foreground max-w-xs">
					Universal LLM proxy service providing zero-configuration access to multiple providers.
				</p>
			</div>
			<div class="space-y-3">
				<h4 class="text-sm font-semibold">Product</h4>
				<ul class="space-y-2 text-sm">
					<li><a href="/docs" class="text-muted-foreground hover:text-foreground">Documentation</a></li>
					<li><a href="/providers" class="text-muted-foreground hover:text-foreground">Providers</a></li>
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
					<li><a href="https://github.com/lipish/llm-link/discussions" class="text-muted-foreground hover:text-foreground">Discussions</a></li>
					<li><a href="https://github.com/lipish/llm-link/pulls" class="text-muted-foreground hover:text-foreground">Pull Requests</a></li>
				</ul>
			</div>
		</div>
		<div class="mt-8 border-t pt-8">
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<p class="text-sm text-muted-foreground">
					© 2024 LLM Link. Built with Svelte + Tailwind CSS.
				</p>
				<div class="flex items-center space-x-4">
					<a href="https://github.com/lipish/llm-link" class="text-muted-foreground hover:text-foreground">
						<Github class="h-4 w-4" />
					</a>
				</div>
			</div>
		</div>
	</div>
</footer>
