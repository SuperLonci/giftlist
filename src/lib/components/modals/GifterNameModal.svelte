<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let show = false;
    export let actionType: 'take' | 'gift-with-me' = 'take';

    let gifterName = '';

    const dispatch = createEventDispatcher();

    function close() {
        gifterName = '';
        dispatch('close');
    }

    function confirm() {
        if (!gifterName) return;

        dispatch('confirm', { gifterName, actionType });
        gifterName = '';
    }
</script>

{#if show}
    <div class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
                {actionType === 'take' ? 'Mark as Taking This Gift' : 'Gift With Others'}
            </h3>

            <p class="text-sm text-gray-500 mb-4">
                {actionType === 'take'
                    ? 'Your name will be visible to others, but not to the wishlist creator.'
                    : 'Add your name to show you want to contribute to this gift.'}
            </p>

            <div class="mb-4">
                <label for="gifterName" class="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                    type="text"
                    id="gifterName"
                    bind:value={gifterName}
                    class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter your name"
                />
            </div>

            <div class="flex justify-end space-x-3">
                <button
                    type="button"
                    on:click={close}
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    on:click={confirm}
                    disabled={!gifterName}
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
{/if}