<script lang="ts">
    import { page } from '$app/state';
    import ItemList from '$lib/components/items/ItemList.svelte';
    import GifterNameModal from '$lib/components/modals/GifterNameModal.svelte';
    import ItemModal from '$lib/components/modals/ItemModal.svelte';
    import type { Item, List } from '@prisma/client';
    import { creatorMode } from '$lib/stores/creatorMode';

    export let data: {
        list: List & {
            items: (Item & {
                gifters: {
                    name: string;
                    id: string;
                    itemId: string
                }[]
            })[]
        }; isCreator: boolean
    };
    $: list = data.list;
    $: isCreator = data.isCreator;
    $: items = data.list?.items || [];

    // Modal state management
    let showNameModal = false;
    let currentItemId = '';
    let currentActionType: 'take' | 'gift-with-me' = 'take';
    let showAddItemModal = false;

    // Reference to the ItemList component
    let itemListComponent: ItemList;

    // Store the previous state of an item for undo functionality
    let previousItemState: {
        id: string,
        status: string,
        gifters: { name: string, id: string, itemId: string }[]
    } | null = null;

    function handleTakeItem(event: CustomEvent<string>) {
        currentItemId = event.detail;
        currentActionType = 'take';
        showNameModal = true;
    }

    function handleGiftWithMe(event: CustomEvent<string>) {
        currentItemId = event.detail;
        currentActionType = 'gift-with-me';
        showNameModal = true;
    }

    function handleUndoAction(event: CustomEvent<string>) {
        const itemId = event.detail;
        undoItemAction(itemId);
    }

    function handleModalClose() {
        showNameModal = false;
        currentItemId = '';
    }

    function handleModalConfirm(event: CustomEvent<{ gifterName: string, actionType: 'take' | 'gift-with-me' }>) {
        const { gifterName, actionType } = event.detail;

        // Save the current state of the item before modifying it
        const item = items.find(i => i.id === currentItemId);
        if (item) {
            previousItemState = {
                id: item.id,
                status: item.itemStatus,
                gifters: [...item.gifters]
            };
        }

        if (actionType === 'take') {
            markItemAsTaken(currentItemId, gifterName);
        } else {
            markItemAsGiftWithMe(currentItemId, gifterName);
        }

        showNameModal = false;
        currentItemId = '';
    }

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

            // Set this item as the last modified item to show undo button
            if (itemListComponent) {
                itemListComponent.setLastModifiedItem(itemId);
            }
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

            // Set this item as the last modified item to show undo button
            if (itemListComponent) {
                itemListComponent.setLastModifiedItem(itemId);
            }
        } catch (err) {
            console.error('Failed to mark as gift with me:', err);
        }
    }

    async function undoItemAction(itemId: string) {
        if (!previousItemState || previousItemState.id !== itemId) {
            console.error('No previous state available for undo');
            return;
        }

        try {
            const response = await fetch(`/api/lists/${page.params.id}/items/${itemId}/undo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    previousStatus: previousItemState.status,
                    previousGifters: previousItemState.gifters
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to undo action');
            }

            // Update local state
            const updatedItem = await response.json();
            items = items.map(item => item.id === itemId ? updatedItem : item);

            // Clear the last modified item and previous state
            if (itemListComponent) {
                itemListComponent.setLastModifiedItem('');
            }
            previousItemState = null;
        } catch (err) {
            console.error('Failed to undo action:', err);
        }
    }

    function handleAddItem(event: CustomEvent) {
        const newItem = event.detail;
        items = [...items, newItem];
        showAddItemModal = false;
    }

    function handleItemUpdated(event: CustomEvent) {
        const updatedItem = event.detail;

        // Find the current item to preserve its gifters
        const currentItem = items.find(item => item.id === updatedItem.id);

        // Update the item in the items array, preserving the gifters
        if (currentItem) {
            items = items.map(item =>
                item.id === updatedItem.id
                    ? { ...updatedItem, gifters: currentItem.gifters }
                    : item
            );
        }
    }

    async function handleDeleteItem(event: CustomEvent<string>) {
        const itemId = event.detail;

        try {
            const response = await fetch(`/api/lists/${page.params.id}/items/${itemId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete item');
            }

            // Lokalen Zustand aktualisieren
            items = items.filter(item => item.id !== itemId);
        } catch (err) {
            console.error('Failed to delete item:', err);
        }
    }

    let shareLink = '';
    if (typeof window !== 'undefined') {
        shareLink = `${window.location.origin}/lists/${page.params.id}/share`;
    }
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
    <div class="pb-5 border-b border-gray-200 flex items-center justify-between">
        <div class="flex items-center space-x-2">
            <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    {list?.title || 'Wishlist'}
                </h3>
                {#if list?.description}
                    <p class="mt-2 text-sm text-gray-500">{list.description}</p>
                {/if}
            </div>
            {#if $creatorMode}
            <span
                class="flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Creator
            </span>
            {/if}
        </div>
        {#if $creatorMode}
            <!-- Add-Button -->
            <div class="flex items-center space-x-4">
                <button
                    on:click={() => (showAddItemModal = true)}
                    class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Add New Item
                </button>
            </div>
        {/if}
    </div>

    {#if $creatorMode}
        <!-- Creator view -->
        <div class="mt-6">
            <!-- Items list -->
            <ItemList
                {items}
                isCreatorView={true}
                on:itemUpdated={handleItemUpdated}
                on:deleteItem={handleDeleteItem}
                bind:this={itemListComponent}
            />

            <!-- Share section -->
            <div class="mt-6 bg-gray-50 p-4 rounded-lg">
                <h4 class="text-md font-medium text-gray-900 mb-2">Share Your Wishlist</h4>
                <p class="text-sm text-gray-500 mb-3">Share this link with friends and family. They'll be able to see
                    your wishlist and mark items as taken.</p>

                <div class="flex">
                    <input
                        type="text"
                        readonly
                        value={shareLink}
                        class="flex-1 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 focus:outline-none sm:text-sm"
                    />
                    <button
                        type="button"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        on:click={() => {
                            if (typeof window !== 'undefined') {
                                navigator.clipboard.writeText(shareLink);
                            }}
                            }
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    {:else}
        <div class="mt-6">
            <ItemList
                {items}
                isCreatorView={$creatorMode}
                on:takeItem={handleTakeItem}
                on:giftWithMe={handleGiftWithMe}
                on:undoAction={handleUndoAction}
                on:itemUpdated={handleItemUpdated}
                bind:this={itemListComponent}
            />
        </div>
    {/if}

    <!-- Modal for entering gifter name - shown for both take and gift-with-me actions -->
    <GifterNameModal
        show={showNameModal}
        actionType={currentActionType}
        on:close={handleModalClose}
        on:confirm={handleModalConfirm}
    />

    <ItemModal
        show={showAddItemModal}
        listId={page.params.id}
        on:close={() => (showAddItemModal = false)}
        on:itemAdded={handleAddItem}
        on:itemUpdated={handleItemUpdated}
    />
</div>