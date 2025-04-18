import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
    const userId = locals.userId;
    if (!userId) {
        return json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, description } = await request.json();
    if (!title) {
        return json({ message: 'Title is required' }, { status: 400 });
    }

    try {
        const list = await prisma.list.update({
            where: { id: params.id },
            data: { title, description }
        });
        return json(list);
    } catch (error) {
        return json({ message: 'Failed to update list' }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
    const userId = locals.userId;
    if (!userId) {
        return json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await prisma.list.delete({
            where: { id: params.id }
        });
        return json({ success: true });
    } catch (error) {
        return json({ message: 'Failed to delete list' }, { status: 500 });
    }
};
