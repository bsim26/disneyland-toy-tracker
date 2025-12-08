<script lang="ts">
	let name = $state('');
	let quantity = $state(1);
	let dateObtained = $state(new Date().toISOString().split('T')[0]);
	let picture = $state('');
	let notes = $state('');
	let submitting = $state(false);
	
	async function handleSubmit(e: Event) {
		e.preventDefault();
		submitting = true;
		
		const response = await fetch('/api/toys', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name,
				quantity: Number(quantity),
				dateObtained,
				picture: picture || undefined,
				notes: notes || undefined
			})
		});
		
		if (response.ok) {
			const { id } = await response.json();
			window.location.href = `/toys/${id}`;
		} else {
			alert('Failed to create toy');
			submitting = false;
		}
	}
</script>

<svelte:head>
	<title>Add New Toy - Disneyland Toy Tracker</title>
</svelte:head>

<div class="container">
	<nav class="breadcrumb">
		<a href="/">← Back to Collection</a>
	</nav>

	<h1>Add New Toy</h1>

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
			<label for="picture">Picture Filename</label>
			<input
				type="text"
				id="picture"
				bind:value={picture}
				placeholder="e.g., mickey-2024.jpg (place in static/images/)"
			/>
			<small>Upload images to the <code>static/images/</code> folder, then enter the filename here.</small>
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

		<div class="actions">
			<button type="submit" class="btn-primary" disabled={submitting}>
				{submitting ? 'Creating...' : 'Add Toy'}
			</button>
			<a href="/" class="btn-secondary">Cancel</a>
		</div>
	</form>
</div>

<style>
	.container {
		max-width: 700px;
		margin: 2rem auto;
		padding: 3rem;
		background: white;
		border-radius: 30px;
		box-shadow: 0 10px 40px rgba(0,0,0,0.3);
		border: 5px solid var(--disney-yellow);
	}

	.breadcrumb {
		margin-bottom: 2rem;
	}

	.breadcrumb a {
		color: var(--disney-pink);
		text-decoration: none;
		font-weight: 700;
		font-size: 1.1rem;
		transition: all 0.3s ease;
	}

	.breadcrumb a:hover {
		color: var(--disney-purple);
		transform: translateX(-5px);
	}

	h1 {
		color: var(--disney-blue);
		margin-bottom: 2rem;
		text-align: center;
		font-size: 2.5rem;
		text-shadow: 2px 2px 0px var(--disney-yellow);
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

	input, textarea {
		width: 100%;
		padding: 1rem;
		border: 3px solid var(--disney-light-blue);
		border-radius: 15px;
		font-size: 1.1rem;
		font-family: inherit;
		transition: all 0.3s ease;
	}

	input:focus, textarea:focus {
		outline: none;
		border-color: var(--disney-pink);
		box-shadow: 0 0 15px rgba(255, 105, 180, 0.3);
		transform: scale(1.02);
	}

	small {
		display: block;
		margin-top: 0.5rem;
		color: var(--disney-purple);
		font-size: 0.9rem;
		font-weight: 600;
	}

	code {
		background: #ffeaa7;
		padding: 0.2rem 0.5rem;
		border-radius: 5px;
		font-size: 0.9rem;
		color: var(--disney-blue);
	}

	.actions {
		display: flex;
		gap: 1rem;
		margin-top: 2rem;
	}

	.btn-primary, .btn-secondary {
		padding: 1rem 2rem;
		border-radius: 50px;
		font-weight: 700;
		border: none;
		cursor: pointer;
		font-size: 1.1rem;
		text-decoration: none;
		display: inline-block;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.btn-primary {
		background: linear-gradient(135deg, var(--disney-pink), var(--disney-purple));
		color: white;
		box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
		flex: 1;
	}

	.btn-primary:hover:not(:disabled) {
		transform: scale(1.05) rotate(-1deg);
		box-shadow: 0 6px 20px rgba(255, 105, 180, 0.6);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: linear-gradient(135deg, #ffeaa7, #fdcb6e);
		color: var(--disney-blue);
		box-shadow: 0 4px 15px rgba(253, 203, 110, 0.4);
	}

	.btn-secondary:hover {
		transform: scale(1.05) rotate(1deg);
		box-shadow: 0 6px 20px rgba(253, 203, 110, 0.6);
	}
</style>
