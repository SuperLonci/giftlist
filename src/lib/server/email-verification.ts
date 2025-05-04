import { generateRandomOTP } from './utils';
import { ExpiringTokenBucket } from './rate-limit';
import { encodeBase32 } from '@oslojs/encoding';
import prisma from './prisma';

import type { RequestEvent } from '@sveltejs/kit';

export async function getUserEmailVerificationRequest(
    userId: string,
    id: string
): Promise<EmailVerificationRequest | null> {
    const request = await prisma.emailVerificationRequest.findFirst({
        where: {
            id,
            userId: userId
        }
    });

    if (!request) {
        return null;
    }

    return {
        id: request.id,
        userId: request.userId,
        code: request.code,
        email: request.email,
        expiresAt: request.expiresAt
    };
}

export async function createEmailVerificationRequest(
    userId: string,
    email: string
): Promise<EmailVerificationRequest> {
    await deleteUserEmailVerificationRequest(userId);
    const idBytes = new Uint8Array(20);
    crypto.getRandomValues(idBytes);
    const id = encodeBase32(idBytes).toLowerCase();

    const code = generateRandomOTP();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

    await prisma.emailVerificationRequest.create({
        data: {
            id,
            userId: userId,
            code,
            email,
            expiresAt
        }
    });

    const request: EmailVerificationRequest = {
        id,
        userId,
        code,
        email,
        expiresAt
    };
    return request;
}

export async function deleteUserEmailVerificationRequest(userId: string): Promise<void> {
    await prisma.emailVerificationRequest.deleteMany({
        where: {
            userId: userId.toString()
        }
    });
}

export function sendVerificationEmail(email: string, code: string): void {
    console.log(`To ${email}: Your verification code is ${code}`);
}

export function setEmailVerificationRequestCookie(
    event: RequestEvent,
    request: EmailVerificationRequest
): void {
    event.cookies.set('email_verification', request.id, {
        httpOnly: true,
        path: '/',
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        expires: request.expiresAt
    });
}

export function deleteEmailVerificationRequestCookie(event: RequestEvent): void {
    event.cookies.set('email_verification', '', {
        httpOnly: true,
        path: '/',
        secure: import.meta.env.PROD,
        sameSite: 'lax',
        maxAge: 0
    });
}

export async function getUserEmailVerificationRequestFromRequest(
    event: RequestEvent
): Promise<EmailVerificationRequest | null> {
    if (event.locals.user === null) {
        return null;
    }
    const id = event.cookies.get('email_verification') ?? null;
    if (id === null) {
        return null;
    }
    const request = await getUserEmailVerificationRequest(event.locals.user.id, id);
    if (request === null) {
        deleteEmailVerificationRequestCookie(event);
    }
    return request;
}

export const sendVerificationEmailBucket = new ExpiringTokenBucket<number>(3, 60 * 10);

export interface EmailVerificationRequest {
    id: string;
    userId: string;
    code: string;
    email: string;
    expiresAt: Date;
}
