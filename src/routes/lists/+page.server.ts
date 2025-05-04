import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';
import { requireAuth } from '$lib/server/auth';

export const load: PageServerLoad = async (event) => {
    // Ensure user is authenticated, redirect to unauthorized page if not
    const user = requireAuth(event, '/unauthorized');

    const lists = await prisma.list.findMany({
        where: {
            creatorId: user.id
        },
        include: {
            items: true
        }
    });

    return {
        lists
    };
};
