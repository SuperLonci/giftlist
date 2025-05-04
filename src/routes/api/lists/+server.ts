import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';
import { requireAuth } from '$lib/server/auth';

export const GET: RequestHandler = async (event) => {
    // Ensure user is authenticated
    const user = requireAuth(event);

    // Parse query parameters
    const url = event.url;
    const limit = url.searchParams.get('limit')
        ? parseInt(url.searchParams.get('limit') || '10')
        : 10;
    const sort = url.searchParams.get('sort') || 'updatedAt';
    const order = url.searchParams.get('order') || 'desc';

    try {
        // Query for lists using the authenticated user's ID
        const lists = await prisma.list.findMany({
            where: {
                creatorId: user.id
            },
            orderBy: {
                [sort]: order === 'desc' ? 'desc' : 'asc'
            },
            take: limit,
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return json(lists);
    } catch (error) {
        console.error('Failed to fetch lists:', error);
        return json({ message: 'Failed to fetch lists' }, { status: 500 });
    }
};

export const POST: RequestHandler = async (event) => {
    // Ensure user is authenticated
    const user = requireAuth(event);

    const { title, description } = await event.request.json();

    if (!title) {
        return json({ message: 'Title is required' }, { status: 400 });
    }

    try {
        // Use the authenticated user's ID
        const list = await prisma.list.create({
            data: {
                title,
                description: description || null,
                creatorId: user.id
            }
        });

        return json(list);
    } catch (error) {
        console.error('Failed to create list:', error);
        return json({ message: 'Failed to create list' }, { status: 500 });
    }
};
