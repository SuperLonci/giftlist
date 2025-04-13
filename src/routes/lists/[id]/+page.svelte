<script lang="ts">
    import { page } from '$app/stores';
    import type { PageData } from './$types';

    export let data: PageData;

    $: list = data.list;
    $: isCreator = data.isCreator;
    $: items = data.list?.items || [];

    let newItemName = '';
    let newItemLink = '';
    let newItemPrice = '';
    let isAddingItem = false;
    let error = '';

    async function addItem() {
        if (!newItemName) return;

        isAddingItem = true;
        error = '';

        try {
            const price = newItemPrice ? parseFloat(newItemPrice) : null;

            const response = await fetch(`/api/lists/${$page.params.id}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newItemName,
                    link: newItemLink || null,
                    price
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add item');
            }

            // Add the new item to the local items array
            const newItem = await response.json();
            items = [...items, newItem];

            // Reset form
            newItemName = '';
            newItemLink = '';
            newItemPrice = '';
        } catch (err) {
            if (err instanceof Error) {
                error = err.message;
            } else {
                error = 'An unknown error occurred';
            }
        } finally {
            isAddingItem = false;
        }
    }

    async function markItemAsTaken(itemId: string, username: string) {
        try {
            const response = await fetch(`/api/lists/${$page.params.id}/items/${itemId}/take`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gifterName: username
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

    async function markItemAsGiftWithMe(itemId: string, username: string) {
        try {
            const response = await fetch(`/api/lists/${$page.params.id}/items/${itemId}/gift-with-me`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gifterName: username
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

    let gifterName = '';
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
    <div class="pb-5 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
            {list?.title || 'Wishlist'}
        </h3>
        {#if list?.description}
            <p class="mt-2 text-sm text-gray-500">{list.description}</p>
        {/if}
    </div>

    {#if isCreator}
        <!-- Creator view -->
        <div class="mt-6 space-y-6">
            <!-- Add new item form -->
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="text-md font-medium text-gray-900 mb-4">Add New Item</h4>

                {#if error}
                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                {/if}

                <form on:submit|preventDefault={addItem} class="space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Item Name *</label>
                        <input
                            type="text"
                            id="name"
                            bind:value={newItemName}
                            required
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label for="link" class="block text-sm font-medium text-gray-700">Link (optional)</label>
                        <input
                            type="url"
                            id="link"
                            bind:value={newItemLink}
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div>
                        <label for="price" class="block text-sm font-medium text-gray-700">Price (optional)</label>
                        <input
                            type="number"
                            id="price"
                            bind:value={newItemPrice}
                            step="0.01"
                            min="0"
                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div class="flex justify-end">
                        <button
                            type="submit"
                            disabled={isAddingItem || !newItemName}
                            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isAddingItem ? 'Adding...' : 'Add Item'}
                        </button>
                    </div>
                </form>
            </div>

            <!-- Items list -->
            {#if items.length === 0}
                <div class="text-center py-6">
                    <p class="text-gray-500">Your wishlist is empty. Add some items above!</p>
                </div>
            {:else}
                <div class="mt-6">
                    <h4 class="text-md font-medium text-gray-900 mb-4">Your Wishlist Items</h4>
                    <ul class="divide-y divide-gray-200">
                        {#each items as item}
                            <li class="py-4">
                                <div class="flex justify-between">
                                    <div>
                                        <h5 class="text-md font-medium text-gray-900">{item.name}</h5>
                                        {#if item.price}
                                            <p class="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                        {/if}
                                        {#if item.link}
                                            <a href={item.link} target="_blank" rel="noopener noreferrer"
                                               class="text-sm text-indigo-600 hover:text-indigo-500">
                                                View Product →
                                            </a>
                                        {/if}
                                    </div>
                                </div>
                            </li>
                        {/each}
                    </ul>
                </div>
            {/if}

            <!-- Share section -->
            <div class="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 class="text-md font-medium text-gray-900 mb-2">Share Your Wishlist</h4>
                <p class="text-sm text-gray-500 mb-3">Share this link with friends and family. They'll be able to see
                    your wishlist and mark items as taken.</p>

                <div class="flex">
                    <input
                        type="text"
                        readonly
                        value={`${window.location.origin}/lists/${$page.params.id}/share`}
                        class="flex-1 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 focus:outline-none sm:text-sm"
                    />
                    <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        on:click={() => {
              navigator.clipboard.writeText(`${window.location.origin}/lists/${$page.params.id}/share`);
            }}
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    {:else}
        <!-- Viewing someone else's list (gifter view) - this should never be accessed directly,
             but we'll include it here for safety. Users should go to the /share route instead. -->
        <div class="text-center py-12">
            <p class="text-gray-500">You don't have permission to view this page directly.</p>
            <a href={`/lists/${$page.params.id}/share`}
               class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View Shared Wishlist
            </a>
        </div>
    {/if}
</div>