import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const listId = params.id;
    const userId = locals.userId;

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

    const isCreator = userId ? list.creatorId === userId : false;

    return {
        list,
        isCreator
    };
};
