<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let item: any;
	export let isCreatorView = false;

	const dispatch = createEventDispatcher();

	let showClaimModal = false;
	let giftWithMeOption = false;
	let name = '';
	let contactInfo = '';

	function toggleClaimModal() {
		showClaimModal = !showClaimModal;
		if (!showClaimModal) {
			// Reset form when closing
			giftWithMeOption = false;
			name = '';
			contactInfo = '';
		}
	}

	function handleClaim() {
		if (!name.trim()) {
			return; // Name is required
		}

		if (giftWithMeOption && !contactInfo.trim()) {
			return; // Contact info is required for "Gift With Me" option
		}

		dispatch('claim', {
			itemId: item.id,
			name,
			isGiftWithMe: giftWithMeOption,
			contactInfo
		});

		showClaimModal = false;
	}
</script>

<div
	class="bg-white shadow-md rounded-lg overflow-hidden {item.status === 'CLAIMED' && !isCreatorView ? 'opacity-50' : ''}">
	{#if item.imageUrl}
		<div class="h-48 overflow-hidden">
			<img
				src={item.imageUrl}
				alt={item.name}
				class="w-full h-full object-cover"
			/>
		</div>
	{:else}
		<div class="h-48 bg-gray-200 flex items-center justify-center">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24"
					 stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
			</svg>
		</div>
	{/if}

	<div class="p-4">
		<h3 class="text-lg font-semibold">{item.name}</h3>
		<p class="text-purple-600 font-bold mt-1">${item.price.toFixed(2)}</p>

		{#if item.link}
			<a
				href={item.link}
				target="_blank"
				rel="noopener noreferrer"
				class="text-blue-500 hover:underline inline-flex items-center mt-2"
			>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
					<path
						d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
					<path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
				</svg>
				View Product
			</a>
		{/if}

		{#if !isCreatorView}
			<div class="mt-4">
				{#if item.status === 'CLAIMED'}
					<div class="bg-gray-100 p-3 rounded-md text-center text-gray-600">
						<p>This item has been claimed by {item.claimedBy}</p>
					</div>
				{:else if item.giftWithMe}
					<div class="bg-yellow-50 p-3 rounded-md">
						<p class="font-medium text-yellow-800">
							{item.claimedBy} wants to gift this together
						</p>
						<p class="text-sm mt-1">Contact: {item.contactInfo}</p>
					</div>
				{:else}
					<button
						on:click={toggleClaimModal}
						class="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
					>
						Select This Gift
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>

{#if showClaimModal}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 max-w-md w-full">
			<h3 class="text-xl font-bold mb-4">Select {item.name}</h3>

			<form on:submit|preventDefault={handleClaim}>
				<div class="mb-4">
					<label for="claimerName" class="block text-gray-700 font-medium mb-2">Your Name*</label>
					<input
						type="text"
						id="claimerName"
						bind:value={name}
						placeholder="Enter your name"
						class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
						required
					/>
				</div>

				<div class="mb-4">
					<label class="flex items-center">
						<input
							type="checkbox"
							bind:checked={giftWithMeOption}
							class="h-5 w-5 text-purple-600"
						/>
						<span class="ml-2 text-gray-700">I want to gift this with someone else</span>
					</label>
				</div>

				{#if giftWithMeOption}
					<div class="mb-4">
						<label for="contactInfo" class="block text-gray-700 font-medium mb-2">Contact Information*</label>
						<input
							type="text"
							id="contactInfo"
							bind:value={contactInfo}
							placeholder="Enter your email or phone number"
							class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
							required
						/>
					</div>
				{/if}

				<div class="flex justify-end space-x-3 mt-6">
					<button
						type="button"
						on:click={toggleClaimModal}
						class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
					>
						Cancel
					</button>

					<button
						type="submit"
						class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
					>
						Confirm Selection
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}