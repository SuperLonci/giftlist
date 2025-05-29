<script lang="ts">
    import { invalidate } from '$app/navigation';
    import ListModal from '$lib/components/modals/ListModal.svelte';
    import type { List } from '@prisma/client';
    import type { User } from '$lib/server/user';
    import { toasts } from '$lib/stores/toast';

    export let data: { user: User | null } = { user: null };

    let showCreateListModal = false;
    let selectedList: List | null = null;
    let modalMode: 'add' | 'edit' = 'add';

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

    async function handleLogout() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Redirect to home page after successful logout and force a full page reload
                // This ensures that the layout data is refreshed, and the header shows the correct state
                window.location.href = '/';
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    }
</script>

<header class="bg-white shadow-sm">
    <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <!-- Left side: Logo and navigation links -->
            <div class="flex items-center">
                <a href="/" class="flex-shrink-0 flex items-center group cursor-pointer">
                    <div class="mr-2 w-8 h-8 group-hover:opacity-80 transition-opacity">
                        <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <!-- Background Circle -->
                            <circle cx="100" cy="100" r="90" fill="#f3f4f6" />
                            <!-- Gift Box Base -->
                            <rect x="50" y="85" width="100" height="70" rx="5" ry="5" fill="#4f46e5" />
                            <!-- Gift Box Lid -->
                            <rect x="45" y="65" width="110" height="25" rx="5" ry="5" fill="#6366f1" />
                            <!-- Gift Ribbon Vertical -->
                            <rect x="95" y="60" width="10" height="100" fill="#a5b4fc" />
                            <!-- Gift Ribbon Horizontal -->
                            <rect x="45" y="90" width="110" height="10" fill="#a5b4fc" />
                            <!-- Heart (Wishlist Icon) -->
                            <path
                                d="M140,45 C147,35 160,35 167,45 C174,55 174,70 167,80 L140,105 L113,80 C106,70 106,55 113,45 C120,35 133,35 140,45 Z"
                                fill="#ec4899" />
                            <!-- Checklist Items -->
                            <rect x="65" y="115" width="70" height="5" rx="2" ry="2" fill="white" />
                            <rect x="65" y="130" width="50" height="5" rx="2" ry="2" fill="white" />
                            <!-- Check Mark -->
                            <path d="M45,120 L55,130 L70,110" stroke="#34d399" stroke-width="5" fill="none"
                                  stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>
                    <span class="text-xl font-bold text-indigo-600 group-hover:text-indigo-500 transition-colors">Wishlist App</span>
                </a>
                <nav class="ml-6 hidden md:flex space-x-8">
                    <a href="/"
                       class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                        Home
                    </a>
                    <a href="/lists"
                       class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                        My Lists
                    </a>
                    <button
                        on:click={openCreateListModal}
                        class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 bg-transparent">
                        Create List
                    </button>
                </nav>
            </div>

            <!-- Right side: Account settings -->
            <div class="flex items-center">
                {#if data.user}
                    <a href="/profile"
                       class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700">
                        Profile
                    </a>
                    <button
                        on:click={handleLogout}
                        class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700">
                        Logout
                    </button>
                {:else}
                    <a href="/login"
                       class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700">
                        Login
                    </a>
                    <a href="/signup"
                       class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Register
                    </a>
                {/if}
            </div>
        </div>
    </div>
</header>

{#if showCreateListModal}
    <ListModal
        show={showCreateListModal}
        mode={modalMode}
        list={selectedList}
        on:close={handleModalClose}
        on:listSaved={handleListSaved}
    />
{/if}
