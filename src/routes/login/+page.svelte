<script lang="ts">
	import { enhance } from '$app/forms';
	
	let { form } = $props();
</script>

<svelte:head>
	<title>Login - Disneyland Toy Tracker</title>
</svelte:head>

<div class="login-container">
	<div class="login-card">
		<h1>🏰 Welcome!</h1>
		<p class="subtitle">Login to access your magical toy collection</p>

		{#if form?.error}
			<div class="error-message">
				❌ {form.error}
			</div>
		{/if}

		<form method="POST" use:enhance>
			<div class="form-group">
				<label for="username">Username</label>
				<input
					type="text"
					id="username"
					name="username"
					required
					placeholder="Enter your username"
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					placeholder="Enter your password"
				/>
			</div>

			<button type="submit" class="btn-login">
				✨ Enter the Magic Kingdom
			</button>
		</form>

		<p class="hint">
			💡 Hint: Default credentials are <code>admin</code> / <code>password</code>
		</p>
	</div>
</div>

<style>
	.login-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.login-card {
		background: white;
		padding: 3rem;
		border-radius: 30px;
		box-shadow: 0 20px 60px rgba(0,0,0,0.3);
		border: 5px solid var(--disney-yellow);
		max-width: 500px;
		width: 100%;
	}

	h1 {
		color: var(--disney-blue);
		text-align: center;
		font-size: 3rem;
		margin-bottom: 0.5rem;
		text-shadow: 3px 3px 0px var(--disney-yellow);
	}

	.subtitle {
		text-align: center;
		color: var(--disney-purple);
		font-size: 1.2rem;
		font-weight: 600;
		margin-bottom: 2rem;
	}

	.error-message {
		background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
		color: white;
		padding: 1rem;
		border-radius: 15px;
		margin-bottom: 1.5rem;
		text-align: center;
		font-weight: 600;
		font-size: 1.1rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		font-weight: 700;
		margin-bottom: 0.5rem;
		color: var(--disney-blue);
		font-size: 1.1rem;
	}

	input {
		width: 100%;
		padding: 1rem;
		border: 3px solid var(--disney-light-blue);
		border-radius: 15px;
		font-size: 1.1rem;
		font-family: inherit;
		transition: all 0.3s ease;
	}

	input:focus {
		outline: none;
		border-color: var(--disney-pink);
		box-shadow: 0 0 15px rgba(255, 105, 180, 0.3);
		transform: scale(1.02);
	}

	.btn-login {
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
		margin-top: 1rem;
	}

	.btn-login:hover {
		transform: scale(1.05) rotate(-1deg);
		box-shadow: 0 6px 20px rgba(255, 105, 180, 0.6);
	}

	.hint {
		text-align: center;
		margin-top: 2rem;
		color: var(--disney-purple);
		font-size: 0.95rem;
	}

	code {
		background: #ffeaa7;
		padding: 0.2rem 0.5rem;
		border-radius: 5px;
		color: var(--disney-blue);
		font-weight: 700;
	}
</style>
