<script lang="ts">
	import { goto } from '$app/navigation';

	let name = '';
	let loading = false;
	let error = '';

	async function createList() {
		if (!name.trim()) {
			error = 'Please enter a name for your wishlist';
			return;
		}

		loading = true;

		try {
			const response = await fetch('/api/wishlists', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ name })
			});

			if (!response.ok) {
				throw new Error('Failed to create wishlist');
			}

			const data = await response.json();
			goto(`/wish/${data.id}`);
		} catch (err) {
			console.error(err);
			error = 'An error occurred while creating your wishlist';
		} finally {
			loading = false;
		}
	}
</script>

<div class="max-w-lg mx-auto">
	<h1 class="text-3xl font-bold mb-6">Create New Wishlist</h1>

	<div class="bg-white shadow-md rounded-lg p-6">
		{#if error}
			<div class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
				<p>{error}</p>
			</div>
		{/if}

		<form on:submit|preventDefault={createList}>
			<div class="mb-4">
				<label for="name" class="block text-gray-700 font-medium mb-2">Wishlist Name</label>
				<input
					type="text"
					id="name"
					bind:value={name}
					placeholder="Enter a name for your wishlist"
					class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
					required
				/>
			</div>

			<button
				type="submit"
				class="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={loading}
			>
				{loading ? 'Creating...' : 'Create Wishlist'}
			</button>
		</form>
	</div>
</div>