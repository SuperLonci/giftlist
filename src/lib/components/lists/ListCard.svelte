<script lang="ts">
    import type { Item, List } from '@prisma/client';
    import { createEventDispatcher } from 'svelte';
    import { goto } from '$app/navigation';
    import ListModal from '$lib/components/modals/ListModal.svelte';
    import DeleteWarningModal from '$lib/components/modals/DeleteWarningModal.svelte';

    export let list: List & { items: Item[] };

    const dispatch = createEventDispatcher();

    let showListModal = false;
    let showDeleteWarning = false;

    function handleEdit() {
        showListModal = true;
    }

    async function handleDelete() {
        showDeleteWarning = true;
    }

    async function confirmDelete() {
        try {
            const response = await fetch(`/api/lists/${list.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error when deleting the list');
            }

            dispatch('listDeleted', list.id);
        } catch (error) {
            console.error('Error deleting:', error);
        } finally {
            showDeleteWarning = false;
        }
    }

    function navigateToList() {
        goto(`/lists/${list.id}`);
    }
</script>

<div class="bg-white overflow-hidden shadow rounded-lg">
    <div class="p-5">
        <h4
            class="text-lg font-semibold cursor-pointer text-indigo-600 hover:text-indigo-500"
            on:click={navigateToList}>
            {list.title}
        </h4>
        <p class="text-sm text-gray-500">{list.description || 'No Description'}</p>
        <p class="text-sm text-gray-500 mt-2">{list.items.length} items</p>
    </div>
    <div class="bg-gray-50 px-5 py-3 flex justify-between items-center">
        <div class="flex space-x-4">
            <button
                on:click={navigateToList}
                class="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
                View List
            </button>
            <!--            copy link modal instead of routing -->
            <a href="/lists/{list.id}/share" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Share
            </a>
        </div>
        <div class="flex space-x-2">
            <button
                on:click={handleEdit}
                class="px-3 py-2 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200"
            >
                Edit
            </button>
            <button
                on:click={handleDelete}
                class="px-3 py-2 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
            >
                Delete
            </button>
        </div>
    </div>
</div>

<ListModal
    show={showListModal}
    mode="edit"
    list={list}
    on:close={() => (showListModal = false)}
    on:listSaved={(event: CustomEvent) => {
            const updatedList = event.detail;
            dispatch('listUpdated', updatedList);
            showListModal = false;
        }}
/>

<DeleteWarningModal
    show={showDeleteWarning}
    on:cancel={() => (showDeleteWarning = false)}
    on:confirmDelete={confirmDelete}
/>