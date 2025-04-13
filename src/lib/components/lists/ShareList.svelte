<script lang="ts">
    export let listId: string;
    let copied = false;

    function copyLink() {
        const link = `${window.location.origin}/lists/${listId}/share`;
        navigator.clipboard.writeText(link);
        copied = true;

        setTimeout(() => {
            copied = false;
        }, 2000);
    }
</script>

<div class="mt-6 bg-gray-50 p-4 rounded-lg">
    <h4 class="text-md font-medium text-gray-900 mb-2">Share Your Wishlist</h4>
    <p class="text-sm text-gray-500 mb-3">Share this link with friends and family. They'll be able to see your wishlist
        and mark items as taken.</p>

    <div class="flex">
        <input
            type="text"
            readonly
            value={`${window.location.origin}/lists/${listId}/share`}
            class="flex-1 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 bg-gray-50 text-gray-500 focus:outline-none sm:text-sm"
        />
        <button
            type="button"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            on:click={copyLink}
        >
            {copied ? 'Copied!' : 'Copy'}
        </button>
    </div>
</div>