<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';

    export let message: string;
    export let type: 'success' | 'error' | 'info' | 'warning' = 'info';
    export let duration: number = 3000; // Duration in milliseconds
    export let position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center' = 'top-center';

    const dispatch = createEventDispatcher();
    let visible = true;

    // Auto-close the toast after duration
    onMount(() => {
        const timer = setTimeout(() => {
            close();
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    });

    function close() {
        visible = false;
        dispatch('close');
    }

    // Map type to Tailwind CSS classes
    $: typeClasses = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-700 text-white',
        info: 'bg-blue-500 text-white',
        warning: 'bg-yellow-500 text-white'
    }[type];

    // Map position to CSS classes
    $: positionClasses = {
        'top-right': 'top-4 right-4',
        'top-left': 'top-4 left-4',
        'bottom-right': 'bottom-4 right-4',
        'bottom-left': 'bottom-4 left-4',
        'top-center': 'top-20 left-1/2 transform -translate-x-1/2',
        'bottom-center': 'bottom-20 left-1/2 transform -translate-x-1/2'
    }[position];
</script>

{#if visible}
    <div
        class="fixed z-50 {positionClasses} max-w-sm rounded-md shadow-lg p-4 {typeClasses} transition-opacity duration-300 h-14 flex items-center"
        role="alert"
    >
        <div class="flex items-center justify-between">
            <div class="flex-1 mr-2">
                {message}
            </div>
            <button
                on:click={close}
                class="text-white opacity-70 hover:opacity-100 focus:outline-none"
                aria-label="Close"
            >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    </div>
{/if}
