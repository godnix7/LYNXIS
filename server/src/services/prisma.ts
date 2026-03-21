import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

/**
 * Formats Prisma errors into user-friendly messages.
 * Specifically handles connection issues (P1001).
 */
export const handlePrismaError = (error: any) => {
    if (error.code === 'P1001' || error.message?.includes('Can\'t reach database server')) {
        return {
            status: 503,
            message: 'Database unreachable. Please ensure your Docker container is running at localhost:5432.'
        };
    }
    
    // Generic Prisma Error fallback
    if (error.name === 'PrismaClientKnownRequestError') {
        return {
            status: 400,
            message: `Database error: ${error.message.split('\n').pop()}`
        };
    }

    return {
        status: 500,
        message: error.message || 'An unexpected database error occurred.'
    };
};

/**
 * Simple check to verify database connectivity.
 */
export const checkDbConnection = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
        
        // Auto-seed admin on every start for reliability using environment variables
        const adminEmail = process.env.ADMIN_USER_EMAIL;
        const adminPassword = process.env.ADMIN_USER_PASSWORD;

        if (adminEmail && adminPassword) {
            const bcrypt = require('bcrypt');
            const hash = await bcrypt.hash(adminPassword, 10);
            const admin = await (prisma as any).user.upsert({
                where: { email: adminEmail },
                create: {
                    id: 'admin-boot-fix',
                    username: 'LynxisAdmin',
                    email: adminEmail,
                    passwordHash: hash,
                    onboardingCompleted: true
                },
                update: {
                    passwordHash: hash,
                    onboardingCompleted: true
                }
            });

            await (prisma as any).adminRoleAssignment.upsert({
                where: { userId_role: { userId: admin.id, role: 'SUPER_ADMIN' } },
                create: {
                    userId: admin.id,
                    role: 'SUPER_ADMIN',
                    assignedBy: 'SYSTEM'
                },
                update: {}
            });
            console.log(`✅ Super Admin (${adminEmail}) seed synchronized.`);
        }
        
        return true;
    } catch (error: any) {
        const { message } = handlePrismaError(error);
        console.error(`❌ CRITICAL: ${message}`);
        return false;
    }
};
