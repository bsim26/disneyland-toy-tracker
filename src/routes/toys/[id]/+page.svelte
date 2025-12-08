<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	let showDelete = $state(false);
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.ctrlKey && event.shiftKey && event.key === 'D') {
			event.preventDefault();
			showDelete = !showDelete;
		}
	}
	
	async function deleteToy() {
		if (!confirm('Are you sure you want to delete this toy?')) return;
		
		const response = await fetch(`/api/toys/${data.toy.id}`, {
			method: 'DELETE'
		});
		
		if (response.ok) {
			window.location.href = '/';
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>{data.toy.name} - Disneyland Toy Tracker</title>
</svelte:head>

<div class="container">
	<nav class="breadcrumb">
		<a href="/">← Back to Collection</a>
	</nav>

	<div class="toy-detail">
		<div class="image-section">
			{#if data.toy.picture}
				<img src="/images/{data.toy.picture}" alt={data.toy.name} />
			{:else}
				<div class="no-image">No Image Available</div>
			{/if}
		</div>

		<div class="info-section">
			<h1>{data.toy.name}</h1>
			
			<div class="metadata">
				<div class="meta-item">
					<strong>Quantity:</strong> {data.toy.quantity}
				</div>
				<div class="meta-item">
					<strong>Date Obtained:</strong> {new Date(data.toy.dateObtained).toLocaleDateString()}
				</div>
			</div>

			{#if data.toy.notes}
				<div class="notes">
					<h3>Notes</h3>
					<p>{data.toy.notes}</p>
				</div>
			{/if}

			<div class="actions">
				<a href="/toys/{data.toy.id}/edit" class="btn-primary">Edit</a>
				{#if showDelete}
					<button onclick={deleteToy} class="btn-danger">Delete</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.container {
		max-width: 900px;
		margin: 0 auto;
		padding: 2rem;
	}

	.breadcrumb {
		margin-bottom: 2rem;
	}

	.breadcrumb a {
		color: #3498db;
		text-decoration: none;
	}

	.toy-detail {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	@media (max-width: 768px) {
		.toy-detail {
			grid-template-columns: 1fr;
		}
	}

	.image-section img {
		width: 100%;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}

	.no-image {
		width: 100%;
		aspect-ratio: 1;
		background: #ecf0f1;
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #95a5a6;
		font-size: 1.2rem;
	}

	h1 {
		color: #2c3e50;
		margin-bottom: 1.5rem;
	}

	.metadata {
		background: #f8f9fa;
		padding: 1.5rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.meta-item {
		margin-bottom: 0.75rem;
	}

	.meta-item:last-child {
		margin-bottom: 0;
	}

	.notes {
		margin-bottom: 2rem;
	}

	.notes h3 {
		color: #2c3e50;
		margin-bottom: 0.5rem;
	}

	.notes p {
		color: #555;
		line-height: 1.6;
		white-space: pre-wrap;
	}

	.actions {
		display: flex;
		gap: 1rem;
	}

	.btn-primary, .btn-danger {
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		text-decoration: none;
		font-weight: 600;
		border: none;
		cursor: pointer;
		font-size: 1rem;
	}

	.btn-primary {
		background: #3498db;
		color: white;
	}

	.btn-primary:hover {
		background: #2980b9;
	}

	.btn-danger {
		background: #e74c3c;
		color: white;
	}

	.btn-danger:hover {
		background: #c0392b;
	}
</style>
