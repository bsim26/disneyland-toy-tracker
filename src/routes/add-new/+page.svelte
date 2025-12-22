<script lang="ts">
	let name = $state('');
	let quantity = $state(0);
	let dateObtained = $state(new Date().toISOString().split('T')[0]);
	let picture = $state('');
	let notes = $state('');
	let boxNumber = $state('');
	let isSubmitting = $state(false);
	let error = $state('');
	
	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		error = '';
		
		try {
			
			const response = await fetch('/api/toys', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					quantity,
					dateObtained,
					picture: picture || 'nya.jpg',
					notes,
					boxNumber: boxNumber || undefined
				})
			});
			
			if (response.ok) {
				const data = await response.json();
				window.location.href = `/toys/${data.id}`;
			} else {
				error = 'Failed to create toy';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Add New Toy - Disneyland Toy Tracker</title>
</svelte:head>

<div class="container">
	<nav class="breadcrumb">
		<a href="/" class="btn-back">← Back to Collection</a>
	</nav>
	
	<h1>🎈 Add New Toy</h1>
	
	<form onsubmit={handleSubmit}>
		{#if error}
			<div class="error">{error}</div>
		{/if}
		
		<div class="form-group">
			<label for="name">Toy Name *</label>
			<input
				id="name"
				type="text"
				bind:value={name}
				required
				placeholder="e.g., Mickey Mouse"
			/>
		</div>
		
		<div class="form-group">
			<label for="quantity">Quantity</label>
			<input
				id="quantity"
				type="number"
				bind:value={quantity}
				min="0"
			/>
		</div>
		
		<div class="form-group">
			<label for="dateObtained">Date Obtained</label>
			<input
				id="dateObtained"
				type="date"
				bind:value={dateObtained}
			/>
		</div>
		
		<div class="form-group">
			<label for="picture">Picture</label>
			<input
				id="picture"
				type="text"
				bind:value={picture}
				placeholder="Enter filename (e.g., mickey-mouse.jpg)"
			/>
			<small>Upload images to the static/images folder, then enter the filename here.</small>
		</div>
		
		<div class="form-group">
			<label for="notes">Notes</label>
			<textarea
				id="notes"
				bind:value={notes}
				rows="4"
				placeholder="Any additional notes..."
			></textarea>
		</div>
		
		<div class="form-group">
			<label for="boxNumber">Box Number</label>
			<input
				id="boxNumber"
				type="text"
				bind:value={boxNumber}
				placeholder="e.g., 1, 2A, B3"
			/>
			<small>Optional: Enter the storage box number for this toy.</small>
		</div>
		
		<button type="submit" class="btn-primary" disabled={isSubmitting || !name}>
			{isSubmitting ? 'Creating...' : '✨ Create Toy'}
		</button>
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
	
	.btn-back {
		display: inline-block;
		background: linear-gradient(135deg, var(--disney-light-blue), var(--disney-blue));
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 50px;
		text-decoration: none;
		font-weight: 700;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
		box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
	}
	
	.btn-back:hover {
		transform: scale(1.05) rotate(-2deg);
		box-shadow: 0 6px 20px rgba(52, 152, 219, 0.6);
	}
	
	h1 {
		color: var(--disney-blue);
		margin-bottom: 2rem;
		text-align: center;
		font-size: 2.5rem;
	}
	
	form {
		background: white;
		padding: 2rem;
		border-radius: 20px;
		border: 4px solid var(--disney-yellow);
		box-shadow: 0 8px 16px rgba(0,0,0,0.1);
	}
	
	.form-group {
		margin-bottom: 1.5rem;
	}
	
	label {
		display: block;
		color: var(--disney-blue);
		font-weight: 700;
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
	}
	
	input, textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid var(--disney-light-blue);
		border-radius: 10px;
		font-size: 1rem;
		transition: border-color 0.3s ease;
	}
	
	input:focus, textarea:focus {
		outline: none;
		border-color: var(--disney-pink);
	}
	
	.btn-primary {
		width: 100%;
		background: linear-gradient(135deg, var(--disney-pink), var(--disney-purple));
		color: white;
		padding: 1rem;
		border-radius: 50px;
		border: none;
		font-weight: 700;
		font-size: 1.2rem;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 1px;
		box-shadow: 0 4px 15px rgba(255, 105, 180, 0.4);
	}
	
	.btn-primary:hover:not(:disabled) {
		transform: scale(1.05);
		box-shadow: 0 6px 20px rgba(255, 105, 180, 0.6);
	}
	
	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	
	.error {
		background: #fee;
		color: #c33;
		padding: 1rem;
		border-radius: 10px;
		margin-bottom: 1rem;
		border: 2px solid #fcc;
	}
</style>
