<script lang="ts">
    import { enhance } from '$app/forms';

    import type { ActionData, PageData } from '../../../.svelte-kit/types/src/routes';

    export let data: PageData;
    export let form: ActionData;
</script>

<div class="bg-white shadow overflow-hidden sm:rounded-lg max-w-md mx-auto mt-8">
    <div class="px-4 py-5 sm:px-6">
        <h1 class="text-lg leading-6 font-medium text-gray-900">Reset your password</h1>
        <p class="mt-1 text-sm text-gray-500">Create a new password for your account with email {data.email}.</p>
    </div>

    <div class="border-t border-gray-200 px-4 py-5 sm:p-6">
        {#if form?.message}
            <div class="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                             fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clip-rule="evenodd" />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{form.message}</p>
                    </div>
                </div>
            </div>
        {/if}

        <form method="post" use:enhance class="space-y-4">
            <div>
                <label for="form-reset.password" class="block text-sm font-medium text-gray-700">New Password</label>
                <input
                    type="password"
                    id="form-reset.password"
                    name="password"
                    autocomplete="new-password"
                    required
                    minlength="8"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label for="form-reset.confirmPassword" class="block text-sm font-medium text-gray-700">Confirm New
                    Password</label>
                <input
                    type="password"
                    id="form-reset.confirmPassword"
                    name="confirmPassword"
                    autocomplete="new-password"
                    required
                    minlength="8"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div class="pt-2">
                <button
                    type="submit"
                    class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Reset Password
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