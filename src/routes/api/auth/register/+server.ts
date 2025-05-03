import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { hashPassword } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, password, name } = await request.json();

        // Validate input
        if (!email || !password || !name) {
            return json({ message: 'Email, password, and name are required' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return json({ message: 'User with this email already exists' }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create the user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name
            }
        });

        // Return success but don't include the password
        return json({
            id: user.id,
            email: user.email,
            name: user.name,
            message: 'Registration successful'
        }, { status: 201 });
    } catch (error) {
        console.error('Registration error:', error);
        return json({ message: 'An error occurred during registration' }, { status: 500 });
    }
};