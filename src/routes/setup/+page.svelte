<svelte:head>
	<title>Setup - Disneyland Toy Tracker</title>
</svelte:head>

<div class="setup-container">
	<div class="setup-card">
		<h1>🏰 First Time Setup</h1>
		<p>Click the button below to create your admin account</p>
		
		<form method="POST">
			<button type="submit" class="btn-setup">
				✨ Create Admin User
			</button>
		</form>

		<div class="info">
			<p><strong>Default Credentials:</strong></p>
			<p>Username: <code>admin</code></p>
			<p>Password: <code>password</code></p>
		</div>
	</div>
</div>

<style>
	.setup-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.setup-card {
		background: white;
		padding: 3rem;
		border-radius: 30px;
		box-shadow: 0 20px 60px rgba(0,0,0,0.3);
		border: 5px solid var(--disney-yellow);
		max-width: 500px;
		width: 100%;
		text-align: center;
	}

	h1 {
		color: var(--disney-blue);
		font-size: 2.5rem;
		margin-bottom: 1rem;
		text-shadow: 2px 2px 0px var(--disney-yellow);
	}

	p {
		color: var(--disney-purple);
		font-size: 1.2rem;
		margin-bottom: 2rem;
		font-weight: 600;
	}

	.btn-setup {
		width: 100%;
		padding: 1.2rem;
		background: linear-gradient(135deg, var(--disney-pink), var(--disney-purple));
		color: white;
		border: none;
		border-radius: 50px;
		font-size: 1.3rem;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
		box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
	}

	.btn-setup:hover {
		transform: scale(1.05) rotate(-1deg);
		box-shadow: 0 6px 20px rgba(255, 105, 180, 0.6);
	}

	.info {
		margin-top: 2rem;
		padding: 1.5rem;
		background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
		border-radius: 15px;
	}

	.info p {
		margin: 0.5rem 0;
		font-size: 1rem;
	}

	code {
		background: white;
		padding: 0.3rem 0.6rem;
		border-radius: 5px;
		color: var(--disney-blue);
		font-weight: 700;
	}
</style>
