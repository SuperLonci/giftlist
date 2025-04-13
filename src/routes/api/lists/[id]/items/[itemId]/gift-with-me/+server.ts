import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';
import { ItemStatus } from '@prisma/client';

export const POST: RequestHandler = async ({ request, params }) => {
    const { id: listId, itemId } = params;

    // Check if the item exists and belongs to the list
    const item = await prisma.item.findUnique({
        where: {
            id: itemId
        },
        include: {
            list: true,
            gifters: true
        }
    });

    if (!item) {
        return json({ message: 'Item not found' }, { status: 404 });
    }

    if (item.list.id !== listId) {
        return json({ message: 'Item does not belong to this list' }, { status: 400 });
    }

    if (item.itemStatus === ItemStatus.TAKEN) {
        return json({ message: 'Item is already taken' }, { status: 400 });
    }

    const { gifterName } = await request.json();

    if (!gifterName) {
        return json({ message: 'Gifter name is required' }, { status: 400 });
    }

    try {
        // Create a new Gifter
        const newGifter = await prisma.gifter.create({
            data: {
                name: gifterName,
                itemId: item.id
            }
        });

        // Update gifters array and item status
        const updatedGifters = [...item.gifters, newGifter];

        const updatedItem = await prisma.item.update({
            where: {
                id: itemId
            },
            data: {
                itemStatus: ItemStatus.GIFT_WITH_ME,
                gifters: {
                    connect: updatedGifters.map((gifter) => ({ id: gifter.id }))
                }
            }
        });

        return json(updatedItem);
    } catch (error) {
        console.error('Failed to mark item as gift with me:', error);
        return json({ message: 'Failed to mark item as gift with me' }, { status: 500 });
    }
};
