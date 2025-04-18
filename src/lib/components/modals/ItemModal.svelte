<script lang="ts">
    import ItemForm from '$lib/components/items/ItemForm.svelte';
    import { createEventDispatcher } from 'svelte';
    import type { Item } from '@prisma/client';

    export let show: boolean = false;
    export let mode: 'add' | 'edit' = 'add';
    export let listId: string;
    export let item: Item | null = null;

    const dispatch = createEventDispatcher();

    function handleItemSaved(event: CustomEvent) {
        dispatch('itemSaved', event.detail);
        dispatch('close');
    }

    function closeModal() {
        dispatch('close');
    }
</script>

{#if show}
    <div class="fixed inset-0 backdrop-blur-xs flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 class="text-lg font-medium text-gray-900 mb-4">
                {mode === 'add' ? 'Add New Item' : 'Edit Item'}
            </h3>
            <ItemForm {listId} {mode} {item} on:itemSaved={handleItemSaved} />
            <button
                on:click={closeModal}
                class="mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
            >
                Cancel
            </button>
        </div>
    </div>
{/if}