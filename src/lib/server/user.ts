import { decryptToString, encryptString } from './encryption';
import { hashPassword } from './password';
import { generateRandomRecoveryCode } from './utils';
import prisma from './prisma';

export function verifyUsernameInput(username: string): boolean {
    return username.length > 3 && username.length < 32 && username.trim() === username;
}

export async function createUser(email: string, username: string, password: string): Promise<User> {
    const passwordHash = await hashPassword(password);
    const recoveryCode = generateRandomRecoveryCode();
    const encryptedRecoveryCode = encryptString(recoveryCode);

    const createdUser = await prisma.user.create({
        data: {
            email,
            name: username,
            password: passwordHash,
            recovery_code: encryptedRecoveryCode,
            emailVerified: false
        }
    });

    const user: User = {
        id: createdUser.id,
        username,
        email,
        emailVerified: false
    };

    return user;
}

export async function updateUserPassword(userId: number, password: string): Promise<void> {
    const passwordHash = await hashPassword(password);
    await prisma.user.update({
        where: {
            id: userId.toString()
        },
        data: {
            password: passwordHash
        }
    });
}

export async function updateUserEmailAndSetEmailAsVerified(
    userId: number,
    email: string,
    username?: string
): Promise<void> {
    const data: any = {
        email,
        emailVerified: true
    };

    if (username) {
        data.name = username;
    }

    await prisma.user.update({
        where: {
            id: userId.toString()
        },
        data
    });
}

export async function setUserAsEmailVerifiedIfEmailMatches(
    userId: number,
    email: string
): Promise<boolean> {
    try {
        const result = await prisma.user.updateMany({
            where: {
                id: userId.toString(),
                email
            },
            data: {
                emailVerified: true
            }
        });
        return result.count > 0;
    } catch (error) {
        return false;
    }
}

export async function getUserPasswordHash(userId: string): Promise<string> {
    const user = await prisma.user.findUnique({
        where: {
            id: userId.toString()
        },
        select: {
            password: true
        }
    });

    if (!user) {
        throw new Error('Invalid user ID');
    }

    return user.password;
}

export async function getUserRecoverCode(userId: number): Promise<string> {
    const user = await prisma.user.findUnique({
        where: {
            id: userId.toString()
        },
        select: {
            recovery_code: true
        }
    });

    if (!user || !user.recovery_code) {
        throw new Error('Invalid user ID');
    }

    return decryptToString(user.recovery_code);
}

export async function resetUserRecoveryCode(userId: number): Promise<string> {
    const recoveryCode = generateRandomRecoveryCode();
    const encrypted = encryptString(recoveryCode);

    await prisma.user.update({
        where: {
            id: userId.toString()
        },
        data: {
            recovery_code: encrypted
        }
    });

    return recoveryCode;
}

export async function getUserFromEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return null;
    }

    return {
        id: user.id,
        email: user.email,
        username: user.name,
        emailVerified: user.emailVerified || false
    };
}

export interface User {
    id: string;
    email: string;
    username: string;
    emailVerified: boolean;
}
