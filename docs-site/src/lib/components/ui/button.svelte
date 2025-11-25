<script lang="ts">
	import { cn } from "$lib/utils";

	const variants = {
		default: "bg-primary text-primary-foreground hover:bg-primary/90",
		outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
		ghost: "hover:bg-accent hover:text-accent-foreground",
		link: "text-primary underline-offset-4 hover:underline"
	} as const;

	const sizes = {
		default: "h-10 px-4 py-2",
		sm: "h-9 rounded-md px-3",
		lg: "h-11 rounded-md px-8",
		icon: "h-10 w-10"
	} as const;

	type ButtonVariant = keyof typeof variants;
	type ButtonSize = keyof typeof sizes;

	export let variant: ButtonVariant = "default";
	export let size: ButtonSize = "default";
	export let href: string | undefined = undefined;
	export let disabled = false;
	export let type: "button" | "submit" | "reset" = "button";

	$: classes = cn(
		"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
		variants[variant],
		sizes[size]
	);
</script>

{#if href}
	<a {href} class={classes} {...$$restProps}>
		<slot />
	</a>
{:else}
	<button
		{type}
		{disabled}
		class={classes}
		{...$$restProps}
		on:click
	>
		<slot />
	</button>
{/if}
