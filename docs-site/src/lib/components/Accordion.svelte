<script lang="ts">
	import { ChevronDown } from 'lucide-svelte';
	
	export let title: string;
	export let open: boolean = false;
	
	function toggle() {
		open = !open;
	}
</script>

<div class="accordion">
	<button 
		class="accordion-header" 
		on:click={toggle}
		aria-expanded={open}
	>
		<span class="accordion-title">{title}</span>
		<div class="accordion-icon" class:open={open}>
			<ChevronDown size={20} />
		</div>
	</button>
	
	{#if open}
		<div class="accordion-content">
			<slot />
		</div>
	{/if}
</div>

<style>
	.accordion {
		border: 1px solid hsl(var(--border));
		border-radius: 0.5rem;
		overflow: hidden;
		background: hsl(var(--card));
	}

	.accordion-header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 1.5rem;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.accordion-header:hover {
		background: hsl(var(--muted) / 0.5);
	}

	.accordion-title {
		font-size: 1rem;
		font-weight: 600;
		text-align: left;
	}

	.accordion-icon {
		width: 1.25rem;
		height: 1.25rem;
		transition: transform 0.2s;
		color: hsl(var(--muted-foreground));
	}

	.accordion-icon.open {
		transform: rotate(180deg);
	}

	.accordion-content {
		padding: 0 1.5rem 1.5rem;
		animation: slideDown 0.2s ease-out;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-0.5rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
