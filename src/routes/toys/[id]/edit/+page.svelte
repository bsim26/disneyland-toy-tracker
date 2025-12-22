<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	let name = $state('');
	let quantity = $state(0);
	let dateObtained = $state('');
	let picture = $state('');
	let notes = $state('');
	let boxNumber = $state('');
	let submitting = $state(false);
	
	$effect(() => {
		name = data.toy.name;
		quantity = data.toy.quantity;
		dateObtained = data.toy.dateObtained?.split('T')[0] || '';
		picture = data.toy.picture || '';
		notes = data.toy.notes || '';
		boxNumber = data.toy.boxNumber || '';
	});
	
	async function handleSubmit(e: Event) {
		e.preventDefault();
		submitting = true;
		
		try {
			const response = await fetch(`/api/toys/${data.toy.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					quantity: Number(quantity),
					dateObtained,
					picture: picture || undefined,
					notes: notes || undefined,
					boxNumber: boxNumber || undefined
				})
			});
			
			if (response.ok) {
				window.location.href = `/toys/${data.toy.id}`;
			} else {
				alert('Failed to update toy');
				submitting = false;
			}
		} catch (error) {
			alert(error instanceof Error ? error.message : 'Failed to update toy');
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Edit {data.toy.name} - Disneyland Toy Tracker</title>
</svelte:head>

<div class="container">
	<nav class="breadcrumb">
		<a href="/toys/{data.toy.id}">← Back to {data.toy.name}</a>
	</nav>

	<h1>Edit Toy</h1>

	<form onsubmit={handleSubmit}>
		<div class="form-group">
			<label for="name">Toy Name *</label>
			<input
				type="text"
				id="name"
				bind:value={name}
				required
				placeholder="e.g., Mickey Mouse Figurine"
			/>
		</div>

		<div class="form-group">
			<label for="quantity">Quantity *</label>
			<input
				type="number"
				id="quantity"
				bind:value={quantity}
				required
				min="0"
			/>
		</div>

		<div class="form-group">
			<label for="dateObtained">Date Obtained *</label>
			<input
				type="date"
				id="dateObtained"
				bind:value={dateObtained}
				required
			/>
		</div>

		<div class="form-group">
			<label for="picture">Picture</label>
			{#if picture}
				<div class="preview">
					<img src="/images/{picture}" alt="Current toy" />
				</div>
			{/if}
			<input
				type="text"
				id="picture"
				bind:value={picture}
				placeholder="Enter filename (e.g., mickey-2024.jpg)"
			/>
			<small>Upload images to the static/images folder, then enter the filename here.</small>
		</div>

		<div class="form-group">
			<label for="notes">Notes</label>
			<textarea
				id="notes"
				bind:value={notes}
				rows="4"
				placeholder="Any additional information about this toy..."
			></textarea>
		</div>

		<div class="form-group">
			<label for="boxNumber">Box Number</label>
			<input
				type="text"
				id="boxNumber"
				bind:value={boxNumber}
				placeholder="e.g., 1, 2A, B3"
			/>
			<small>Optional: Enter the storage box number for this toy.</small>
		</div>

		<div class="actions">
			<button type="submit" class="btn-primary" disabled={submitting}>
				{submitting ? 'Saving...' : 'Save Changes'}
			</button>
			<a href="/toys/{data.toy.id}" class="btn-secondary">Cancel</a>
		</div>
	</form>
</div>

<style>
	.container {
		max-width: 600px;
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

	h1 {
		color: #2c3e50;
		margin-bottom: 2rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #2c3e50;
	}

	input, textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
	}

	input:focus, textarea:focus {
		outline: none;
		border-color: #3498db;
	}

	small {
		display: block;
		margin-top: 0.5rem;
		color: #7f8c8d;
		font-size: 0.875rem;
	}

	code {
		background: #f8f9fa;
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-size: 0.875rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn-primary, .btn-secondary {
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		font-weight: 600;
		border: none;
		cursor: pointer;
		font-size: 1rem;
		text-decoration: none;
		display: inline-block;
	}

	.btn-primary {
		background: #3498db;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #2980b9;
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: #ecf0f1;
		color: #2c3e50;
	}

	.btn-secondary:hover {
		background: #bdc3c7;
	}
	
	.preview {
		margin: 1rem 0;
		border: 2px solid #ddd;
		border-radius: 10px;
		overflow: hidden;
		max-width: 300px;
	}
	
	.preview img {
		width: 100%;
		height: auto;
		display: block;
	}
</style>
