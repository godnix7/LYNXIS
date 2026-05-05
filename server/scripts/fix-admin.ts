import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function fix() {
    const email = process.env.ADMIN_USER_EMAIL;
    const password = process.env.ADMIN_USER_PASSWORD;

    if (!email || !password) {
        console.error('ADMIN_USER_EMAIL or ADMIN_USER_PASSWORD not defined in .env');
        return;
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        
        let user = await prisma.user.findUnique({ where: { email } });
        
        if (user) {
            user = await prisma.user.update({
                where: { email },
                data: {
                    passwordHash: hash,
                    onboardingCompleted: true
                }
            });
        } else {
            user = await prisma.user.create({
                data: {
                    id: 'admin-boot-fix',
                    username: 'LynxisAdmin',
                    email,
                    passwordHash: hash,
                    onboardingCompleted: true
                }
            });
        }

        const assignment = await (prisma as any).adminRoleAssignment.findFirst({
            where: { userId: user.id, role: 'SUPER_ADMIN' }
        });

        if (!assignment) {
            await (prisma as any).adminRoleAssignment.create({
                data: {
                    userId: user.id,
                    role: 'SUPER_ADMIN',
                    assignedBy: 'SYSTEM'
                }
            });
        }

        console.log(`Successfully fixed/created ${email} with password from .env`);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
