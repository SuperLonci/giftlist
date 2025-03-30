<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
	<h1 class="text-6xl font-bold text-gray-800 mb-4">{page.status}</h1>
	<p class="text-2xl text-gray-600 mb-8">{page.error?.message || "Page not found"}</p>

	<a
		href="/"
		class="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition"
	>
		Go back home
	</a>
</div>