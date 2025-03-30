<script lang="ts">
	import { page } from '$app/state';
	import WishItemForm from '$lib/components/WishItemForm.svelte';
	import WishItemCard from '$lib/components/WishItemCard.svelte';

	export let data;

	let wishlist = data.wishlist;
	let items = data.items;
	let showForm = false;

	function toggleForm() {
		showForm = !showForm;
	}

	async function addItem(event: any) {
		const itemData = event.detail;

		try {
			const response = await fetch(`/api/wishlists/${page.params.id}/items`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(itemData)
			});

			if (!response.ok) {
				throw new Error('Failed to add item');
			}

			const newItem = await response.json();
			items = [...items, newItem];
			showForm = false;
		} catch (error) {
			console.error('Error adding item:', error);
		}
	}

	function copyLinkToClipboard() {
		const giftLink = `${window.location.origin}/gift/${page.params.id}`;
		navigator.clipboard.writeText(giftLink)
			.then(() => {
				alert('Gift link copied to clipboard!');
			})
			.catch(err => {
				console.error('Could not copy text: ', err);
			});
	}
</script>

<div class="max-w-4xl mx-auto">
	<div class="flex justify-between items-center mb-6">
		<h1 class="text-3xl font-bold">Your Wishlist: {wishlist.name}</h1>

		<div class="flex gap-4">
			<button
				class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
				on:click={toggleForm}
			>
				{showForm ? 'Cancel' : 'Add Item'}
			</button>

			<button
				class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition flex items-center gap-2"
				on:click={copyLinkToClipboard}
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
					<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
					<path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
				</svg>
				Copy Gift Link
			</button>
		</div>
	</div>

	{#if showForm}
		<div class="bg-white shadow-md rounded-lg p-6 mb-6">
			<h2 class="text-xl font-semibold mb-4">Add New Item</h2>
			<WishItemForm on:submit={addItem} />
		</div>
	{/if}

	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each items as item (item.id)}
			<WishItemCard {item} isCreatorView={true} />
		{/each}
	</div>

	{#if items.length === 0}
		<div class="bg-white shadow-md rounded-lg p-6 text-center">
			<p class="text-gray-500">No items in your wishlist yet. Add some items to get started!</p>
		</div>
	{/if}
</div>