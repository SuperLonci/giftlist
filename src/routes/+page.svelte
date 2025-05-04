<script lang="ts">
    import ListModal from '$lib/components/modals/ListModal.svelte';
    import { toasts } from '$lib/stores/toast';
    import { invalidate } from '$app/navigation';
    import { goto } from '$app/navigation';
    import type { List } from '@prisma/client';
    import type { User } from '$lib/server/user';

    export let data: {
        user: User | null,
        sharedLists: { id: string, title: string, creatorName: string, viewedAt: string }[]
    } = {
        user: null,
        sharedLists: []
    };

    let showCreateListModal = false;
    let selectedList: List | null = null;
    let modalMode: 'add' | 'edit' = 'add';

    $: sharedLists = data.sharedLists || [];

    function openCreateListModal() {
        // Check if user is authenticated
        if (!data.user) {
            // Show toast notification if not authenticated
            toasts.error('Not authorized. Please log in to create a list.', 5000);
            return;
        }

        modalMode = 'add';
        selectedList = null;
        showCreateListModal = true;
    }

    function handleModalClose() {
        showCreateListModal = false;
    }

    async function handleListSaved() {
        // Close the modal
        showCreateListModal = false;

        // Invalidate the app lists data to ensure consistency
        invalidate('app:lists');
    }
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
    <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span class="block">Giftlist</span>
            <span class="block text-indigo-600">Create and share your wishlists</span>
        </h1>
        <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create your wishlists and share them with friends and family. They'll be able to mark items as taken without
            you knowing, making gift-giving a surprise!
        </p>
        <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div class="rounded-md shadow">
                <button
                    on:click={openCreateListModal}
                    class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                    Create a Wishlist
                </button>
            </div>
            <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a href="/lists"
                   class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                    View My Wishlists
                </a>
            </div>
        </div>
    </div>

    {#if sharedLists.length > 0}
        <div class="mt-12">
            <div class="pb-5 border-b border-gray-200">
                <h3 class="text-lg leading-6 font-medium text-gray-900 text-center">
                    Recently Viewed Lists
                </h3>
                <p class="mt-2 text-sm text-gray-500 text-center">
                    Lists you've recently viewed that were created by others.
                </p>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {#each sharedLists as list}
                    <div class="bg-white overflow-hidden shadow rounded-lg">
                        <div class="px-4 py-5 sm:p-6">
                            <h3
                                class="text-lg leading-6 font-medium text-gray-900 truncate cursor-pointer hover:text-indigo-600"
                                on:click={() => goto(`/lists/${list.id}`)}
                            >
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
        </div>
    {/if}
</div>

{#if showCreateListModal}
    <ListModal
        show={showCreateListModal}
        mode={modalMode}
        list={selectedList}
        on:close={handleModalClose}
        on:listSaved={handleListSaved}
    />
{/if}