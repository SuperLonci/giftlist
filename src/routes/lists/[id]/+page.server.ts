import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const listId = params.id;

    // if (!userId) {
    //     throw redirect(302, `/lists/${listId}/share`);
    // }

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

    // if (!isCreator) {
    //     throw redirect(302, `/lists/${listId}/share`);
    // }

    return {
        list,
        isCreator
    };
};
