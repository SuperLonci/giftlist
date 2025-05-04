import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals, cookies }) => {
    // Get shared lists from cookie for all users (logged in or not)
    const sharedListsCookie = cookies.get('shared_lists') || '[]';
    let sharedLists;
    try {
        sharedLists = JSON.parse(sharedListsCookie);
    } catch (e) {
        // If the cookie is invalid, use an empty array
        sharedLists = [];
    }

    return {
        user: locals.user,
        sharedLists
    };
};
