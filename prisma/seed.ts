import prisma from '../src/lib/server/prisma';
import bcrypt from 'bcrypt';

// Hash password function
async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

async function seed() {
    console.log('🌱 Seeding fresh data...');

    // Hash passwords for test users
    const hashedPassword1 = await hashPassword('password123');
    const hashedPassword2 = await hashPassword('password456');

    const user1 = await prisma.user.create({
        data: {
            email: 'user1@example.com',
            password: hashedPassword1,
            name: 'user1',
            defaultCurrency: 'EUR'
        }
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'user2@example.com',
            password: hashedPassword2,
            name: 'user2',
            defaultCurrency: 'EUR'
        }
    });

    await prisma.list.create({
        data: {
            title: 'Einkaufsliste',
            description: 'Lebensmittel und mehr',
            creatorId: user1.id,
            items: {
                create: [
                    {
                        name: 'Milch',
                        price: 1.5,
                        currency: 'EUR'
                    },
                    {
                        name: 'Brot',
                        price: 2.0,
                        currency: 'EUR'
                    }
                ]
            }
        }
    });

    await prisma.list.create({
        data: {
            title: 'Wunschliste',
            description: 'Meine Geburtstagswünsche',
            creatorId: user2.id,
            items: {
                create: [
                    {
                        name: 'Buch',
                        price: 15.0,
                        currency: 'EUR'
                    }
                ]
            }
        }
    });
}

async function clearDatabase() {
    console.log('🌱 Clearing existing data...');
    await prisma.$transaction([
        prisma.gifter.deleteMany(),
        prisma.item.deleteMany(),
        prisma.list.deleteMany(),
        prisma.user.deleteMany()
    ]);
}

async function main() {
    await clearDatabase();
    await seed();

    console.log('✅ Seeding complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
