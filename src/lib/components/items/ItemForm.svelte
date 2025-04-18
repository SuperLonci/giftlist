<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Item } from '@prisma/client';

    export let listId: string;
    export let mode: 'add' | 'edit' = 'add';
    export let item: Item | null = null;

    let name = item ? item.name : '';
    let link = item ? item.link || '' : '';
    let price = item ? (item.price ? item.price.toString() : '') : '';
    let isSubmitting = false;
    let error = '';

    const dispatch = createEventDispatcher();

    export async function saveItem() {
        if (!name) return;

        isSubmitting = true;
        error = '';

        try {
            const priceValue = price ? parseFloat(price) : null;
            const url = mode === 'add'
                ? `/api/lists/${listId}/items`
                : `/api/lists/${listId}/items/${item?.id}`;

            const method = mode === 'add' ? 'POST' : 'PATCH';

            const response = await fetch(url, {
                method,
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
                throw new Error(data.message || 'Failed to save item');
            }

            const savedItem = await response.json();
            dispatch('itemSaved', savedItem);

            // Reset form only in add mode
            if (mode === 'add') {
                name = '';
                link = '';
                price = '';
            }

            isSubmitting = false;
            return savedItem;
        } catch (err) {
            if (err instanceof Error) {
                error = err.message;
            } else {
                error = 'An unknown error occurred';
            }
            isSubmitting = false;
            return null;
        }
    }

    export function isValid() {
        return name.trim() !== '';
    }

    export function isProcessing() {
        return isSubmitting;
    }
</script>

<div class="bg-gray-50 p-4 rounded-lg">
    {#if error}
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
        </div>
    {/if}

    <form on:submit|preventDefault={saveItem} class="space-y-4">
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
    </form>
</div>