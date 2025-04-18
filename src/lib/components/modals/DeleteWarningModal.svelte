<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let show = false;

    const dispatch = createEventDispatcher();

    function cancel() {
        dispatch('cancel');
    }

    function confirmDelete() {
        dispatch('confirmDelete');
    }
</script>

{#if show}
    <div class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Löschen bestätigen</h3>
            <p class="text-sm text-gray-500 mb-4">
                Sind Sie sicher, dass Sie dieses Element löschen möchten? Diese Aktion kann nicht rückgängig gemacht
                werden.
            </p>
            <div class="flex justify-end space-x-3">
                <button
                    type="button"
                    on:click={cancel}
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Abbrechen
                </button>
                <button
                    type="button"
                    on:click={confirmDelete}
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Löschen
                </button>
            </div>
        </div>
    </div>
{/if}