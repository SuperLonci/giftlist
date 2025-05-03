import { json } from '@sveltejs/kit';
import prisma from '$lib/server/prisma';
import { comparePassword, generateToken } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return json({ message: 'Email and password are required' }, { status: 400 });
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // If user doesn't exist or password doesn't match
        if (!user) {
            return json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // Compare the password
        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            return json({ message: 'Invalid email or password' }, { status: 401 });
        }

        // Generate a JWT token
        const token = generateToken(user.id);

        // Return the token and user info (excluding password)
        return json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return json({ message: 'An error occurred during login' }, { status: 500 });
    }
};