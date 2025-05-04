import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import type { List } from '@prisma/client';

export const load: PageServerLoad = async ({ locals, cookies }) => {
    // Get shared lists from cookie for all users (logged in or not)
    const sharedListsCookie = cookies.get('shared_lists') || '[]';
    let sharedLists;
    try {
        sharedLists = JSON.parse(sharedListsCookie);
    } catch (e) {
        // If the cookie is invalid, use an empty array
        sharedLists = [];
    }

    // If user is logged in, get their created lists
    let myLists: List[] = [];
    if (locals.user) {
        myLists = await prisma.list.findMany({
            where: {
                creatorId: locals.user.id
            },
            include: {
                items: true
            }
        });
    } else {
        // If not logged in and trying to access the lists page directly,
        // redirect to unauthorized page, but only if there are no shared lists
        if (sharedLists.length === 0) {
            throw redirect(302, '/unauthorized');
        }
    }

    return {
        myLists,
        sharedLists
    };
};
