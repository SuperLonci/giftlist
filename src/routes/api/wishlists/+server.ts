import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { prisma } from '$lib/server/prisma';

export const POST: RequestHandler = async ({ request }) => {
	const { name } = await request.json();

	if (!name || typeof name !== 'string') {
		return json({ error: 'Invalid wishlist name' }, { status: 400 });
	}

	try {
		const wishlist = await prisma.wishList.create({
			data: {
				name
			}
		});

		return json(wishlist);
	} catch (error) {
		console.error('Error creating wishlist:', error);
		return json({ error: 'Failed to create wishlist' }, { status: 500 });
	}
};
