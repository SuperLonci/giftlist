<script lang="ts">
    import ItemCard from './ItemCard.svelte';
    import type { Item, Gifter } from '@prisma/client';
    import { createEventDispatcher } from 'svelte';

    export let items: (Item & { gifters: Gifter[] })[] = [];
    export let isCreatorView = false;

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

    // This function should be called after the item state is successfully updated
    export function setLastModifiedItem(itemId: string) {
        lastModifiedItemId = itemId;
    }
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
            {#each items as item}
                <ItemCard
                    {item}
                    {isCreatorView}
                    showUndoButton={lastModifiedItemId === item.id}
                    on:takeItem={handleTakeItem}
                    on:giftWithMe={handleGiftWithMe}
                    on:undoAction={handleUndoAction}
                />
            {/each}
        </div>
    </div>
{/if}