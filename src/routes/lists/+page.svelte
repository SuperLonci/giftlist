<script lang="ts">
    import { invalidate } from '$app/navigation';
    import ListGrid from '$lib/components/lists/ListGrid.svelte';
    import ListModal from '$lib/components/modals/ListModal.svelte';
    import DeleteWarningModal from '$lib/components/modals/DeleteWarningModal.svelte';
    import type { Item, List } from '@prisma/client';

    export let data: { lists: (List & { items: Item[] })[] };

    let showListModal = false;
    let showDeleteWarning = false;
    let selectedList: List | null = null;
    let modalMode: 'add' | 'edit' = 'add';
    let deletingListId: string | null = null;

    $: lists = (data.lists || []).map((list) => ({
        ...list,
        items: list.items || []
    }));

    function handleEditList(event: CustomEvent<List>) {
        selectedList = event.detail;
        modalMode = 'edit';
        showListModal = true;
    }

    function handleListUpdated(event: CustomEvent) {
        const updatedList = event.detail;

        // Update the local state
        lists = lists.map(list =>
            list.id === updatedList.id
                ? { ...list, ...updatedList }
                : list
        );

        // Refresh the data from the server
        invalidateData();
    }

    function handleDeleteList(event: CustomEvent<string>) {
        deletingListId = event.detail;
        selectedList = lists.find(l => l.id === event.detail) || null;
        showDeleteWarning = true;
    }

    async function confirmDelete() {
        if (!deletingListId) return;

        try {
            const response = await fetch(`/api/lists/${deletingListId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete list');

            // Remove from local state immediately for better UX
            lists = lists.filter(list => list.id !== deletingListId);

            // Then refresh data from server to ensure consistency
            await invalidate('app:lists');
        } catch (error) {
            console.error('Error deleting list:', error);
            // Optionally show an error message to the user
        } finally {
            // Always reset the deletion state
            showDeleteWarning = false;
            selectedList = null;
            deletingListId = null;
        }
    }

    async function handleListSaved(event: CustomEvent) {
        const savedList = event.detail;

        // Update local state first for immediate feedback
        if (modalMode === 'edit') {
            lists = lists.map(list =>
                list.id === savedList.id ? { ...savedList, items: list.items || [] } : list
            );
        } else {
            // Handle newly created list - ensure it has items property
            const newList = { ...savedList, items: [] };
            lists = [...lists, newList];
        }

        // Refresh data from server
        invalidateData();

        // Close modal
        showListModal = false;
        selectedList = null;
    }

    // Helper function to refresh data
    function invalidateData() {
        invalidate('app:lists');
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
            on:editList={handleEditList}
            on:deleteList={handleDeleteList}
            on:listUpdated={handleListUpdated}
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
    on:listSaved={handleListSaved}
/>

<DeleteWarningModal
    show={showDeleteWarning}
    on:cancel={() => {
        showDeleteWarning = false;
        selectedList = null;
        deletingListId = null;
    }}
    on:confirmDelete={confirmDelete}
/>