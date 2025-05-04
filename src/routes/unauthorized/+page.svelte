<script>
  import { goto } from '$app/navigation';
</script>

<div class="flex flex-col items-center justify-center min-h-[60vh] px-4">
  <div class="text-center">
    <h1 class="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
    <p class="text-xl mb-8">You need to be logged in to access this page.</p>
    
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button 
        class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        on:click={() => goto('/login')}
      >
        Log In
      </button>
      
      <button 
        class="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        on:click={() => goto('/')}
      >
        Go to Home
      </button>
    </div>
  </div>
</div>