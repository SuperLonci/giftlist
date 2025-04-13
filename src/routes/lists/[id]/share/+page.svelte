<script lang="ts">
    import { page } from '$app/stores';
    import type { PageData } from './$types';

    export let data: PageData;

    $: list = data.list;
    $: isCreator = data.isCreator;
    $: items = list?.items || [];

    let gifterName = '';
    let showGifterInput = false;
    let activeItemId = '';
    let actionType = '';

    function openGifterDialog(itemId: string, action: 'take' | 'gift-with-me') {
        activeItemId = itemId;
        actionType = action;
        showGifterInput = true;
    }

    async function handleAction() {
        if (!gifterName || !activeItemId) return;

        try {
            if (actionType === 'take') {
                await markItemAsTaken(activeItemId, gifterName);
            } else if (actionType === 'gift-with-me') {
                await markItemAsGiftWithMe(activeItemId, gifterName);
            }

            gifterName = '';
            showGifterInput = false;
            activeItemId = '';
        } catch (err) {
            console.error('Failed to perform action:', err);
        }
    }

    async function markItemAsTaken(itemId: string, gifterName: string) {
        try {
            const response = await fetch(`/api/lists/${$page.params.id}/items/${itemId}/take`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gifterName
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to mark item as taken');
            }

            // Update local state
            const updatedItem = await response.json();
            items = items.map(item => item.id === itemId ? updatedItem : item);
        } catch (err) {
            console.error('Failed to mark item as taken:', err);
        }
    }

    async function markItemAsGiftWithMe(itemId: string, gifterName: string) {
        try {
            const response = await fetch(`/api/lists/${$page.params.id}/items/${itemId}/gift-with-me`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gifterName
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to mark as gift with me');
            }

            // Update local state
            const updatedItem = await response.json();
            items = items.map(item => item.id === itemId ? updatedItem : item);
        } catch (err) {
            console.error('Failed to mark as gift with me:', err);
        }
    }
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
    <div class="pb-5 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
            {list?.title || 'Wishlist'}
        </h3>
        {#if list?.creator}
            <p class="mt-1 text-sm text-gray-500">Created by {list.creator.name}</p>
        {/if}
        {#if list?.description}
            <p class="mt-2 text-sm text-gray-500">{list.description}</p>
        {/if}
    </div>

    <!-- Items list for gifters -->
    {#if items.length === 0}
        <div class="text-center py-6">
            <p class="text-gray-500">This wishlist is empty.</p>
        </div>
    {:else}
        <div class="mt-6">
            <h4 class="text-md font-medium text-gray-900 mb-4">Wishlist Items</h4>
            <ul class="divide-y divide-gray-200">
                {#each items as item}
                    <li class="py-4">
                        <div class="flex justify-between">
                            <div>
                                <h5 class="text-md font-medium text-gray-900 {item.isTaken ? 'line-through text-gray-500' : ''}">{item.name}</h5>
                                {#if item.price}
                                    <p class="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                {/if}
                                {#if item.link}
                                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                                       class="text-sm text-indigo-600 hover:text-indigo-500">
                                        View Product →
                                    </a>
                                {/if}

                                {#if item.isTaken}
                                    <div class="mt-1 text-sm text-green-600">
                                        {#if item.gifterNames && item.gifterNames.length > 0}
                                            <span>Taken by: {item.gifterNames.join(', ')}</span>
                                        {:else}
                                            <span>Taken</span>
                                        {/if}
                                    </div>
                                {/if}

                                {#if item.giftWithMe}
                                    <div class="mt-1 text-sm text-blue-600">
                                        {#if item.gifterNames && item.gifterNames.length > 0}
                                            <span>Gift with: {item.gifterNames.join(', ')}</span>
                                        {:else}
                                            <span>Multiple people gifting</span>
                                        {/if}
                                    </div>
                                {/if}
                            </div>

                            {#if !item.isTaken}
                                <div class="flex space-x-2">
                                    <button
                                        on:click={() => openGifterDialog(item.id, 'take')}
                                        class="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                                    >
                                        I'll Get This
                                    </button>

                                    <button
                                        on:click={() => openGifterDialog(item.id, 'gift-with-me')}
                                        class="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
                                    >
                                        Gift With Me
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}

    <!-- Gifter name modal -->
    {#if showGifterInput}
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <h3 class="text-lg font-medium text-gray-900 mb-4">
                    {actionType === 'take' ? 'Mark as Taking This Gift' : 'Gift With Others'}
                </h3>

                <p class="text-sm text-gray-500 mb-4">
                    {actionType === 'take'
                        ? 'Your name will be visible to others, but not to the wishlist creator.'
                        : 'Add your name to show you want to contribute to this gift.'}
                </p>

                <div class="mb-4">
                    <label for="gifterName" class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                        type="text"
                        id="gifterName"
                        bind:value={gifterName}
                        class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter your name"
                    />
                </div>

                <div class="flex justify-end space-x-3">
                    <button
                        type="button"
                        on:click={() => {
              showGifterInput = false;
              gifterName = '';
            }}
                        class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        on:click={handleAction}
                        disabled={!gifterName}
                        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>