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
		const updatedItem = await prisma.item.update({
			where: {
				id: itemId
			},
			data: {
				isTaken: true,
				giftWithMe: false, // If someone takes it completely, it's no longer "gift with me"
				gifterNames: ''
			}
		});

		return json(updatedItem);
	} catch (error) {
		console.error('Failed to mark item as taken:', error);
		return json({ message: 'Failed to mark item as taken' }, { status: 500 });
	}
};
