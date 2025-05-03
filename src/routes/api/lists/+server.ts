import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
    const userId = locals.userId; // This would come from your auth system

    // For testing purposes, if no authenticated user, we can still show public lists
    // In production, you might want to require authentication

    // Parse query parameters
    const limit = url.searchParams.get('limit')
        ? parseInt(url.searchParams.get('limit') || '10')
        : 10;
    const sort = url.searchParams.get('sort') || 'updatedAt';
    const order = url.searchParams.get('order') || 'desc';

    try {
        // Check if user is authenticated
        if (!userId) {
            return json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Query for lists
        const lists = await prisma.list.findMany({
            where: {
                creatorId: userId
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
        const list = await prisma.list.create({
            data: {
                title,
                description: description || null,
                creatorId: userId
            }
        });

        return json(list);
    } catch (error) {
        console.error('Failed to create list:', error);
        return json({ message: 'Failed to create list' }, { status: 500 });
    }
};
