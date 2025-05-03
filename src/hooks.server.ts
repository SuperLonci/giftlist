import type { Handle } from '@sveltejs/kit';
import { extractTokenFromHeader, verifyToken } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
    // Get the authorization header from the request
    const authHeader = event.request.headers.get('authorization');

    // Extract the token from the header
    const token = extractTokenFromHeader(authHeader);

    if (token) {
        // Verify the token
        const payload = verifyToken(token);

        if (payload) {
            // Set the user ID in locals
            event.locals.userId = payload.userId;
            event.locals.user = { id: payload.userId };
        }
    }

    return resolve(event);
};
