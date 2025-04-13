import prisma from '../src/lib/server/prisma';

async function clearDatabase() {
    console.log('🌱 Clearing existing data...');
    await prisma.$transaction([
        prisma.gifter.deleteMany(),
        prisma.item.deleteMany(),
        prisma.list.deleteMany(),
        prisma.user.deleteMany()
    ]);
}

async function seed() {
    console.log('🌱 Seeding fresh data...');

    const user1 = await prisma.user.create({
        data: {
            email: 'user1@example.com',
            password: 'password123',
            name: 'user1'
        }
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'user2@example.com',
            password: 'password456',
            name: 'user2'
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
                        price: 1.5
                    },
                    {
                        name: 'Brot',
                        price: 2.0
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
                        price: 15.0
                    }
                ]
            }
        }
    });
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
