<script lang="ts">
    import { creatorMode } from '$lib/stores/creatorMode';
</script>

<header class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex">
                <div class="flex-shrink-0 flex items-center">
                    <a href="/" class="text-xl font-bold text-indigo-600">Wishlist App</a>
                </div>
                <div class="ml-6 hidden md:flex space-x-8">
                    <a href="/"
                       class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                        Home
                    </a>
                    <a href="/lists"
                       class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                        My Lists
                    </a>
                    <a href="/lists/new"
                       class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                        Create List
                    </a>
                </div>
            </div>

            <div class="flex items-center">
                <button
                    on:click={() => creatorMode.update(value => !value)}
                    class="px-2 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {#if $creatorMode}
                        Creator Mode: ON
                    {:else}
                        Creator Mode: OFF
                    {/if}
                </button>
                {#if true}
                    <button class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700">
                        Profile
                    </button>
                    <button class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700">
                        Logout
                    </button>
                {:else}
                    <a href="/login"
                       class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700">
                        Login
                    </a>
                    <a href="/register"
                       class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        Register
                    </a>
                {/if}
            </div>
        </div>
    </div>
</header>