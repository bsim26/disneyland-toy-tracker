<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Disneyland Happy Meal Toy Tracker</title>
</svelte:head>

<div class="container">
	<div class="header">
		<h1>🎡 Disneyland Happy Meal Toy Collection</h1>
		<form method="POST" action="/logout" class="logout-form">
			<button type="submit" class="btn-logout">🚪 Logout</button>
		</form>
	</div>

	<nav style="text-align: center; margin-bottom: 2rem;">
		<a href="/add-new" class="btn-add">➕ Add New Toy</a>
	</nav>

	<div class="toy-grid">
		{#each data.toys as toy}
			<div class="toy-card" class:not-acquired={toy.quantity === 0}>
				<a href="/toys/{toy.id}">
					{#if toy.picture}
						<img src="/images/{toy.picture}" alt={toy.name} />
					{:else}
						<div class="no-image">No Image</div>
					{/if}
					<div class="toy-info">
						<h3>{toy.name}</h3>
						<p>Quantity: {toy.quantity}</p>
						<p class="date">{new Date(toy.dateObtained).toLocaleDateString()}</p>
					</div>
				</a>
			</div>
		{/each}
	</div>

	{#if data.toys.length === 0}
		<p class="empty-state">No toys yet. Add your first toy to get started!</p>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		background: white;
		min-height: 100vh;
		box-shadow: 0 0 40px rgba(0,0,0,0.2);
	}

	h1 {
		color: var(--disney-blue);
		margin-bottom: 2rem;
		text-align: center;
		font-size: 3rem;
		text-shadow: 3px 3px 0px var(--disney-yellow),
		             6px 6px 0px var(--disney-light-blue);
		animation: float 3s ease-in-out infinite;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.logout-form {
		margin: 0;
	}

	.btn-logout {
		background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		border: none;
		font-weight: 700;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
		box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
	}

	.btn-logout:hover {
		transform: scale(1.05) rotate(-2deg);
		box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
	}

	nav {
		margin-bottom: 2rem;
		text-align: center;
	}

	.btn-add {
		display: inline-block;
		background: linear-gradient(135deg, #00d2ff, #3a7bd5);
		color: white;
		padding: 1rem 2rem;
		border-radius: 50px;
		text-decoration: none;
		font-weight: 700;
		font-size: 1.2rem;
		box-shadow: 0 4px 15px rgba(0, 210, 255, 0.4);
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.btn-add:hover {
		transform: scale(1.1) rotate(-2deg);
		box-shadow: 0 6px 20px rgba(0, 210, 255, 0.6);
	}

	.btn-primary {
		display: inline-block;
		background: linear-gradient(135deg, var(--disney-pink), var(--disney-purple));
		color: white;
		padding: 1rem 2rem;
		border-radius: 50px;
		text-decoration: none;
		font-weight: 700;
		font-size: 1.2rem;
		box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.btn-primary:hover {
		transform: scale(1.1) rotate(-2deg);
		box-shadow: 0 6px 20px rgba(255, 105, 180, 0.6);
	}

	.toy-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 2rem;
	}

	.toy-card {
		border: 4px solid var(--disney-yellow);
		border-radius: 20px;
		overflow: hidden;
		transition: all 0.3s ease;
		background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
		box-shadow: 0 8px 16px rgba(0,0,0,0.2);
		position: relative;
	}

	.toy-card::before {
		content: '⭐';
		position: absolute;
		top: 10px;
		right: 10px;
		font-size: 2rem;
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: 10;
		animation: sparkle 2s infinite;
	}

	.toy-card:hover::before {
		opacity: 1;
	}

	.toy-card:hover {
		transform: translateY(-10px) rotate(2deg);
		box-shadow: 0 12px 24px rgba(0,0,0,0.3);
		border-color: var(--disney-pink);
	}

	.toy-card.not-acquired {
		opacity: 0.4;
		filter: grayscale(50%);
	}

	.toy-card.not-acquired:hover {
		opacity: 0.7;
		filter: grayscale(30%);
	}

	.toy-card a {
		text-decoration: none;
		color: inherit;
	}

	.toy-card img {
		width: 100%;
		height: 220px;
		object-fit: cover;
		border-bottom: 3px solid var(--disney-blue);
	}

	.no-image {
		width: 100%;
		height: 220px;
		background: linear-gradient(135deg, var(--disney-light-blue), var(--disney-blue));
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 1.5rem;
		font-weight: 700;
		border-bottom: 3px solid var(--disney-yellow);
	}

	.toy-info {
		padding: 1.5rem;
		background: white;
	}

	.toy-info h3 {
		margin: 0 0 0.75rem 0;
		color: var(--disney-blue);
		font-size: 1.5rem;
	}

	.toy-info p {
		margin: 0.5rem 0;
		color: #555;
		font-weight: 600;
		font-size: 1.1rem;
	}

	.date {
		font-size: 1rem;
		color: var(--disney-purple);
	}

	.empty-state {
		text-align: center;
		color: var(--disney-blue);
		padding: 4rem;
		font-size: 1.5rem;
		font-weight: 600;
		background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
		border-radius: 20px;
		border: 4px dashed var(--disney-pink);
	}
</style>
