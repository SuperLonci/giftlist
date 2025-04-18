import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ request, params, locals }) => {
    const listId = params.id;
    const itemId = params.itemId;
    const userId = locals.userId;
    const { name, link, price } = await request.json(); // Item ID aus dem Request-Body

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

    if (!name) {
        return json({ message: 'Item name is required' }, { status: 400 });
    }

    try {
        const updatedItem = await prisma.item.update({
            where: { id: itemId },
            data: {
                name,
                link,
                price
            }
        });

        return json(updatedItem);
    } catch (error) {
        console.error('Failed to update item:', error);
        return json({ message: 'Failed to update item' }, { status: 500 });
    }
};
