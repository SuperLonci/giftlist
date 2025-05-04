import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    // Get shared lists from cookie for non-logged-in users
    const sharedListsCookie = cookies.get('shared_lists') || '[]';
    let sharedLists;
    try {
        sharedLists = JSON.parse(sharedListsCookie);
    } catch (e) {
        // If the cookie is invalid, use an empty array
        sharedLists = [];
    }

    return {
        sharedLists
    };
};
