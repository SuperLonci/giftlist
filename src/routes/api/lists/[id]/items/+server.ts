import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params, locals }) => {
    const listId = params.id;
    const userId = locals.userId;

    if (!userId) {
        return json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Verify that the list exists and belongs to the user
    const list = await prisma.list.findUnique({
        where: {
            id: listId
        }
    });

    if (!list) {
        return json({ message: 'List not found' }, { status: 404 });
    }

    // if (list.creatorId !== userId) {
    //     return json(
    //         { message: 'You do not have permission to add items to this list' },
    //         { status: 403 }
    //     );
    // }

    const { name, link, price, currency } = await request.json();

    if (!name) {
        return json({ message: 'Item name is required' }, { status: 400 });
    }

    try {
        const item = await prisma.item.create({
            data: {
                name,
                link,
                price,
                currency,
                listId
            }
        });

        // Update the list's updatedAt timestamp
        await prisma.list.update({
            where: { id: listId },
            data: {
                updatedAt: new Date()
            }
        });

        return json(item);
    } catch (error) {
        console.error('Failed to create item:', error);
        return json({ message: 'Failed to create item' }, { status: 500 });
    }
};
