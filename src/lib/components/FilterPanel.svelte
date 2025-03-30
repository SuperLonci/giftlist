<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let items: any[] = [];
	export let initialPriceRange = { min: 0, max: 1000 };
	export let initialHideSelected = false;
	export let initialHideGiftWithMe = false;

	const dispatch = createEventDispatcher();

	// Local state
	let priceRange = { ...initialPriceRange };
	let hideSelected = initialHideSelected;
	let hideGiftWithMe = initialHideGiftWithMe;

	// Calculate min and max prices from all items
	let minPrice = 0;
	let maxPrice = 1000;

	$: {
		if (items.length > 0) {
			minPrice = Math.floor(Math.min(...items.map(item => item.price)));
			maxPrice = Math.ceil(Math.max(...items.map(item => item.price)));

			// If initial values are outside bounds, adjust them
			if (priceRange.min < minPrice) priceRange.min = minPrice;
			if (priceRange.max > maxPrice) priceRange.max = maxPrice;
		}
	}

	function applyFilters() {
		dispatch('filter', {
			priceRange,
			hideSelected,
			hideGiftWithMe
		});
	}

	function resetFilters() {
		priceRange = { min: minPrice, max: maxPrice };
		hideSelected = false;
		hideGiftWithMe = false;

		dispatch('filter', {
			priceRange,
			hideSelected,
			hideGiftWithMe
		});
	}

	// Apply filters initially
	$: {
		if (items.length > 0) {
			applyFilters();
		}
	}
</script>

<div class="bg-white shadow-md rounded-lg p-6 sticky top-4">
	<h2 class="text-lg font-semibold mb-4">Filter Options</h2>

	<div class="space-y-6">
		<div>
			<h3 class="font-medium mb-3">Price Range</h3>

			<div class="flex items-center space-x-2 mb-2">
				<span class="text-gray-600">$</span>
				<input
					type="number"
					bind:value={priceRange.min}
					min={minPrice}
					max={priceRange.max}
					on:change={applyFilters}
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
				/>

				<span class="text-gray-600">to</span>

				<input
					type="number"
					bind:value={priceRange.max}
					min={priceRange.min}
					max={maxPrice}
					on:change={applyFilters}
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
				/>
			</div>

			<div class="mt-4">
				<input
					type="range"
					bind:value={priceRange.min}
					min={minPrice}
					max={priceRange.max}
					on:change={applyFilters}
					class="w-full"
				/>

				<input
					type="range"
					bind:value={priceRange.max}
					min={priceRange.min}
					max={maxPrice}
					on:change={applyFilters}
					class="w-full"
				/>
			</div>
		</div>

		<div>
			<h3 class="font-medium mb-3">Status Filters</h3>

			<div class="space-y-2">
				<label class="flex items-center">
					<input
						type="checkbox"
						bind:checked={hideSelected}
						on:change={applyFilters}
						class="h-5 w-5 text-purple-600"
					/>
					<span class="ml-2 text-gray-700">Hide selected items</span>
				</label>

				<label class="flex items-center">
					<input
						type="checkbox"
						bind:checked={hideGiftWithMe}
						on:change={applyFilters}
						class="h-5 w-5 text-purple-600"
					/>
					<span class="ml-2 text-gray-700">Hide "gift with me" items</span>
				</label>
			</div>
		</div>

		<button
			on:click={resetFilters}
			class="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition"
		>
			Reset Filters
		</button>
	</div>
</div>