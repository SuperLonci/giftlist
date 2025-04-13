import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, params }) => {
	const { id: listId, itemId } = params;

	// Check if the item exists and belongs to the list
	const item = await prisma.item.findUnique({
		where: {
			id: itemId
		},
		include: {
			list: true
		}
	});

	if (!item) {
		return json({ message: 'Item not found' }, { status: 404 });
	}

	if (item.list.id !== listId) {
		return json({ message: 'Item does not belong to this list' }, { status: 400 });
	}

	if (item.isTaken) {
		return json({ message: 'Item is already taken' }, { status: 400 });
	}

	const { gifterName } = await request.json();

	if (!gifterName) {
		return json({ message: 'Gifter name is required' }, { status: 400 });
	}

	try {
		// If the item is already in "gift with me" mode, add the new gifter to the array
		const updatedGifterNames = '';
		// const updatedGifterNames = item.giftWithMe
		//     ? [...item.gifterNames, gifterName]
		//     : [gifterName];

		const updatedItem = await prisma.item.update({
			where: {
				id: itemId
			},
			data: {
				giftWithMe: true,
				gifterNames: updatedGifterNames
			}
		});

		return json(updatedItem);
	} catch (error) {
		console.error('Failed to mark item as gift with me:', error);
		return json({ message: 'Failed to mark item as gift with me' }, { status: 500 });
	}
};
