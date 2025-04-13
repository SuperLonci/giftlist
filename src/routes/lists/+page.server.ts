import prisma from '$lib/server/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // In a real app, you'd get the user from the session
    // For simplicity, let's assume we have the user's ID
    // const userId = locals.userId; // This would come from your auth system
    //
    // if (!userId) {
    // 	return {
    // 		lists: []
    // 	};
    // }

    const lists = await prisma.list.findMany({
        // where: {
        // 	creatorId: userId
        // },
        include: {
            items: true
        }
    });

    return {
        lists
    };
};
