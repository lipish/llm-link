<script>
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import Button from '$lib/components/ui/button.svelte';
	import { Github, ExternalLink } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	
	const basePath = base;
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container flex h-14 items-center">
		<div class="mr-4 hidden md:flex">
			<a href={`${basePath}/`} class="mr-6 flex items-center space-x-2">
				<span class="hidden font-bold sm:inline-block text-xl">LLM Link</span>
			</a>
			<nav class="flex items-center space-x-6 text-sm font-medium">
				<a
						href={`${basePath}/`}
						class={cn(
							"border-b-2 border-transparent pb-0.5 transition-colors hover:text-foreground/80",
							$page.url.pathname === `${basePath}/`
								? "text-foreground border-primary"
								: "text-foreground/60"
						)}
					>
						Home
				</a>
				<a
						href={`${basePath}/docs`}
						class={cn(
							"border-b-2 border-transparent pb-0.5 transition-colors hover:text-foreground/80",
							$page.url.pathname.startsWith(`${basePath}/docs`)
								? "text-foreground border-primary"
								: "text-foreground/60"
						)}
					>
						Documentation
				</a>
				<a
						href={`${basePath}/api`}
						class={cn(
							"border-b-2 border-transparent pb-0.5 transition-colors hover:text-foreground/80",
							$page.url.pathname.startsWith(`${basePath}/api`)
								? "text-foreground border-primary"
								: "text-foreground/60"
						)}
					>
						API Reference
				</a>
				<a
						href={`${basePath}/providers`}
						class={cn(
							"border-b-2 border-transparent pb-0.5 transition-colors hover:text-foreground/80",
							$page.url.pathname === `${basePath}/providers`
								? "text-foreground border-primary"
								: "text-foreground/60"
						)}
					>
						Providers
				</a>
			</nav>
		</div>
		<div class="flex flex-1 items-center justify-between space-x-2 md:justify-end">
			<div class="w-full flex-1 md:w-auto md:flex-none">
				<Button>
					<ExternalLink class="mr-2 h-4 w-4" />
					Get Started
				</Button>
			</div>
		</div>
	</div>
</header>
