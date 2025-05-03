import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Define the user type
type User = {
    id: string;
    email: string;
    name: string;
} | null;

// Create a writable store with initial state
function createAuthStore() {
    // Initialize from localStorage if in browser
    const initialToken = browser ? localStorage.getItem('authToken') : null;
    const initialUser =
        browser && localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user') || 'null')
            : null;

    const { subscribe, set, update } = writable<{
        token: string | null;
        user: User;
        isAuthenticated: boolean;
    }>({
        token: initialToken,
        user: initialUser,
        isAuthenticated: !!initialToken
    });

    return {
        subscribe,

        // Login: set token and user info
        login: (token: string, user: User) => {
            if (browser) {
                localStorage.setItem('authToken', token);
                localStorage.setItem('user', JSON.stringify(user));
            }

            set({
                token,
                user,
                isAuthenticated: true
            });
        },

        // Logout: clear token and user info
        logout: () => {
            if (browser) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
            }

            set({
                token: null,
                user: null,
                isAuthenticated: false
            });
        },

        // Check if token exists in localStorage and update store
        checkAuth: () => {
            if (browser) {
                const token = localStorage.getItem('authToken');
                const user = localStorage.getItem('user')
                    ? JSON.parse(localStorage.getItem('user') || 'null')
                    : null;

                set({
                    token,
                    user,
                    isAuthenticated: !!token
                });

                return !!token;
            }
            return false;
        }
    };
}

// Export the store
export const auth = createAuthStore();
