import prisma from '../src/lib/server/prisma';

async function seed() {
    console.log('🌱 Seeding fresh data...');

    // Create users
    const user1 = await prisma.user.create({
        data: {
            email: 'user1@example.com',
            password: 'password123',
            name: 'user1',
            defaultCurrency: 'EUR'
        }
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'user2@example.com',
            password: 'password456',
            name: 'user2',
            defaultCurrency: 'EUR'
        }
    });

    // Create a session for user1
    await prisma.session.create({
        data: {
            id: 'test-session-1',
            userId: user1.id,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        }
    });

    // Create lists with items and gifters
    const firstList = await prisma.list.create({
        data: {
            title: 'Einkaufsliste',
            description: 'Lebensmittel und mehr',
            creatorId: user1.id,
            items: {
                create: [
                    {
                        name: 'Milch',
                        price: 1.5,
                        currency: 'EUR',
                        itemStatus: 'AVAILABLE'
                    },
                    {
                        name: 'Brot',
                        price: 2.0,
                        currency: 'EUR',
                        itemStatus: 'AVAILABLE'
                    }
                ]
            }
        },
        include: {
            items: true
        }
    });

    const secondList = await prisma.list.create({
        data: {
            title: 'Wunschliste',
            description: 'Meine Geburtstagswünsche',
            creatorId: user2.id,
            items: {
                create: [
                    {
                        name: 'Buch',
                        price: 15.0,
                        currency: 'EUR',
                        itemStatus: 'AVAILABLE'
                    },
                    {
                        name: 'Spielzeug',
                        description: 'Ein cooles Spielzeug',
                        price: 25.0,
                        currency: 'EUR',
                        itemStatus: 'TAKEN'
                    }
                ]
            }
        },
        include: {
            items: true
        }
    });

    // Add gifters to some items
    await prisma.gifter.create({
        data: {
            name: 'Maria',
            itemId: secondList.items[1].id // For 'Spielzeug'
        }
    });

    console.log('✅ Seed data created successfully');
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
