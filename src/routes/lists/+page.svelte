<script lang="ts">
    import ListGrid from '$lib/components/lists/ListGrid.svelte';
    import ListModal from '$lib/components/modals/ListModal.svelte';
    import DeleteWarningModal from '$lib/components/modals/DeleteWarningModal.svelte';
    import type { Item, List } from '@prisma/client';

    export let data: { lists: (List & { items: Item[] })[] };

    let showListModal = false;
    let showDeleteWarning = false;
    let selectedList: List | null = null;
    let modalMode: 'add' | 'edit' = 'add';

    $: lists = (data.lists || []).map((list) => ({
        ...list,
        items: list.items || []
    }));

    function handleEdit(event: CustomEvent<List>) {
        selectedList = event.detail;
        modalMode = 'edit';
        showListModal = true;
    }

    function handleDelete(event: CustomEvent<string>) {
        selectedList = lists.find(l => l.id === event.detail) || null;
        showDeleteWarning = true;
    }

    async function confirmDelete() {
        if (!selectedList) return;

        try {
            const response = await fetch(`/api/lists/${selectedList.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete list');

        } catch (error) {
            console.error('Error deleting list:', error);
        }

        showDeleteWarning = false;
        selectedList = null;
    }
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
    <div class="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
            My Wishlists
        </h3>
        <div class="mt-3 flex sm:mt-0 sm:ml-4">
            <button
                on:click={() => {
                    modalMode = 'add';
                    selectedList = null;
                    showListModal = true;
                }}
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Create New List
            </button>
        </div>
    </div>
    <div class="mt-6">
        <ListGrid
            {lists}
            on:editList={handleEdit}
            on:deleteList={handleDelete}
        />
    </div>
</div>

<ListModal
    show={showListModal}
    mode={modalMode}
    list={selectedList}
    on:close={() => {
        showListModal = false;
        selectedList = null;
    }}
    on:listSaved={(event: CustomEvent) => {
        const updatedList = event.detail;
        lists = lists.map(l => l.id === updatedList.id ? updatedList : l);
        showListModal = false;
        selectedList = null;
    }}
/>

<DeleteWarningModal
    show={showDeleteWarning}
    on:cancel={() => {
        showDeleteWarning = false;
        selectedList = null;
    }}
    on:confirmDelete={confirmDelete}
/>