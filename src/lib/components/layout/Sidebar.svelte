<script lang="ts">
    import { page } from '$app/state';
    import { onMount } from 'svelte';
    import { invalidate } from '$app/navigation';
    import ListModal from '$lib/components/modals/ListModal.svelte';
    import type { List } from '@prisma/client';
    import { toasts } from '$lib/stores/toast';
    import type { User } from '$lib/server/user';

    export let data: {
        user: User | null,
        sharedLists: { id: string, title: string, creatorName: string, viewedAt: string }[]
    } = {
        user: null,
        sharedLists: []
    };

    let recentLists: List[] = [];
    let showCreateListModal = false;
    let isLoading = true;
    let error = false;
    let selectedList: List | null = null;
    let modalMode: 'add' | 'edit' = 'add';

    $: sharedLists = data.sharedLists || [];

    async function fetchRecentLists() {
        isLoading = true;
        error = false;

        // If user is authenticated, fetch their recent lists
        if (data.user) {
            try {
                const response = await fetch('/api/lists?limit=5&sort=updatedAt&order=desc');
                if (response.ok) {
                    recentLists = await response.json();
                } else {
                    console.error('Failed to fetch lists:', await response.text());
                    error = true;
                }
            } catch (err) {
                console.error('Error fetching recent lists:', err);
                error = true;
            }
        } else {
            // If user is not authenticated, set empty list
            recentLists = [];
        }

        isLoading = false;
    }

    onMount(() => {
        fetchRecentLists();
    });

    function handleModalClose() {
        showCreateListModal = false;
    }

    async function handleListSaved() {
        // Close the modal
        showCreateListModal = false;

        // Refresh the recent lists
        await fetchRecentLists();

        // Also invalidate the app lists data to ensure consistency
        invalidate('app:lists');
    }

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
</script>

<aside class="w-64 md:shadow bg-white md:bg-gray-100 p-4">
    <div class="p-4 bg-white md:bg-transparent">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>

        <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Recent Lists</h3>

            {#if isLoading}
                <div class="py-4 text-gray-500 text-sm">Loading...</div>
            {:else if error}
                <div class="py-2 text-red-500 text-sm">
                    Failed to load recent lists
                    <button
                        class="text-indigo-500 hover:text-indigo-600 ml-2"
                        on:click={fetchRecentLists}
                    >
                        Retry
                    </button>
                </div>
            {:else if recentLists.length === 0 && sharedLists.length === 0}
                <div class="py-2 text-gray-500 text-sm">No lists yet</div>
            {:else}
                <ul class="space-y-2">
                    {#each recentLists as list}
                        <li>
                            <a
                                href={`/lists/${list.id}`}
                                class="block px-3 py-2 rounded-md text-sm font-medium transition-colors {page.url.pathname.includes(`/lists/${list.id}`) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}"
                            >
                                {list.title}
                            </a>
                        </li>
                    {/each}

                    {#each sharedLists as list}
                        <li>
                            <a
                                href={`/lists/${list.id}`}
                                class="block px-3 py-2 rounded-md text-sm font-medium transition-colors {page.url.pathname.includes(`/lists/${list.id}`) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}"
                            >
                                {list.title} <span class="text-xs text-gray-500">(by {list.creatorName})</span>
                            </a>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>

        <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Actions</h3>
            <ul class="space-y-2">
                <li>
                    <button
                        on:click={openCreateListModal}
                        class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                    >
                        Create New List
                    </button>
                </li>
                <li>
                    <a
                        href="/lists"
                        class="block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors {page.url.pathname === '/lists' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'}"
                    >
                        View All Lists
                    </a>
                </li>
            </ul>
        </div>
    </div>
</aside>

{#if showCreateListModal}
    <ListModal
        show={showCreateListModal}
        mode={modalMode}
        list={selectedList}
        on:close={handleModalClose}
        on:listSaved={handleListSaved}
    />
{/if}
