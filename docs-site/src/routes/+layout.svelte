<script>
	import '../app.css';
	import Navbar from '$lib/components/navbar.svelte';
	import Footer from '$lib/components/footer.svelte';
</script>

<div class="min-h-screen bg-background font-sans antialiased">
	<div class="relative flex min-h-screen flex-col">
		<Navbar />
		<main class="flex-1">
			<slot />
		</main>
		<Footer />
	</div>
</div>

<style>
	:global(body) {
		@apply bg-background text-foreground;
	}
</style>
