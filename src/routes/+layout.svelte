<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { PUBLIC_FONTAWESOME_KIT_URL } from '$env/static/public';
	
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	{#if PUBLIC_FONTAWESOME_KIT_URL}
		<script src={PUBLIC_FONTAWESOME_KIT_URL} crossorigin="anonymous"></script>
	{/if}
</svelte:head>

{@render children()}
