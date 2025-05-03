import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // Check if user is authenticated
    if (!locals.userId) {
        // Redirect to login page if not authenticated
        throw redirect(302, '/login');
    }

    // User is authenticated, continue to the page
    return {
        userId: locals.userId
    };
};