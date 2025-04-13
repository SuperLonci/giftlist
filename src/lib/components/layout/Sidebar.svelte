<script lang="ts">
    import { page } from '$app/state';

    // fetch these from API
    const recentLists = [
        { id: '1', title: 'Birthday Wishlist' },
        { id: '2', title: 'Christmas Wishlist' },
        { id: '3', title: 'Wedding Registry' }
    ];
</script>

<aside
    class="w-64 md:shadow transform -translate-x-full md:translate-x-0 transition-transform duration-150 ease-in bg-white md:bg-gray-100">
    <div class="p-4 bg-white md:bg-transparent">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>

        <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Recent Lists</h3>
            <ul class="space-y-2">
                {#each recentLists as list}
                    <li>
                        <a
                            href={`/lists/${list.id}`}
                            class="block px-3 py-2 rounded-md text-sm font-medium {page.url.pathname.includes(`/lists/${list.id}`) ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}"
                        >
                            {list.title}
                        </a>
                    </li>
                {/each}
            </ul>
        </div>

        <div>
            <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Actions</h3>
            <ul class="space-y-2">
                <li>
                    <a
                        href="/lists/new"
                        class="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                        Create New List
                    </a>
                </li>
                <li>
                    <a
                        href="/shared-with-me"
                        class="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
                    >
                        Shared With Me
                    </a>
                </li>
            </ul>
        </div>
    </div>
</aside>