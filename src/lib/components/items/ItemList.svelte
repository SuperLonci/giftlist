<script lang="ts">
    import ItemCard from './ItemCard.svelte';
    import type { Item, Gifter } from '@prisma/client';
    import { createEventDispatcher } from 'svelte';

    export let items: (Item & { gifters: Gifter[] })[] = [];
    export let isCreatorView;

    const dispatch = createEventDispatcher();

    // Track the most recently modified item
    let lastModifiedItemId: string | null = null;

    function handleTakeItem(event: CustomEvent<string>) {
        const itemId = event.detail;
        // Clear undo state for any previous item
        lastModifiedItemId = null;
        dispatch('takeItem', itemId);
    }

    function handleGiftWithMe(event: CustomEvent<string>) {
        const itemId = event.detail;
        // Clear undo state for any previous item
        lastModifiedItemId = null;
        dispatch('giftWithMe', itemId);
    }

    function handleUndoAction(event: CustomEvent<string>) {
        const itemId = event.detail;
        lastModifiedItemId = null;
        dispatch('undoAction', itemId);
    }

    function handleItemUpdated(event: CustomEvent<Item>) {
        dispatch('itemUpdated', event.detail);
    }

    function handleDeleteItem(event: CustomEvent<string>) {
        const itemId = event.detail;
        dispatch('deleteItem', itemId);
    }

    // This function should be called after the item state is successfully updated
    export function setLastModifiedItem(itemId: string) {
        lastModifiedItemId = itemId;
    }

    // Sort the items only in the non-creator view:
    // 1. First check if item is TAKEN (these always go to the bottom)
    // 2. Then items with gifters (gift-with-me) at the top
    // 3. Regular available items in the middle
    $: displayItems = isCreatorView
        ? items
        : [...items].sort((a, b) => {
            // Taken items always go to the bottom, regardless of other properties
            if (a.itemStatus === 'TAKEN' && b.itemStatus !== 'TAKEN') return 1;
            if (a.itemStatus !== 'TAKEN' && b.itemStatus === 'TAKEN') return -1;

            // For non-taken items, gift items go to the top
            if (a.gifters.length > 0 && b.gifters.length === 0) return -1;
            if (a.gifters.length === 0 && b.gifters.length > 0) return 1;

            // Keep original order for items with same properties
            return 0;
        });

    // Determine if we need dividers - only in non-creator view and if we have both types
    $: hasTakenItems = !isCreatorView && displayItems.some(item => item.itemStatus === 'TAKEN');
    $: hasNonTakenItems = !isCreatorView && displayItems.some(item => item.itemStatus !== 'TAKEN');
    $: needsTakenDivider = !isCreatorView && hasTakenItems && hasNonTakenItems;
</script>

{#if items.length === 0}
    <div class="text-center py-6">
        <p class="text-gray-500">
            {isCreatorView ? 'Your wishlist is empty. Add some items above!' : 'This wishlist is empty.'}
        </p>
    </div>
{:else}
    <div class="mt-6">
        <div class="space-y-4">
            {#each displayItems as item, index}
                {#if needsTakenDivider && index > 0 && displayItems[index - 1].itemStatus !== 'TAKEN' && item.itemStatus === 'TAKEN'}
                    <!-- Divider between taken and non-taken items -->
                    <div class="my-6 border-t-2 border-gray-200"></div>
                {/if}

                <ItemCard
                    {item}
                    {isCreatorView}
                    showUndoButton={lastModifiedItemId === item.id}
                    on:takeItem={handleTakeItem}
                    on:giftWithMe={handleGiftWithMe}
                    on:undoAction={handleUndoAction}
                    on:itemUpdated={handleItemUpdated}
                    on:deleteItem={handleDeleteItem}
                />
            {/each}
        </div>
    </div>
{/if}