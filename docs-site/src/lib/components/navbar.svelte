<script>
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button.svelte';
	import { Github, ExternalLink } from 'lucide-svelte';
	import { cn } from '$lib/utils.ts';
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container flex h-14 items-center">
		<div class="mr-4 hidden md:flex">
			<a href="/" class="mr-6 flex items-center space-x-2">
				<span class="hidden font-bold sm:inline-block text-xl">LLM Link</span>
			</a>
			<nav class="flex items-center space-x-6 text-sm font-medium">
				<a
					href="/"
					class={cn(
						"transition-colors hover:text-foreground/80",
						$page.url.pathname === "/" ? "text-foreground" : "text-foreground/60"
					)}
				>
					Home
				</a>
				<a
					href="/docs"
					class={cn(
						"transition-colors hover:text-foreground/80",
						$page.url.pathname.startsWith("/docs") ? "text-foreground" : "text-foreground/60"
					)}
				>
					Documentation
				</a>
				<a
					href="/providers"
					class={cn(
						"transition-colors hover:text-foreground/80",
						$page.url.pathname === "/providers" ? "text-foreground" : "text-foreground/60"
					)}
				>
					Providers
				</a>
			</nav>
		</div>
		<div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
			<div class="w-full flex-1 md:w-auto md:flex-none">
				<Button variant="outline" class="mr-2">
					<Github class="mr-2 h-4 w-4" />
					GitHub
				</Button>
				<Button>
					<ExternalLink class="mr-2 h-4 w-4" />
					Get Started
				</Button>
			</div>
		</div>
	</div>
</header>
