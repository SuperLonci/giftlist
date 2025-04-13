<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let listId: string;

    let name = '';
    let link = '';
    let price = '';
    let isSubmitting = false;
    let error = '';

    const dispatch = createEventDispatcher();

    async function addItem() {
        if (!name) return;

        isSubmitting = true;
        error = '';

        try {
            const priceValue = price ? parseFloat(price) : null;

            const response = await fetch(`/api/lists/${listId}/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    link: link || null,
                    price: priceValue
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to add item');
            }

            const newItem = await response.json();
            dispatch('itemAdded', newItem);

            // Reset form
            name = '';
            link = '';
            price = '';
        } catch (err) {
            if (err instanceof Error) {
                error = err.message;
            } else {
                error = 'An unknown error occurred';
            }
        } finally {
            isSubmitting = false;
        }
    }
</script>

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
                bind:value={name}
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>

        <div>
            <label for="link" class="block text-sm font-medium text-gray-700">Link (optional)</label>
            <input
                type="url"
                id="link"
                bind:value={link}
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>

        <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price (optional)</label>
            <input
                type="number"
                id="price"
                bind:value={price}
                step="0.01"
                min="0"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>

        <div class="flex justify-end">
            <button
                type="submit"
                disabled={isSubmitting || !name}
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                {isSubmitting ? 'Adding...' : 'Add Item'}
            </button>
        </div>
    </form>
</div>