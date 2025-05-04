import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/auth';

export const PATCH: RequestHandler = async (event) => {
    const listId = event.params.id;
    const itemId = event.params.itemId;
    const { name, link, price, currency } = await event.request.json();

    // Ensure user is authenticated
    const user = requireAuth(event);

    const userId = user.id;

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
                price,
                currency
            }
        });

        // Update the list's updatedAt timestamp
        await prisma.list.update({
            where: { id: listId },
            data: {
                updatedAt: new Date()
            }
        });

        return json(updatedItem);
    } catch (error) {
        console.error('Failed to update item:', error);
        return json({ message: 'Failed to update item' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async (event) => {
    const itemId = event.params.itemId;

    // Ensure user is authenticated
    const user = requireAuth(event);

    const userId = user.id;

    try {
        await prisma.item.delete({
            where: { id: itemId }
        });

        // Update the list's updatedAt field
        await prisma.list.update({
            where: { id: event.params.id },
            data: {
                updatedAt: new Date()
            }
        });

        return json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Failed to delete item:', error);
        return json({ message: 'Failed to delete item' }, { status: 500 });
    }
};
