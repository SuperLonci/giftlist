<script lang="ts">
    import ItemForm from '$lib/components/items/ItemForm.svelte';
    import { createEventDispatcher } from 'svelte';
    import type { Item } from '@prisma/client';

    export let show: boolean = false;
    export let mode: 'add' | 'edit' = 'add';
    export let listId: string;
    export let item: Item | null = null;

    const dispatch = createEventDispatcher();
    let itemFormComponent: ItemForm;

    async function handleSaveItem() {
        if (itemFormComponent) {
            const savedItem = await itemFormComponent.saveItem();
            if (savedItem) {
                if (mode === 'add') {
                    dispatch('itemAdded', savedItem);
                } else {
                    dispatch('itemUpdated', savedItem);
                }
                dispatch('close');
            }
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
                {mode === 'add' ? 'Add New Item' : 'Edit Item'}
            </h3>
            <ItemForm {listId} {mode} {item} bind:this={itemFormComponent} on:itemSaved />
            <div class="mt-4 flex justify-end space-x-3">
                <button
                    on:click={closeModal}
                    class="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none"
                >
                    Cancel
                </button>
                <button
                    on:click={handleSaveItem}
                    disabled={itemFormComponent && (!itemFormComponent.isValid() || itemFormComponent.isProcessing())}
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {itemFormComponent && itemFormComponent.isProcessing()
                        ? (mode === 'add' ? 'Adding...' : 'Saving...')
                        : (mode === 'add' ? 'Add Item' : 'Save Changes')}
                </button>
            </div>
        </div>
    </div>
{/if}