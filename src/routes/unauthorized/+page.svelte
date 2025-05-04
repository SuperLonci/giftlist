<script lang="ts">
    import { goto } from '$app/navigation';

    export let data: { 
        sharedLists: { id: string, title: string, creatorName: string, viewedAt: string }[] 
    };

    $: sharedLists = data.sharedLists || [];
</script>

<div class="flex flex-col items-center justify-center min-h-[60vh] px-4">
    <div class="text-center">
        <h1 class="text-3xl font-bold text-red-700 mb-4">Access Denied</h1>
        <p class="text-xl mb-8">You need to be logged in to access this page.</p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
                class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                on:click={() => goto('/login')}
            >
                Log In
            </button>

            <button
                class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                on:click={() => goto('/')}
            >
                Go to Home
            </button>
        </div>
    </div>

    {#if sharedLists.length > 0}
    <div class="w-full max-w-4xl mx-auto mt-8">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div class="pb-5 border-b border-gray-200">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    Lists Shared With You
                </h3>
                <p class="mt-2 text-sm text-gray-500">
                    You can still view lists that have been shared with you without logging in.
                </p>
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
        </div>
    </div>
    {/if}
</div>
