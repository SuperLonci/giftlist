<script lang="ts">
    import { page } from '$app/stores';
    import type { ActionData } from './$types';

    export let form: ActionData;

    const passwordReset = $page.url.searchParams.get('passwordReset') === 'true';
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg max-w-md mx-auto mt-8">
    <div class="px-4 py-5 sm:px-6">
        <h1 class="text-lg leading-6 font-medium text-gray-900">Sign in</h1>
        <p class="mt-1 text-sm text-gray-500">Enter your credentials to access your account</p>
    </div>

    <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
        {#if passwordReset}
            <div class="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-green-700">Your password has been successfully reset. You can now sign in with your new password.</p>
                    </div>
                </div>
            </div>
        {/if}

        {#if form?.message}
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{form.message}</p>
                    </div>
                </div>
            </div>
        {/if}

        <form method="post" class="space-y-4">
            <div>
                <label for="form-login.email" class="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="form-login.email"
                    name="email"
                    autocomplete="username"
                    required
                    value={form?.email ?? ""}
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label for="form-login.password" class="block text-sm font-medium text-gray-700">Password</label>
                <input 
                    type="password" 
                    id="form-login.password" 
                    name="password" 
                    autocomplete="current-password" 
                    required 
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div class="flex items-center justify-between">
                <div class="text-sm">
                    <a href="/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
                        Forgot your password?
                    </a>
                </div>
            </div>

            <div class="pt-2">
                <button 
                    type="submit"
                    class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Sign in
                </button>
            </div>
        </form>
    </div>

    <div class="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
        <p class="text-sm text-gray-600">
            Don't have an account? 
            <a href="/signup" class="font-medium text-indigo-600 hover:text-indigo-500">Create an account</a>
        </p>
    </div>
</div>
