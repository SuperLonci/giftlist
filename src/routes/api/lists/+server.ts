import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    const userId = locals.userId; // This would come from your auth system

    if (!userId) {
        return json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, description } = await request.json();

    if (!title) {
        return json({ message: 'Title is required' }, { status: 400 });
    }

    try {
        const userExists = await prisma.user.findFirst({
            where: { name: 'user1' }
        });

        if (!userExists) {
            return json({ message: 'User does not exist' }, { status: 400 });
        }

        const list = await prisma.list.create({
            data: {
                title,
                description: description || null,
                creatorId: userExists.id
            }
        });

        return json(list);
    } catch (error) {
        console.error('Failed to create list:', error);
        return json({ message: 'Failed to create list' }, { status: 500 });
    }
};
