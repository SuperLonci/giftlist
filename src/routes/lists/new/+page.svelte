<script lang="ts">
    import { goto } from '$app/navigation';

    let title = '';
    let description = '';
    let isSubmitting = false;
    let error = '';

    async function createList() {
        isSubmitting = true;
        error = '';

        try {
            const response = await fetch('/api/lists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title,
                    description
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to create list');
            }

            const { id } = await response.json();
            goto(`/lists/${id}`);
        } catch (err) {
            if (err instanceof Error) {
                error = err.message;
            } else {
                error = 'An unknown error occurred';
            }
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg p-6">
    <div class="pb-5 border-b border-gray-200">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
            Create New Wishlist
        </h3>
    </div>

    <form on:submit|preventDefault={createList} class="mt-6 space-y-6">
        {#if error}
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        {/if}

        <div>
            <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
            <input
                type="text"
                id="title"
                bind:value={title}
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
        </div>

        <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description (optional)</label>
            <textarea
                id="description"
                bind:value={description}
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
        </div>

        <div class="flex justify-end">
            <button
                type="submit"
                disabled={isSubmitting}
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                {isSubmitting ? 'Creating...' : 'Create Wishlist'}
            </button>
        </div>
    </form>
</div>