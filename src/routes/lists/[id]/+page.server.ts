import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, cookies }) => {
    const listId = params.id;

    const list = await prisma.list.findUnique({
        where: {
            id: listId
        },
        include: {
            items: {
                include: {
                    gifters: true
                }
            },
            creator: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    if (!list) {
        throw new Error('List not found');
    }

    // Handle case where user is not authenticated
    const isCreator = locals.user ? list.creatorId === locals.user.id : false;

    // If the user is not the creator, add this list to the "shared with me" cookie
    if (!isCreator) {
        // Get existing shared lists from cookie
        const sharedListsCookie = cookies.get('shared_lists') || '[]';
        let sharedLists;
        try {
            sharedLists = JSON.parse(sharedListsCookie);
        } catch (e) {
            // If the cookie is invalid, start with an empty array
            sharedLists = [];
        }

        // Create a simplified list object to store in the cookie
        const sharedListInfo = {
            id: list.id,
            title: list.title,
            creatorName: list.creator?.name || 'Unknown',
            viewedAt: new Date().toISOString()
        };

        // Remove this list if it already exists in the array (to avoid duplicates)
        sharedLists = sharedLists.filter((item: { id: string }) => item.id !== list.id);

        // Add the list to the beginning of the array (most recently viewed first)
        sharedLists.unshift(sharedListInfo);

        // Limit to 10 most recent lists to keep cookie size reasonable
        if (sharedLists.length > 10) {
            sharedLists = sharedLists.slice(0, 10);
        }

        // Save the updated list back to the cookie
        cookies.set('shared_lists', JSON.stringify(sharedLists), {
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            httpOnly: false, // Allow JavaScript access
            sameSite: 'lax'
        });
    }

    return {
        list,
        isCreator
    };
};
