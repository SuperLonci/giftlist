import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const wishlist = await prisma.wishList.findUnique({
			where: { id: params.id }
		});

		if (!wishlist) {
			throw error(404, 'Wishlist not found');
		}

		const items = await prisma.wishItem.findMany({
			where: { wishListId: params.id },
			orderBy: { createdAt: 'desc' }
		});

		return {
			wishlist,
			items
		};
	} catch (err) {
		console.error('Error loading wishlist:', err);
		throw error(500, 'Failed to load wishlist');
	}
};
