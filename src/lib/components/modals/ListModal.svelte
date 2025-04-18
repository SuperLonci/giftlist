<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { List } from '@prisma/client';

    export let show = false;
    export let mode: 'add' | 'edit' = 'add';
    export let list: List | null = null;

    const dispatch = createEventDispatcher();
    let isProcessing = false;
    let error = '';
    let title = list?.title ?? '';
    let description = list?.description ?? '';

    async function handleSubmit() {
        isProcessing = true;
        error = '';

        try {
            const endpoint = mode === 'add' ? '/api/lists' : `/api/lists/${list?.id}`;
            const method = mode === 'add' ? 'POST' : 'PATCH';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message);
            }

            const savedList = await response.json();
            dispatch('listSaved', savedList);
            dispatch('close');
        } catch (err) {
            error = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
        } finally {
            isProcessing = false;
        }
    }

    function closeModal() {
        dispatch('close');
    }
</script>

{#if show}
    <div class="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
                {mode === 'add' ? 'Neue Liste erstellen' : 'Liste bearbeiten'}
            </h3>

            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                {#if error}
                    <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                {/if}

                <div>
                    <label for="title" class="block text-sm font-medium text-gray-700">Titel</label>
                    <input
                        type="text"
                        id="title"
                        bind:value={title}
                        required
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label for="description" class="block text-sm font-medium text-gray-700">Beschreibung
                        (optional)</label>
                    <textarea
                        id="description"
                        bind:value={description}
                        rows="3"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                </div>

                <div class="flex justify-end space-x-3">
                    <button
                        type="button"
                        on:click={closeModal}
                        class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
                    >
                        Abbrechen
                    </button>
                    <button
                        type="submit"
                        disabled={isProcessing}
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {isProcessing ? 'Wird gespeichert...' : (mode === 'add' ? 'Erstellen' : 'Speichern')}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}