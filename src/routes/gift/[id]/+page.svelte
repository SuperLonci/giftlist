<script lang="ts">
	import { page } from '$app/state';
	import WishItemCard from '$lib/components/WishItemCard.svelte';
	import FilterPanel from '$lib/components/FilterPanel.svelte';

	export let data;

	let wishlist = data.wishlist;
	let items: any[] = data.items;
	let filteredItems = [...items];

	// Filter state
	let priceRange = { min: 0, max: 1000 };
	let hideSelected = false;
	let hideGiftWithMe = false;

	function applyFilters(event: any) {
		const {
			priceRange: newPriceRange,
			hideSelected: newHideSelected,
			hideGiftWithMe: newHideGiftWithMe
		} = event.detail;

		priceRange = newPriceRange;
		hideSelected = newHideSelected;
		hideGiftWithMe = newHideGiftWithMe;

		filteredItems = items.filter(item => {
			// Price filter
			if (item.price < priceRange.min || item.price > priceRange.max) {
				return false;
			}

			// Status filters
			if (hideSelected && item.status === 'CLAIMED') {
				return false;
			}

			return !(hideGiftWithMe && item.giftWithMe);


		});
	}

	async function handleItemClaim(event: any) {
		const { itemId, name, isGiftWithMe, contactInfo } = event.detail;

		try {
			const response = await fetch(`/api/wishlists/${page.params.id}/items/${itemId}/claim`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					claimedBy: name,
					giftWithMe: isGiftWithMe,
					contactInfo: contactInfo
				})
			});

			if (!response.ok) {
				throw new Error('Failed to claim item');
			}

			const updatedItem = await response.json();

			// Update the item in our list
			items = items.map(item => item.id === updatedItem.id ? updatedItem : item);

			// Re-apply filters to update the display
			applyFilters({ detail: { priceRange, hideSelected, hideGiftWithMe } });
		} catch (error) {
			console.error('Error claiming item:', error);
			alert('Failed to claim item. Please try again.');
		}
	}
</script>

<div class="max-w-6xl mx-auto">
	<div class="mb-6">
		<h1 class="text-3xl font-bold">{wishlist.name}'s Wishlist</h1>
		<p class="text-gray-600 mt-2">Select a gift from the wishlist below</p>
	</div>

	<div class="flex flex-col md:flex-row gap-6">
		<div class="md:w-1/4">
			<FilterPanel
				{items}
				initialPriceRange={priceRange}
				initialHideSelected={hideSelected}
				initialHideGiftWithMe={hideGiftWithMe}
				on:filter={applyFilters}
			/>
		</div>

		<div class="md:w-3/4">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each filteredItems as item (item.id)}
					<WishItemCard
						{item}
						isCreatorView={false}
						on:claim={handleItemClaim}
					/>
				{/each}
			</div>

			{#if filteredItems.length === 0}
				<div class="bg-white shadow-md rounded-lg p-6 text-center">
					<p class="text-gray-500">No items match your filters. Try adjusting your filter settings.</p>
				</div>
			{/if}
		</div>
	</div>
</div>