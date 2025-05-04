<script lang="ts">
    import { enhance } from '$app/forms';

    import type { ActionData } from './$types';

    export let form: ActionData;
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg max-w-md mx-auto mt-8">
    <div class="px-4 py-5 sm:px-6">
        <h1 class="text-lg leading-6 font-medium text-gray-900">Forgot your password?</h1>
        <p class="mt-1 text-sm text-gray-500">Enter your email address and we'll send you a password reset link</p>
    </div>

    <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
        {#if form?.message}
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{form?.message}</p>
                    </div>
                </div>
            </div>
        {/if}

        <form method="post" use:enhance class="space-y-4">
            <div>
                <label for="form-forgot.email" class="block text-sm font-medium text-gray-700">Email</label>
                <input 
                    type="email" 
                    id="form-forgot.email" 
                    name="email" 
                    required 
                    value={form?.email ?? ""} 
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div class="pt-2">
                <button 
                    type="submit"
                    class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Send Reset Link
                </button>
            </div>
        </form>
    </div>

    <div class="bg-gray-50 px-4 py-4 sm:px-6 border-t border-gray-200">
        <p class="text-sm text-gray-600">
            Remember your password? 
            <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">Sign in</a>
        </p>
    </div>
</div>
