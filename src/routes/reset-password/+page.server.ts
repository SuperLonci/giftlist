import { fail, redirect } from '@sveltejs/kit';
import {
    validatePasswordResetSessionRequest,
    deletePasswordResetSessionTokenCookie,
    invalidateUserPasswordResetSessions
} from '$lib/server/password-reset';
import { updateUserPassword } from '$lib/server/user';

import type { Actions, RequestEvent } from './$types';

export async function load(event: RequestEvent) {
    const { session, user } = await validatePasswordResetSessionRequest(event);
    if (session === null || user === null) {
        return redirect(302, '/forgot-password');
    }

    if (!session.emailVerified) {
        return redirect(302, '/verify-email');
    }

    return {
        email: session.email
    };
}

export const actions: Actions = {
    default: resetPassword
};

async function resetPassword(event: RequestEvent) {
    const { session, user } = await validatePasswordResetSessionRequest(event);
    if (session === null || user === null) {
        return fail(401, {
            message: 'Not authenticated'
        });
    }

    if (!session.emailVerified) {
        return fail(403, {
            message: 'Email not verified'
        });
    }

    const formData = await event.request.formData();
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (typeof password !== 'string' || typeof confirmPassword !== 'string') {
        return fail(400, {
            message: 'Invalid or missing fields'
        });
    }

    if (password === '') {
        return fail(400, {
            message: 'Enter your new password'
        });
    }

    if (password.length < 8) {
        return fail(400, {
            message: 'Password must be at least 8 characters long'
        });
    }

    if (password !== confirmPassword) {
        return fail(400, {
            message: 'Passwords do not match'
        });
    }

    await updateUserPassword(user.id, password);
    await invalidateUserPasswordResetSessions(user.id);
    deletePasswordResetSessionTokenCookie(event);

    return redirect(302, '/login?passwordReset=true');
}
