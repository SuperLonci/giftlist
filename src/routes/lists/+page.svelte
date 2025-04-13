<script lang="ts">
    import ListGrid from '$lib/components/lists/ListGrid.svelte';
    import type { Item, List } from '@prisma/client';

    export let data: { lists: (List & { items: Item[] })[] };

    $: lists = (data.lists || []).map((list) => ({
        ...list,
        items: list.items || []
    }));
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
            My Wishlists
        </h3>
        <div class="mt-3 flex sm:mt-0 sm:ml-4">
            <a href="/lists/new"
               class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create New List
            </a>
        </div>
    </div>

    <div class="mt-6">
        <ListGrid {lists} />
    </div>
</div>