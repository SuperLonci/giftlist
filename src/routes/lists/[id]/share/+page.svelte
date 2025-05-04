<script lang="ts">
    import { page } from '$app/state';
    import type { PageData } from './$types';
    import ItemForm from '$lib/components/items/ItemForm.svelte';
    import ItemList from '$lib/components/items/ItemList.svelte';

    export let data: PageData;

    $: list = data.list;
    $: isCreator = data.isCreator;
    $: items = data.list?.items || [];

    async function handleTakeItem(event: CustomEvent<string>) {
        // You need to collect the gifter's name - this could be done with a modal or prompt
        const gifterName = prompt('Please enter your name:');
        if (gifterName) {
            await markItemAsTaken(event.detail, gifterName);
        }
    }

    async function handleGiftWithMe(event: CustomEvent<string>) {
        // Similar to above
        const gifterName = prompt('Please enter your name:');
        if (gifterName) {
            await markItemAsGiftWithMe(event.detail, gifterName);
        }
    }

    let newItemName = '';
    let newItemLink = '';
    let newItemPrice = '';
    let isAddingItem = false;
    let error = '';

    // async function addItem() {
    //     if (!newItemName) return;
    //
    //     isAddingItem = true;
    //     error = '';
    //
    //     try {
    //         const price = newItemPrice ? parseFloat(newItemPrice) : null;
    //
    //         const response = await fetch(`/api/lists/${$page.params.id}/items`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 name: newItemName,
    //                 link: newItemLink || null,
    //                 price
    //             })
    //         });
    //
    //         if (!response.ok) {
    //             const data = await response.json();
    //             throw new Error(data.message || 'Failed to add item');
    //         }
    //
    //         // Add the new item to the local items array
    //         const newItem = await response.json();
    //         items = [...items, newItem];
    //
    //         // Reset form
    //         newItemName = '';
    //         newItemLink = '';
    //         newItemPrice = '';
    //     } catch (err) {
    //         if (err instanceof Error) {
    //             error = err.message;
    //         } else {
    //             error = 'An unknown error occurred';
    //         }
    //     } finally {
    //         isAddingItem = false;
    //     }
    // }

    async function markItemAsTaken(itemId: string, username: string) {
        try {
            const response = await fetch(`/api/lists/${page.params.id}/items/${itemId}/take`, {
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
            const response = await fetch(`/api/lists/${page.params.id}/items/${itemId}/gift-with-me`, {
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

    function handleItemAdded(event: CustomEvent) {
        const newItem = event.detail;
        items = [...items, newItem];
    }
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
            <ItemForm listId={page.params.id} on:itemAdded={handleItemAdded} />
        </div>
        <div class="mt-6">
            <!-- Items list -->
            <ItemList {items} />

            <!-- Share section -->
            <div class="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 class="text-md font-medium text-gray-900 mb-2">Share Your Wishlist</h4>
                <p class="text-sm text-gray-500 mb-3">Share this link with friends and family. They'll be able to see
                    your wishlist and mark items as taken.</p>

                <div class="flex">
                    <input
                        type="text"
                        readonly
                        value={`${window.location.origin}/lists/${page.params.id}/share`}
                        class="flex-1 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 focus:outline-none sm:text-sm"
                    />
                    <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        on:click={() => {
              navigator.clipboard.writeText(`${window.location.origin}/lists/${page.params.id}/share`);
            }}
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    {:else}
        <!-- Gifter view - for non-creators accessing the list -->
        <div class="mt-6">
            <ItemList 
                {items} 
                isCreatorView={false}
                on:takeItem={handleTakeItem}
                on:giftWithMe={handleGiftWithMe}
            />
        </div>
    {/if}
</div>
