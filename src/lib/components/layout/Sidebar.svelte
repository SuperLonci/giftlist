<script lang="ts">
	import { page } from '$app/state';

	// Sidebar can be expanded in future to show user's lists or other navigation
	let isOpen = true;
</script>

<div class="w-64 bg-gray-50 p-4 shadow-sm {isOpen ? '' : 'hidden'}">
	<h3 class="text-lg font-semibold mb-4">Navigation</h3>

	<div class="space-y-2">
		<a href="/" class="block hover:bg-gray-200 p-2 rounded {page.url.pathname === '/' ? 'bg-gray-200' : ''}">
			Home
		</a>
		<a href="/create"
			 class="block hover:bg-gray-200 p-2 rounded {page.url.pathname === '/create' ? 'bg-gray-200' : ''}">
			Create New List
		</a>
	</div>

	<div class="mt-8">
		<h4 class="font-medium mb-2">My Wishlists</h4>
		<!-- This could be populated from an API call in the future -->
	</div>
</div>