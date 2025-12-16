<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	let name = $state('');
	let quantity = $state(0);
	let dateObtained = $state('');
	let picture = $state('');
	let pictureFile = $state<File | null>(null);
	let picturePreview = $state('');
	let notes = $state('');
	let submitting = $state(false);
	
	$effect(() => {
		name = data.toy.name;
		quantity = data.toy.quantity;
		dateObtained = data.toy.dateObtained.split('T')[0];
		picture = data.toy.picture || '';
		notes = data.toy.notes || '';
		
		// Set current picture as preview
		if (picture) {
			picturePreview = `/images/${picture}`;
		}
	});
	
	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		
		if (file) {
			pictureFile = file;
			picture = file.name;
			
			// Create preview
			const reader = new FileReader();
			reader.onload = (e) => {
				picturePreview = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}
	
	async function uploadFile(file: File): Promise<string> {
		const formData = new FormData();
		formData.append('file', file);
		
		const response = await fetch('/api/upload', {
			method: 'POST',
			body: formData
		});
		
		if (!response.ok) {
			throw new Error('Failed to upload file');
		}
		
		const uploadData = await response.json();
		return uploadData.filename;
	}
	
	async function handleSubmit(e: Event) {
		e.preventDefault();
		submitting = true;
		
		try {
			let finalPicture = picture;
			
			// Upload file if selected
			if (pictureFile) {
				finalPicture = await uploadFile(pictureFile);
			}
			
			const response = await fetch(`/api/toys/${data.toy.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					quantity: Number(quantity),
					dateObtained,
					picture: finalPicture || undefined,
					notes: notes || undefined
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
			<div class="file-upload-section">
				<input
					id="picture-file"
					type="file"
					accept="image/*"
					onchange={handleFileChange}
					class="file-input"
				/>
				{#if picturePreview}
					<div class="preview">
						<img src={picturePreview} alt="Preview" />
					</div>
				{/if}
			</div>
			<input
				type="text"
				id="picture"
				bind:value={picture}
				placeholder="Or enter filename manually (e.g., mickey-2024.jpg)"
			/>
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
		border: 2px solid var(--disney-light-blue);
		border-radius: 10px;
		overflow: hidden;
		max-width: 300px;
	}
	
	.preview img {
		width: 100%;
		height: auto;
		display: block;
	}
	
	.file-upload-section {
		margin-bottom: 1rem;
	}
	
	.file-input,
	input[type="file"] {
		padding: 0.5rem !important;
		border: 2px dashed #3498db !important;
		border-radius: 10px !important;
		cursor: pointer !important;
		background: white !important;
		display: block !important;
		width: 100% !important;
		height: auto !important;
		font-size: 1rem !important;
	}
	
	.file-input:hover,
	input[type="file"]:hover {
		border-color: #2980b9 !important;
		background: #f9f9f9 !important;
	}
</style>
