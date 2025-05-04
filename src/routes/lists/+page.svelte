<script lang="ts">
    import { invalidate } from '$app/navigation';
    import ListGrid from '$lib/components/lists/ListGrid.svelte';
    import ListModal from '$lib/components/modals/ListModal.svelte';
    import DeleteWarningModal from '$lib/components/modals/DeleteWarningModal.svelte';
    import type { Item, List } from '@prisma/client';
    import { goto } from '$app/navigation';

    export let data: {
        myLists: (List & { items: Item[] })[],
        sharedLists: { id: string, title: string, creatorName: string, viewedAt: string }[]
    };

    let showListModal = false;
    let showDeleteWarning = false;
    let selectedList: List | null = null;
    let modalMode: 'add' | 'edit' = 'add';
    let deletingListId: string | null = null;

    $: myLists = (data.myLists || []).map((list) => ({
        ...list,
        items: list.items || []
    }));

    $: sharedLists = data.sharedLists || [];

    function handleEditList(event: CustomEvent<List>) {
        selectedList = event.detail;
        modalMode = 'edit';
        showListModal = true;
    }

    function handleListUpdated(event: CustomEvent) {
        const updatedList = event.detail;

        // Update the local state
        myLists = myLists.map(list =>
            list.id === updatedList.id
                ? { ...list, ...updatedList }
                : list
        );

        // Refresh the data from the server
        invalidateData();
    }

    function handleDeleteList(event: CustomEvent<string>) {
        deletingListId = event.detail;
        selectedList = myLists.find(l => l.id === event.detail) || null;
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
            myLists = myLists.filter(list => list.id !== deletingListId);

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
            myLists = myLists.map(list =>
                list.id === savedList.id ? { ...savedList, items: list.items || [] } : list
            );
        } else {
            // Handle newly created list - ensure it has items property
            const newList = { ...savedList, items: [] };
            myLists = [...myLists, newList];
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
    {#if myLists.length > 0}
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
                lists={myLists}
                on:editList={handleEditList}
                on:deleteList={handleDeleteList}
                on:listUpdated={handleListUpdated}
            />
        </div>
    {/if}

    {#if sharedLists.length > 0}
        <div class="mt-8 pb-5 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
                Shared With Me
            </h3>
            <p class="mt-2 text-sm text-gray-500">Lists you've recently viewed that were created by others.</p>
        </div>
        <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {#each sharedLists as list}
                <div class="bg-white overflow-hidden shadow rounded-lg">
                    <div class="px-4 py-5 sm:p-6">
                        <h3 class="text-lg leading-6 font-medium text-gray-900 truncate">
                            {list.title}
                        </h3>
                        <p class="mt-1 text-sm text-gray-500">
                            Created by: {list.creatorName}
                        </p>
                        <p class="mt-1 text-xs text-gray-400">
                            Viewed: {new Date(list.viewedAt).toLocaleString()}
                        </p>
                        <div class="mt-4">
                            <button
                                on:click={() => goto(`/lists/${list.id}`)}
                                class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                View List
                            </button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    {#if myLists.length === 0 && sharedLists.length === 0}
        <div class="text-center py-12">
            <h3 class="text-lg font-medium text-gray-900">No lists found</h3>
            <p class="mt-2 text-sm text-gray-500">
                You haven't created any lists yet, and you haven't viewed any lists shared with you.
            </p>
            <div class="mt-6">
                <button
                    on:click={() => {
                    modalMode = 'add';
                    selectedList = null;
                    showListModal = true;
                }}
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Create Your First List
                </button>
            </div>
        </div>
    {/if}
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
