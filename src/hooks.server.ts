import { RefillingTokenBucket } from '$lib/server/rate-limit';
import {
    validateSessionToken,
    setSessionTokenCookie,
    deleteSessionTokenCookie
} from '$lib/server/session';
import { sequence } from '@sveltejs/kit/hooks';

import type { Handle } from '@sveltejs/kit';

const bucket = new RefillingTokenBucket<string>(100, 1);

const rateLimitHandle: Handle = async ({ event, resolve }) => {
    // Get client IP from X-Forwarded-For or fall-back to a default value
    const clientIP =
        event.request.headers.get('X-Forwarded-For') ||
        event.request.headers.get('CF-Connecting-IP') ||
        event.getClientAddress() ||
        'unknown-ip';

    let cost: number;
    if (event.request.method === 'GET' || event.request.method === 'OPTIONS') {
        cost = 1;
    } else {
        cost = 3;
    }

    // Only apply rate limiting if we have a valid client IP
    if (clientIP !== 'unknown-ip' && !bucket.consume(clientIP, cost)) {
        return new Response('Too many requests', {
            status: 429
        });
    }

    return resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {
    const token = event.cookies.get('session') ?? null;
    if (token === null) {
        event.locals.user = null;
        event.locals.session = null;
        return resolve(event);
    }

    try {
        const { session, user } = await validateSessionToken(token);
        if (session !== null) {
            setSessionTokenCookie(event, token, session.expiresAt);
        } else {
            deleteSessionTokenCookie(event);
        }

        event.locals.session = session;
        event.locals.user = user;
    } catch (error) {
        console.error('Session validation error:', error);
        // If session validation fails, clear the session
        deleteSessionTokenCookie(event);
        event.locals.session = null;
        event.locals.user = null;
    }

    return resolve(event);
};

const trustedOrigins = new Set(
    [
        process.env.TRUSTED_ORIGIN && process.env.TRUSTED_ORIGIN.trim(),
        'http://localhost:5173', // Dev
        'http://localhost:4015'
    ].filter(Boolean)
);

const originCheckHandle: Handle = async ({ event, resolve }) => {
    const origin = event.request.headers.get('origin');
    if (event.request.method === 'POST' && origin && !trustedOrigins.has(origin)) {
        return new Response('Cross-site POST form submissions are forbidden', {
            status: 403
        });
    }
    return resolve(event);
};

export const handle = sequence(rateLimitHandle, originCheckHandle, authHandle);
