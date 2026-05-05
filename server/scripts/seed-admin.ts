import { PrismaClient, AdminRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function seedAdmin() {
    const email = process.env.ADMIN_USER_EMAIL;
    const password = process.env.ADMIN_USER_PASSWORD;
    const username = 'Admin User';

    if (!email || !password) {
        console.error('ADMIN_USER_EMAIL or ADMIN_USER_PASSWORD not defined in .env');
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                passwordHash,
                salt
            },
            create: {
                email,
                username,
                passwordHash,
                salt,
                onboardingCompleted: true
            }
        });

        await prisma.adminRoleAssignment.upsert({
            where: {
                userId_role: {
                    userId: user.id,
                    role: AdminRole.SUPER_ADMIN
                }
            },
            update: {},
            create: {
                userId: user.id,
                role: AdminRole.SUPER_ADMIN,
                assignedBy: 'SYSTEM'
            }
        });

        console.log(`Admin user ${email} created/updated and promoted successfully.`);
        console.log(`Password set to: ${password}`);
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
