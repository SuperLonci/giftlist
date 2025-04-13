<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Item, Gifter } from '@prisma/client';

    export let item: Item & { gifters: Gifter[] };
    export let isCreatorView = false;

    const dispatch = createEventDispatcher();
    let showTakeOverWarning = false;

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
</script>

<div class="bg-white p-4 rounded-lg shadow mb-4">
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
        </div>

        {#if !isCreatorView && item.itemStatus !== 'TAKEN'}
            <div class="flex space-x-2">
                <button
                    on:click={handleTakeItem}
                    class="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                >
                    I'll Get This
                </button>

                <button
                    on:click={handleGiftWithMe}
                    class="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
                >
                    Gift Together
                </button>
            </div>
        {/if}
    </div>
</div>

{#if showTakeOverWarning}
    <div class="mt-4 p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p class="text-sm text-yellow-800">Are you sure you want to take over this item? This will remove all current
            gifters from the "Gift Together" list.</p>
        <div class="flex space-x-2 mt-2">
            <button
                on:click={() => confirmTakeOver('cancel')}
                class="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200"
            >
                Cancel
            </button>
            <button
                on:click={() => confirmTakeOver('giftTogether')}
                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
            >
                Gift Together Instead
            </button>
            <button
                on:click={() => confirmTakeOver('takeOver')}
                class="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
            >
                Take Over Anyway
            </button>
        </div>
    </div>
{/if}