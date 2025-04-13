<script lang="ts">
    import type { Item, List } from '@prisma/client';

    export let list: List & { items: Item[] };
</script>

<div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
        <h4 class="text-lg font-semibold">{list.title}</h4>
        <p class="text-sm text-gray-500">{list.description || 'No description'}</p>
        <p class="text-sm text-gray-500 mt-2">{list.items.length} items</p>
    </div>
    <div class="bg-gray-50 px-5 py-3 flex justify-between">
        <a href="/lists/{list.id}" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View List
        </a>
        <a href="/lists/{list.id}/share" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            Share
        </a>
    </div>
</div>