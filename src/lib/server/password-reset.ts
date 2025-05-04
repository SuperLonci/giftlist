import { encodeHexLowerCase } from '@oslojs/encoding';
import { generateRandomOTP } from './utils';
import { sha256 } from '@oslojs/crypto/sha2';
import prisma from './prisma';

import type { RequestEvent } from '@sveltejs/kit';
import type { User } from './user';

export async function createPasswordResetSession(
    token: string,
    userId: string,
    email: string
): Promise<PasswordResetSession> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const code = generateRandomOTP();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    await prisma.passwordResetSession.create({
        data: {
            id: sessionId,
            userId: userId.toString(),
            email,
            code,
            expiresAt,
            emailVerified: false
        }
    });

    const session: PasswordResetSession = {
        id: sessionId,
        userId,
        email,
        expiresAt,
        code,
        emailVerified: false
    };

    return session;
}

export async function validatePasswordResetSessionToken(
    token: string
): Promise<PasswordResetSessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const sessionWithUser = await prisma.passwordResetSession.findUnique({
        where: {
            id: sessionId
        },
        include: {
            user: true
        }
    });

    if (!sessionWithUser) {
        return { session: null, user: null };
    }

    const session: PasswordResetSession = {
        id: sessionWithUser.id,
        userId: sessionWithUser.userId,
        email: sessionWithUser.email,
        code: sessionWithUser.code,
        expiresAt: sessionWithUser.expiresAt,
        emailVerified: sessionWithUser.emailVerified
    };

    const user: User = {
        id: sessionWithUser.user.id,
        email: sessionWithUser.user.email,
        username: sessionWithUser.user.name,
        emailVerified: sessionWithUser.user.emailVerified
    };

    if (Date.now() >= session.expiresAt.getTime()) {
        await prisma.passwordResetSession.delete({
            where: {
                id: session.id
            }
        });
        return { session: null, user: null };
    }

    return { session, user };
}

export async function setPasswordResetSessionAsEmailVerified(sessionId: string): Promise<void> {
    await prisma.passwordResetSession.update({
        where: {
            id: sessionId
        },
        data: {
            emailVerified: true
        }
    });
}


export async function invalidateUserPasswordResetSessions(userId: string): Promise<void> {
    await prisma.passwordResetSession.deleteMany({
        where: {
            userId: userId.toString()
        }
    });
}

export async function validatePasswordResetSessionRequest(
    event: RequestEvent
): Promise<PasswordResetSessionValidationResult> {
    const token = event.cookies.get('password_reset_session') ?? null;
    if (token === null) {
        return { session: null, user: null };
    }
    const result = await validatePasswordResetSessionToken(token);
    if (result.session === null) {
        deletePasswordResetSessionTokenCookie(event);
    }
    return result;
}

export function setPasswordResetSessionTokenCookie(
    event: RequestEvent,
    token: string,
    expiresAt: Date
): void {
    event.cookies.set('password_reset_session', token, {
        expires: expiresAt,
        sameSite: 'lax',
        httpOnly: true,
        path: '/',
        secure: !import.meta.env.DEV
    });
}

export function deletePasswordResetSessionTokenCookie(event: RequestEvent): void {
    event.cookies.set('password_reset_session', '', {
        maxAge: 0,
        sameSite: 'lax',
        httpOnly: true,
        path: '/',
        secure: !import.meta.env.DEV
    });
}

export function sendPasswordResetEmail(email: string, code: string): void {
    console.log(`To ${email}: Your reset code is ${code}`);
}

export interface PasswordResetSession {
    id: string;
    userId: string;
    email: string;
    expiresAt: Date;
    code: string;
    emailVerified: boolean;
}

export type PasswordResetSessionValidationResult =
    | { session: PasswordResetSession; user: User }
    | { session: null; user: null };
