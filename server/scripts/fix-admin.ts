import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient({
    datasourceUrl: "postgresql://lynxis_user:lynxis_password@localhost:5432/lynxis_db?schema=public"
});

async function fix() {
    try {
        const hash = await bcrypt.hash('Admin123!', 10);
        
        let user = await prisma.user.findUnique({ where: { email: 'admin@godnix.com' } });
        
        if (user) {
            user = await prisma.user.update({
                where: { email: 'admin@godnix.com' },
                data: {
                    passwordHash: hash,
                    onboardingCompleted: true
                }
            });
        } else {
            user = await prisma.user.create({
                data: {
                    id: 'admin-boot',
                    username: 'LynxisAdmin',
                    email: 'admin@godnix.com',
                    passwordHash: hash,
                    onboardingCompleted: true
                }
            });
        }

        const assignment = await prisma.adminRoleAssignment.findFirst({
            where: { userId: user.id, role: 'SUPER_ADMIN' }
        });

        if (!assignment) {
            await prisma.adminRoleAssignment.create({
                data: {
                    userId: user.id,
                    role: 'SUPER_ADMIN',
                    assignedBy: 'SYSTEM'
                }
            });
        }

        console.log('Successfully fixed/created admin@godnix.com with password Admin123!');
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
