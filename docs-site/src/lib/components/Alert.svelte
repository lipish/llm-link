<script>
	import { Info, AlertTriangle } from 'lucide-svelte';
	
	export let type = 'info';
	
	const icons = {
		info: Info,
		warning: AlertTriangle
	};
	
	const styles = {
		info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200'
	};
</script>

<div class="rounded-lg border p-4 flex items-start gap-3 {styles[type]}">
	<svelte:component this={icons[type]} class="h-5 w-5 mt-0.5 flex-shrink-0" />
	<div class="flex-1">
		<slot />
	</div>
</div>
