import { PrismaClient, AdminRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

// Load env from the root of server directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function seedUsers() {
    const usersToSeed = [
        {
            email: process.env.ADMIN_USER_EMAIL,
            password: process.env.ADMIN_USER_PASSWORD,
            username: 'System Admin',
            role: AdminRole.SUPER_ADMIN,
            onboardingCompleted: true
        },
        {
            email: process.env.TEST_USER_EMAIL,
            password: process.env.TEST_USER_PASSWORD,
            username: 'Test User',
            role: null,
            onboardingCompleted: true
        }
    ];

    if (!usersToSeed[0].email || !usersToSeed[0].password) {
        console.error('ADMIN_USER_EMAIL or ADMIN_USER_PASSWORD not defined in .env');
        return;
    }

    console.log('--- Starting User Seeding ---');

    for (const u of usersToSeed) {
        try {
            console.log(`Seeding user: ${u.email}...`);
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(u.password, salt);

            const user = await prisma.user.upsert({
                where: { email: u.email },
                update: {
                    passwordHash,
                    salt,
                    onboardingCompleted: u.onboardingCompleted
                },
                create: {
                    email: u.email,
                    username: u.username,
                    passwordHash,
                    salt,
                    onboardingCompleted: u.onboardingCompleted
                }
            });

            if (u.role) {
                await prisma.adminRoleAssignment.upsert({
                    where: {
                        userId_role: {
                            userId: user.id,
                            role: u.role
                        }
                    },
                    update: {},
                    create: {
                        userId: user.id,
                        role: u.role,
                        assignedBy: 'SYSTEM'
                    }
                });
                console.log(`  -> User ${u.email} promoted to ${u.role}`);
            }

            console.log(`  -> User ${u.email} successfully seeded.`);
        } catch (error) {
            console.error(`  !! Failed to seed ${u.email}:`, error);
        }
    }

    console.log('--- Seeding Complete ---');
    await prisma.$disconnect();
}

seedUsers();
