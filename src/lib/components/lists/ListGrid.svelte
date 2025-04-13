<script lang="ts">
    import ListCard from './ListCard.svelte';
    import type { Item, List } from '@prisma/client';

    export let lists: (List & { items: Item[] })[] = [];
</script>

{#if lists.length === 0}
    <div class="text-center py-12">
        <p class="text-gray-500">You haven't created any wishlists yet.</p>
        <a href="/lists/new"
           class="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Create Your First Wishlist
        </a>
    </div>
{:else}
    <div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {#each lists as list}
            <ListCard {list} />
        {/each}
    </div>
{/if}