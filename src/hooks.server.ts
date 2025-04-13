import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    // In a real app, you would get the user from a session
    // For this example, we'll use a mock user ID for demonstration

    // Mock user for demonstration (in a real app, this would come from authentication)
    event.locals.userId = 'user1';

    return resolve(event);
};
