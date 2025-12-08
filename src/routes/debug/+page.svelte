<script lang="ts">
	let { data } = $props();
	let testResult = $state<any>(null);
	let loading = $state(false);
	
	async function testHash() {
		loading = true;
		try {
			const response = await fetch('/debug/hash', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username: 'admin', password: 'password' })
			});
			testResult = await response.json();
		} catch (error) {
			testResult = { error: error instanceof Error ? error.message : 'Unknown error' };
		}
		loading = false;
	}
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
	
	<h2>Password Hash Test</h2>
	<button onclick={testHash} disabled={loading}>
		{loading ? 'Testing...' : 'Test admin/password hash'}
	</button>
	
	{#if testResult}
		<pre style="background: #f5f5f5; padding: 1rem; overflow: auto; margin-top: 1rem;">{JSON.stringify(testResult, null, 2)}</pre>
	{/if}
</div>
