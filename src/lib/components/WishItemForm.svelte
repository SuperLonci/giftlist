<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let name = '';
	let price = '';
	let link = '';
	let imageUrl = '';
	let error = '';

	function handleSubmit() {
		if (!name.trim()) {
			error = 'Item name is required';
			return;
		}

		if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
			error = 'Valid price is required';
			return;
		}

		dispatch('submit', {
			name,
			price: parseFloat(price),
			link: link || null,
			imageUrl: imageUrl || null
		});

		// Reset form
		name = '';
		price = '';
		link = '';
		imageUrl = '';
		error = '';
	}
</script>

<form on:submit|preventDefault={handleSubmit}>
	{#if error}
		<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
			<p>{error}</p>
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
		<div>
			<label for="name" class="block text-gray-700 font-medium mb-2">Item Name*</label>
			<input
				type="text"
				id="name"
				bind:value={name}
				placeholder="Enter item name"
				class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
				required
			/>
		</div>

		<div>
			<label for="price" class="block text-gray-700 font-medium mb-2">Price*</label>
			<input
				type="number"
				id="price"
				bind:value={price}
				placeholder="Enter price"
				min="0.01"
				step="0.01"
				class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
				required
			/>
		</div>
	</div>

	<div class="mb-4">
		<label for="link" class="block text-gray-700 font-medium mb-2">Link (Optional)</label>
		<input
			type="url"
			id="link"
			bind:value={link}
			placeholder="Enter link to product"
			class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
		/>
	</div>

	<div class="mb-6">
		<label for="imageUrl" class="block text-gray-700 font-medium mb-2">Image URL (Optional)</label>
		<input
			type="url"
			id="imageUrl"
			bind:value={imageUrl}
			placeholder="Enter image URL"
			class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
		/>
	</div>

	<button
		type="submit"
		class="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
	>
		Add Item
	</button>
</form>