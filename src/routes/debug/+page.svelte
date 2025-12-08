<script lang="ts">
	let { data } = $props();
</script>

<div style="padding: 2rem; font-family: monospace;">
	<h1>Debug Information</h1>
	
	<h2>Environment Variables</h2>
	<pre>{JSON.stringify(data.envCheck, null, 2)}</pre>
	
	{#if data.success}
		<h2>Database Connection</h2>
		<p>✅ Successfully connected to database</p>
		<p>User count: {data.userCount}</p>
		<p>Admin user exists: {data.hasAdmin ? '✅ Yes' : '❌ No'}</p>
	{:else}
		<h2>Database Error</h2>
		<p>❌ {data.error}</p>
		{#if data.stack}
			<h3>Stack Trace</h3>
			<pre style="background: #f5f5f5; padding: 1rem; overflow: auto;">{data.stack}</pre>
		{/if}
	{/if}
</div>
