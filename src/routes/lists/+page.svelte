<script lang="ts">
    import type { PageData } from './$types';

    export let data: PageData;

    $: lists = data.lists || [];
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

    {#if lists.length === 0}
        <div class="text-center py-12">
            <p class="text-gray-500">You haven't created any wishlists yet.</p>
        </div>
    {:else}
        <div class="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {#each lists as list}
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
                        <a href="/lists/{list.id}/share"
                           class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Share
                        </a>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
