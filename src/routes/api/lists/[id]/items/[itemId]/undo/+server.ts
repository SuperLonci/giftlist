// src/routes/api/lists/[id]/items/[itemId]/undo/+server.ts
import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request }) => {
    const { id: itemId } = params;
    const { previousStatus, previousGifters } = await request.json();

    try {
        // Update the item to its previous status
        await prisma.item.update({
            where: { id: itemId },
            data: {
                itemStatus: previousStatus
            }
        });

        // Delete current gifters
        await prisma.gifter.deleteMany({
            where: { itemId }
        });

        // Re-create previous gifters if there were any
        if (previousGifters && previousGifters.length > 0) {
            const gifterData = previousGifters.map((gifter: any) => ({
                name: gifter.name,
                itemId
            }));

            await prisma.$transaction(
                gifterData.map((data: any) => prisma.gifter.create({ data }))
            );
        }

        // Fetch the updated item with gifters to return
        const updatedItem = await prisma.item.findUnique({
            where: { id: itemId },
            include: {
                gifters: true
            }
        });

        return json(updatedItem);
    } catch (error) {
        console.error('Failed to undo action:', error);
        return json({ message: 'Failed to undo action' }, { status: 500 });
    }
};
