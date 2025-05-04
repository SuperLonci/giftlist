import { json } from '@sveltejs/kit';
import { invalidateSession } from '$lib/server/session';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals, cookies }) => {
    // If there's no session, return success immediately
    if (!locals.session) {
        return json({ success: true });
    }

    // Invalidate the session in the database
    await invalidateSession(locals.session.id);
    
    // Clear the session cookie
    cookies.set('session', '', {
        httpOnly: true,
        path: '/',
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        maxAge: 0
    });

    return json({ success: true });
};