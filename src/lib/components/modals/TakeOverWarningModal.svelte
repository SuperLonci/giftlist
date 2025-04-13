<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    export let show = false;

    const dispatch = createEventDispatcher();

    function cancel() {
        dispatch('cancel');
    }

    function giftTogether() {
        dispatch('giftTogether');
    }

    function takeOver() {
        dispatch('takeOver');
    }
</script>

{#if show}
    <div class="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Warnung</h3>
            <p class="text-sm text-gray-500 mb-4">
                Sind Sie sicher, dass Sie dieses Geschenk übernehmen möchten? Dies entfernt alle aktuellen Schenker aus
                der "Gemeinsam schenken"-Liste.
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
                    on:click={giftTogether}
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Gemeinsam schenken
                </button>
                <button
                    type="button"
                    on:click={takeOver}
                    class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Trotzdem übernehmen
                </button>
            </div>
        </div>
    </div>
{/if}