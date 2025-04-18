<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Item, Gifter } from '@prisma/client';
    import TakeOverWarningModal from '$lib/components/modals/TakeOverWarningModal.svelte';
    import ItemModal from '$lib/components/modals/ItemModal.svelte';

    export let item: Item & { gifters: Gifter[] };
    export let isCreatorView;
    export let showUndoButton = false;

    const dispatch = createEventDispatcher();
    let showTakeOverWarning = false;
    let showItemModal = false;

    function handleTakeItem() {
        if (item.itemStatus !== 'AVAILABLE') {
            showTakeOverWarning = true;
        } else {
            dispatch('takeItem', item.id);
        }
    }

    function confirmTakeOver(action: 'cancel' | 'giftTogether' | 'takeOver') {
        showTakeOverWarning = false;
        if (action === 'giftTogether') {
            dispatch('giftWithMe', item.id);
        } else if (action === 'takeOver') {
            dispatch('takeItem', item.id);
        }
    }

    function handleGiftWithMe() {
        dispatch('giftWithMe', item.id);
    }

    function handleUndo() {
        dispatch('undoAction', item.id);
    }

    function handleEdit() {
        showItemModal = true;
    }

    function handleItemSaved(event: CustomEvent) {
        const updatedItem = event.detail;
        dispatch('itemUpdated', updatedItem);
        showItemModal = false;
    }
</script>

<div class="bg-white p-4 rounded-lg shadow mb-4 relative group">
    <div class="flex justify-between">
        <div>
            <h5 class="text-md font-medium text-gray-900 {item.itemStatus === 'TAKEN' && !isCreatorView ? 'line-through text-gray-500' : ''}">
                {item.name}
            </h5>
            {#if item.price}
                <p class="text-sm text-gray-500">${item.price.toFixed(2)}</p>
            {/if}
            {#if item.link}
                <a href={item.link} target="_blank" rel="noopener noreferrer"
                   class="text-sm text-indigo-600 hover:text-indigo-500">
                    View Product →
                </a>
            {/if}

            {#if !isCreatorView }
                {#if item.itemStatus === 'TAKEN'}
                    <div class="mt-1 text-sm text-green-600">
                        {#if item.gifters && item.gifters.length > 0}
                            <span>Taken by: {item.gifters.map(gifter => gifter.name).join(', ')}</span>
                        {:else}
                            <span>Taken</span>
                        {/if}
                    </div>
                {/if}

                {#if item.itemStatus === 'GIFT_WITH_ME'}
                    <div class="mt-1 text-sm text-blue-600">
                        {#if item.gifters && item.gifters.length > 0}
                            <span>Gift with: {item.gifters.map(gifter => gifter.name).join(', ')}</span>
                        {:else}
                            <span>Multiple people gifting</span>
                        {/if}
                    </div>
                {/if}
            {/if}
        </div>

        <div class="flex items-center space-x-2">
            {#if showUndoButton}
                <button
                    on:click={handleUndo}
                    class="px-2 py-2 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200 flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Undo
                </button>
            {/if}

            {#if isCreatorView}
                <button
                    on:click={handleEdit}
                    aria-label="Edit item"
                    class="absolute right-2 bg-gray-100 text-gray-800 rounded-full p-2 hover:bg-gray-200 group-hover:block hidden"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
            {/if}

            {#if !isCreatorView && item.itemStatus !== 'TAKEN'}
                <div class="flex space-x-2">
                    <button
                        on:click={handleTakeItem}
                        class="px-3 py-5 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                    >
                        I'll Get This
                    </button>

                    <button
                        on:click={handleGiftWithMe}
                        class="px-3 py-5 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
                    >
                        Gift Together
                    </button>
                </div>
            {/if}
        </div>
    </div>
</div>

<TakeOverWarningModal
    show={showTakeOverWarning}
    on:cancel={() => confirmTakeOver('cancel')}
    on:giftTogether={() => confirmTakeOver('giftTogether')}
    on:takeOver={() => confirmTakeOver('takeOver')}
/>

<ItemModal
    show={showItemModal}
    mode="edit"
    listId={item.listId}
    {item}
    on:close={() => (showItemModal = false)}
    on:itemSaved={handleItemSaved}
/>