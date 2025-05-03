<script lang="ts">
    import '../app.css';
    import Header from '$lib/components/layout/Header.svelte';
    import Sidebar from '$lib/components/layout/Sidebar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import { onMount } from 'svelte';
    import { auth } from '$lib/stores/auth';

    // Check authentication on mount
    onMount(() => {
        // Initialize auth state from localStorage
        auth.checkAuth();

        // Add an event listener for storage events to sync auth state across tabs
        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === 'authToken' || event.key === 'user') {
                auth.checkAuth();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    });

    // Add auth header to all fetch requests
    if (typeof window !== 'undefined') {
        const originalFetch = window.fetch;
        window.fetch = function(input, init) {
            init = init || {};
            init.headers = init.headers || {};

            // Get the current token from the store
            let token = null;
            const unsubscribe = auth.subscribe(state => {
                token = state.token;
            });
            unsubscribe();

            // Add the Authorization header if we have a token
            if (token) {
                init.headers = {
                    ...init.headers,
                    'Authorization': `Bearer ${token}`
                };
            }

            return originalFetch(input, init);
        };
    }
</script>

<div class="min-h-screen bg-gray-100 flex flex-col">
    <Header />

    <div class="flex-1 flex flex-col md:flex-row">
        <Sidebar />

        <main class="flex-1 p-6">
            <div class="max-w-7xl mx-auto">
                <slot />
            </div>
        </main>
    </div>

    <Footer />
</div>
