<script lang="ts">
	import type { PageData } from './$types';
	
	let { data }: { data: PageData } = $props();
	
	// State for search and sort
	let searchQuery = $state('');
	let sortBy = $state<'box' | 'name' | 'date'>('box');
	let filterBy = $state<'all' | 'acquired' | 'not-acquired'>('all');
	
	// Filter and sort toys
	let filteredAndSortedToys = $derived(() => {
		// First filter by search query
		let result = data.toys.filter(toy => 
			toy.name.toLowerCase().includes(searchQuery.toLowerCase())
		);
		
		// Filter by acquisition status
		if (filterBy === 'acquired') {
			result = result.filter(toy => toy.quantity > 0);
		} else if (filterBy === 'not-acquired') {
			result = result.filter(toy => toy.quantity === 0);
		}
		
		// Then sort
		result.sort((a, b) => {
			if (sortBy === 'box') {
				// Sort by box number (nulls last)
				if (!a.boxNumber && !b.boxNumber) return 0;
				if (!a.boxNumber) return 1;
				if (!b.boxNumber) return -1;
				return a.boxNumber.localeCompare(b.boxNumber, undefined, { numeric: true });
			} else if (sortBy === 'name') {
				return a.name.localeCompare(b.name);
			} else if (sortBy === 'date') {
				// Sort by date (nulls last)
				if (!a.dateObtained && !b.dateObtained) return 0;
				if (!a.dateObtained) return 1;
				if (!b.dateObtained) return -1;
				return new Date(b.dateObtained).getTime() - new Date(a.dateObtained).getTime();
			}
			return 0;
		});
		
		return result;
	});
	
	// Calculate progress: percentage of toys with quantity > 0
	let progress = $derived(() => {
		if (data.toys.length === 0) return 0;
		const toysAcquired = data.toys.filter(toy => toy.quantity > 0).length;
		return Math.round((toysAcquired / data.toys.length) * 100);
	});
</script>

<svelte:head>
	<title>Disneyland Happy Meal Toy Tracker</title>
</svelte:head>

<div class="container">
	<div class="header">
		<h1>Disneyland Happy Meal Toy Collection</h1>
		<form method="POST" action="/logout" class="logout-form">
			<button type="submit" class="btn-logout"><i class="fa-notdog-duo fa-solid fa-arrow-right-from-bracket"></i> Logout</button>
		</form>
	</div>

	<nav class="nav-container">
		<div class="progress-container">
			<div class="progress-label">
				<span class="progress-text">Collection Progress</span>
				<span class="progress-percentage">{progress()}%</span>
			</div>
			<div class="progress-bar">
				<div class="progress-fill" style="width: {progress()}%"></div>
			</div>
			<span class="progress-description">{data.toys.filter(t => t.quantity > 0).length} of {data.toys.length} toys acquired</span>
		</div>
	</nav>

	<div class="controls">
		<div class="search-container">
			<i class="fa-solid fa-search search-icon"></i>
			<input 
				type="text" 
				placeholder="Search toys..." 
				bind:value={searchQuery}
				class="search-input"
			/>
			{#if searchQuery}
				<button class="clear-search" onclick={() => searchQuery = ''}>
					<i class="fa-solid fa-times"></i>
				</button>
			{/if}
		</div>
		
		<div class="filter-container">
			<span class="filter-label">Filter:</span>
			<div class="filter-buttons">
				<button 
					class="filter-btn"
					class:active={filterBy === 'all'}
					onclick={() => filterBy = 'all'}
				>
					<i class="fa-solid fa-list"></i> All
				</button>
				<button 
					class="filter-btn"
					class:active={filterBy === 'acquired'}
					onclick={() => filterBy = 'acquired'}
				>
					<i class="fa-solid fa-check-circle"></i> Acquired
				</button>
				<button 
					class="filter-btn"
					class:active={filterBy === 'not-acquired'}
					onclick={() => filterBy = 'not-acquired'}
				>
					<i class="fa-solid fa-circle"></i> Not Acquired
				</button>
			</div>
		</div>
		
		<div class="sort-container">
			<span class="sort-label">Sort by:</span>
			<div class="sort-buttons">
				<button 
					class="sort-btn"
					class:active={sortBy === 'box'}
					onclick={() => sortBy = 'box'}
				>
					<i class="fa-solid fa-box"></i> Box #
				</button>
				<button 
					class="sort-btn"
					class:active={sortBy === 'name'}
					onclick={() => sortBy = 'name'}
				>
					<i class="fa-solid fa-sort-alpha-down"></i> Name
				</button>
				<button 
					class="sort-btn"
					class:active={sortBy === 'date'}
					onclick={() => sortBy = 'date'}
				>
					<i class="fa-solid fa-calendar"></i> Date
				</button>
			</div>
		</div>
	</div>

	{#if filteredAndSortedToys().length === 0}
		<p class="empty-state">
			{#if searchQuery}
				No toys found matching "{searchQuery}"
			{:else}
				No toys yet. Add your first toy to get started!
			{/if}
		</p>
	{:else}
		<div class="toy-grid">
			{#each filteredAndSortedToys() as toy}
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
						{#if toy.dateObtained}
							<p class="date">{new Date(toy.dateObtained).toLocaleDateString()}</p>
						{/if}
					</div>
					{#if toy.boxNumber}
						<div class="box-number">Box {toy.boxNumber}</div>
					{/if}
				</a>
			</div>
			{/each}
		</div>
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
		font-family: 'Started By A Mouse', 'Bubblegum Sans', cursive;
		color: var(--disney-blue);
		margin-bottom: 2rem;
		text-align: center;
		font-size: 4rem;
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

	.nav-container {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2rem;
		flex-wrap: wrap;
		margin-bottom: 2rem;
	}

	.progress-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		min-width: 280px;
		max-width: 400px;
		flex: 1;
	}

	.progress-label {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 700;
		color: var(--disney-blue);
	}

	.progress-text {
		font-size: 1rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.progress-percentage {
		font-size: 1.3rem;
		color: var(--disney-pink);
		text-shadow: 1px 1px 0px var(--disney-yellow);
	}

	.progress-bar {
		width: 100%;
		height: 30px;
		background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
		border-radius: 50px;
		overflow: hidden;
		box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
		border: 3px solid var(--disney-blue);
		position: relative;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(135deg, var(--disney-pink), var(--disney-purple), var(--disney-yellow));
		border-radius: 50px;
		transition: width 0.5s ease;
		box-shadow: 0 0 10px rgba(255, 105, 180, 0.6);
		position: relative;
		overflow: hidden;
	}

	.progress-fill::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(90deg, 
			transparent, 
			rgba(255,255,255,0.3), 
			transparent);
		animation: shimmer 2s infinite;
	}

	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	.progress-description {
		font-size: 0.85rem;
		color: #666;
		font-weight: 600;
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
		content: '\f005';
		font-family: 'Font Awesome 7 Notdog Duo';
		font-weight: 900;
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
		position: relative;
		display: block;
	}

	.box-number {
		position: absolute;
		bottom: 10px;
		right: 10px;
		background: linear-gradient(135deg, var(--disney-pink), var(--disney-purple));
		color: white;
		padding: 0.4rem 0.8rem;
		border-radius: 20px;
		font-weight: 700;
		font-size: 0.85rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		z-index: 5;
		text-transform: uppercase;
		letter-spacing: 0.5px;
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
		margin: 2rem 0;
	}

	.controls {
		display: flex;
		gap: 2rem;
		margin-bottom: 2rem;
		flex-wrap: wrap;
		align-items: flex-start;
	}

	.search-container {
		position: relative;
		flex: 1;
		min-width: 280px;
	}

	.search-icon {
		position: absolute;
		left: 1.2rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--disney-blue);
		font-size: 1.1rem;
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: 1rem 3rem 1rem 3rem;
		border: 3px solid var(--disney-blue);
		border-radius: 50px;
		font-size: 1.1rem;
		font-weight: 600;
		background: white;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(0,0,0,0.1);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--disney-pink);
		box-shadow: 0 6px 16px rgba(255, 105, 180, 0.3);
		transform: translateY(-2px);
	}

	.clear-search {
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		background: var(--disney-pink);
		color: white;
		border: none;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		font-size: 0.9rem;
	}

	.clear-search:hover {
		background: var(--disney-purple);
		transform: translateY(-50%) scale(1.1);
	}

	.filter-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.filter-label {
		font-weight: 700;
		color: var(--disney-blue);
		font-size: 1.1rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.filter-buttons {
		display: flex;
		gap: 0.5rem;
		background: white;
		padding: 0.3rem;
		border-radius: 50px;
		border: 3px solid var(--disney-blue);
		box-shadow: 0 4px 12px rgba(0,0,0,0.1);
	}

	.filter-btn {
		padding: 0.7rem 1.2rem;
		border: none;
		border-radius: 50px;
		background: transparent;
		color: var(--disney-blue);
		font-weight: 700;
		font-size: 0.95rem;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		white-space: nowrap;
	}

	.filter-btn:hover {
		background: rgba(0, 123, 255, 0.1);
		transform: scale(1.05);
	}

	.filter-btn.active {
		background: linear-gradient(135deg, #00d2ff, #3a7bd5);
		color: white;
		box-shadow: 0 4px 12px rgba(0, 210, 255, 0.4);
	}

	.filter-btn i {
		margin-right: 0.4rem;
	}

	.sort-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.sort-label {
		font-weight: 700;
		color: var(--disney-blue);
		font-size: 1.1rem;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.sort-buttons {
		display: flex;
		gap: 0.5rem;
		background: white;
		padding: 0.3rem;
		border-radius: 50px;
		border: 3px solid var(--disney-blue);
		box-shadow: 0 4px 12px rgba(0,0,0,0.1);
	}

	.sort-btn {
		padding: 0.7rem 1.2rem;
		border: none;
		border-radius: 50px;
		background: transparent;
		color: var(--disney-blue);
		font-weight: 700;
		font-size: 0.95rem;
		cursor: pointer;
		transition: all 0.3s ease;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		white-space: nowrap;
	}

	.sort-btn:hover {
		background: rgba(0, 123, 255, 0.1);
		transform: scale(1.05);
	}

	.sort-btn.active {
		background: linear-gradient(135deg, var(--disney-pink), var(--disney-purple));
		color: white;
		box-shadow: 0 4px 12px rgba(255, 105, 180, 0.4);
	}

	.sort-btn i {
		margin-right: 0.4rem;
	}
</style>