<script lang="ts">
    import '../app.css';
    import Header from '$lib/components/layout/Header.svelte';
    import Sidebar from '$lib/components/layout/Sidebar.svelte';
    import Footer from '$lib/components/layout/Footer.svelte';
    import ToastContainer from '$lib/components/ToastContainer.svelte';

    export let data;
</script>

<div class="min-h-screen bg-gray-100 flex flex-col">
    <Header {data} />

    <div class="flex-1 flex flex-col md:flex-row">
        <Sidebar {data} />

        <main class="flex-1 p-6">
            <div class="max-w-7xl mx-auto">
                <slot />
            </div>
        </main>
    </div>

    <Footer />
    <ToastContainer />
</div>
