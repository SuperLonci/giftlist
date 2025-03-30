import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request, params }) => {
	const { claimedBy, giftWithMe, contactInfo } = await request.json();

	if (!claimedBy || typeof claimedBy !== 'string') {
		return json({ error: 'Name is required' }, { status: 400 });
	}

	try {
		const item = await prisma.wishItem.findUnique({
			where: { id: params.itemId }
		});

		if (!item) {
			return json({ error: 'Item not found' }, { status: 404 });
		}

		if (item.status === 'CLAIMED' && !giftWithMe) {
			return json({ error: 'Item already claimed' }, { status: 400 });
		}

		const updatedItem = await prisma.wishItem.update({
			where: { id: params.itemId },
			data: {
				status: giftWithMe ? 'GIFT_WITH_ME' : 'CLAIMED',
				claimedBy,
				giftWithMe,
				contactInfo: giftWithMe ? contactInfo : null
			}
		});

		return json(updatedItem);
	} catch (error) {
		console.error('Error claiming item:', error);
		return json({ error: 'Failed to claim item' }, { status: 500 });
	}
};
