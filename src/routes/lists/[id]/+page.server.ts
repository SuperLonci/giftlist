import prisma from '$lib/server/prisma';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const listId = params.id;
	const userId = locals.userId;

	if (!userId) {
		throw redirect(302, `/lists/${listId}/share`);
	}

	const list = await prisma.list.findUnique({
		where: {
			id: listId
		},
		include: {
			items: true,
			creator: {
				select: {
					id: true,
					name: true
				}
			}
		}
	});

	if (!list) {
		throw new Error('List not found');
	}

	const isCreator = list.creatorId === userId;

	if (!isCreator) {
		throw redirect(302, `/lists/${listId}/share`);
	}

	return {
		list,
		isCreator
	};
};
