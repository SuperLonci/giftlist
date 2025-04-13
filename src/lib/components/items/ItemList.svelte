<script lang="ts">
    import ItemCard from './ItemCard.svelte';
    import type { Item, Gifter } from '@prisma/client';
    import { createEventDispatcher } from 'svelte';

    export let items: (Item & { gifters: Gifter[] })[] = [];
    export let isCreatorView = false;

    const dispatch = createEventDispatcher();

    function handleTakeItem(event: CustomEvent<string>) {
        const itemId = event.detail;
        dispatch('takeItem', itemId);
    }

    function handleGiftWithMe(event: CustomEvent<string>) {
        const itemId = event.detail;
        dispatch('giftWithMe', itemId);
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
                    on:takeItem={handleTakeItem}
                    on:giftWithMe={handleGiftWithMe}
                />
            {/each}
        </div>
    </div>
{/if}