<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	const basePath = base;

	const navGroups = [
		{
			title: 'Getting Started',
			items: [
				{ label: 'Introduction', href: '/docs' },
				{ label: 'Quick Start', href: '/docs/quick-start' },
				{ label: 'Architecture', href: '/docs/architecture' }
			]
		},
		{
			title: 'Applications',
			items: [
				{ label: 'Zed.dev', href: '/docs/apps/zed' },
				{ label: 'Codex CLI', href: '/docs/apps/codex' },
				{ label: 'Aider', href: '/docs/apps/aider' },
				{ label: 'OpenHands', href: '/docs/apps/openhands' },
				{ label: 'Agent Zero', href: '/docs/apps/agent-zero' }
			]
		},
		{
			title: 'Protocols',
			items: [
				{ label: 'Protocol mode', href: '/docs/protocols' }
			]
		},
		{
			title: 'Reference',
			items: [
				{ label: 'API Reference', href: '/api' }
			]
		}
	];

	const isActive = (path: string, current: string) => {
		if (path === '/docs') {
			return current === `${basePath}/docs`;
		}
		if (path.startsWith('/docs/')) {
			return current.startsWith(`${basePath}${path}`);
		}
		return current.startsWith(`${basePath}${path}`);
	};
</script>

<div class="mx-auto max-w-6xl px-6 py-8">
	<!-- Mobile nav -->
	<div class="mb-4 md:hidden">
		<nav class="flex flex-wrap gap-2 text-sm">
			{#each navGroups as group}
				<div class="flex flex-wrap gap-2 w-full">
					<p class="w-full text-[11px] font-medium text-muted-foreground uppercase tracking-[0.16em]">
						{group.title}
					</p>
					{#each group.items as item}
						<a
							href={`${basePath}${item.href}`}
							class="inline-flex items-center rounded-full border px-3 py-1 text-[13px] hover:bg-muted/70"
							class:selected-pill={isActive(item.href, $page.url.pathname)}
						>
							{item.label}
						</a>
					{/each}
				</div>
			{/each}
		</nav>
	</div>

	<div class="flex gap-10">
		<aside class="hidden md:block w-60 shrink-0 pr-4 border-r">
			<nav class="space-y-6 text-sm">
				{#each navGroups as group}
					<div class="space-y-2">
						<p class="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.16em]">
							{group.title}
						</p>
						<div class="space-y-0.5">
							{#each group.items as item}
								<a
									href={`${basePath}${item.href}`}
									class="block px-2 py-1.5 text-[13px] text-muted-foreground hover:text-foreground"
									class:selected={isActive(item.href, $page.url.pathname)}
								>
									<span>{item.label}</span>
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</nav>
		</aside>

		<main class="flex-1 min-w-0">
			<slot />
		</main>
	</div>
</div>

<style>
	a.selected {
		color: hsl(var(--primary));
		font-weight: 500;
		border-left: 2px solid hsl(var(--primary));
		margin-left: -0.5rem;
		padding-left: calc(0.5rem - 2px);
		background-color: transparent;
	}

	a.selected-pill {
		background-color: hsl(var(--muted));
		color: hsl(var(--primary));
		font-weight: 500;
		border-color: hsl(var(--primary));
	}
</style>
