import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import prisma from './prisma';

import type { User } from './user';
import type { RequestEvent } from '@sveltejs/kit';

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

    const sessionWithUser = await prisma.session.findUnique({
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

    const session: Session = {
        id: sessionWithUser.id,
        userId: sessionWithUser.userId,
        expiresAt: sessionWithUser.expiresAt,
        twoFactorVerified: sessionWithUser.twoFactorVerified || false
    };

    const user: User = {
        id: sessionWithUser.user.id,
        email: sessionWithUser.user.email,
        username: sessionWithUser.user.name,
        emailVerified: sessionWithUser.user.emailVerified || false,
        registered2FA: sessionWithUser.user.totp_key !== null
    };

    if (Date.now() >= session.expiresAt.getTime()) {
        await prisma.session.delete({
            where: {
                id: session.id
            }
        });
        return { session: null, user: null };
    }

    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await prisma.session.update({
            where: {
                id: session.id
            },
            data: {
                expiresAt: session.expiresAt
            }
        });
    }

    return { session, user };
}

export function invalidateSession(sessionId: string): void {
    prisma.session.delete({
        where: {
            id: sessionId
        }
    });
}

export function invalidateUserSessions(userId: number): void {
    prisma.session.deleteMany({
        where: {
            userId: userId.toString()
        }
    });
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
    event.cookies.set('session', token, {
        httpOnly: true,
        path: '/',
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        expires: expiresAt
    });
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
    event.cookies.set('session', '', {
        httpOnly: true,
        path: '/',
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        maxAge: 0
    });
}

export function generateSessionToken(): string {
    const tokenBytes = new Uint8Array(20);
    crypto.getRandomValues(tokenBytes);
    const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
    return token;
}

export function createSession(token: string, userId: string, flags: SessionFlags): Session {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    prisma.session.create({
        data: {
            id: sessionId,
            userId: userId.toString(),
            expiresAt: expiresAt,
            twoFactorVerified: flags.twoFactorVerified
        }
    });

    const session: Session = {
        id: sessionId,
        userId,
        expiresAt,
        twoFactorVerified: flags.twoFactorVerified
    };

    return session;
}

export function setSessionAs2FAVerified(sessionId: string): void {
    prisma.session.update({
        where: {
            id: sessionId
        },
        data: {
            twoFactorVerified: true
        }
    });
}

export interface SessionFlags {
    twoFactorVerified: boolean;
}

export interface Session extends SessionFlags {
    id: string;
    expiresAt: Date;
    userId: string;
}

type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };
