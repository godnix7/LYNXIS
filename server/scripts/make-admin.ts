import { PrismaClient, AdminRole } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            console.error(`Error: User with email ${email} not found. Please sign up in the UI first.`);
            process.exit(1);
        }

        const assignment = await prisma.adminRoleAssignment.upsert({
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

        console.log(`Successfully promoted ${email} to SUPER_ADMIN!`);
        console.log(`Assignment ID: ${assignment.id}`);
    } catch (error) {
        console.error('Error promoting user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

const emailArg = process.argv[2];
if (!emailArg) {
    console.log('Usage: npx ts-node scripts/make-admin.ts <email>');
    process.exit(1);
}

makeAdmin(emailArg);
