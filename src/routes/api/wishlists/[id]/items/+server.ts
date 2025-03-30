import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request, params }) => {
	const { name, price, link, imageUrl } = await request.json();

	if (!name || typeof name !== 'string') {
		return json({ error: 'Item name is required' }, { status: 400 });
	}

	if (!price || typeof price !== 'number' || price <= 0) {
		return json({ error: 'Valid price is required' }, { status: 400 });
	}

	try {
		const wishlist = await prisma.wishList.findUnique({
			where: { id: params.id }
		});

		if (!wishlist) {
			return json({ error: 'Wishlist not found' }, { status: 404 });
		}

		const item = await prisma.wishItem.create({
			data: {
				name,
				price,
				link,
				imageUrl,
				wishListId: params.id
			}
		});

		return json(item);
	} catch (error) {
		console.error('Error adding item:', error);
		return json({ error: 'Failed to add item' }, { status: 500 });
	}
};
