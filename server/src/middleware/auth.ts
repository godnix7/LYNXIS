import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AdminRole } from '@prisma/client';
import { prisma, handlePrismaError } from '../services/prisma';



export const authenticateJWT = (req: any, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret') as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorizeRole = (requiredRoles: AdminRole[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });

    try {
        // Fetch latest roles from DB to avoid session stale issues
        const userWithRoles = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: { roleAssignments: true }
        });

        if (!userWithRoles) return res.status(401).json({ error: 'User not found' });

        const userRoles = userWithRoles.roleAssignments.map((ra: any) => ra.role);
        const hasPermission = requiredRoles.some(role => userRoles.includes(role) || userRoles.includes(AdminRole.SUPER_ADMIN));

        if (!hasPermission) {
            // Audit log for denied access
            await prisma.auditLog.create({
                data: {
                    actorId: req.user.id,
                    action: 'ACCESS_DENIED',
                    targetType: 'SYSTEM',
                    metadata: { requestedRoles: requiredRoles, userRoles },
                    ip: req.ip,
                    userAgent: req.headers['user-agent']
                }
            });
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    } catch (error: any) {
        const { status, message } = handlePrismaError(error);
        res.status(status).json({ error: message });
    }
  };
};

export const auditAction = (action: string, targetType: string) => {
    return async (req: any, res: Response, next: NextFunction) => {
        const originalSend = res.send;
        let responseBody: any;

        res.send = function (body) {
            responseBody = body;
            return originalSend.apply(res, arguments as any);
        };

        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                try {
                    await prisma.auditLog.create({
                        data: {
                            actorId: req.user.id,
                            action,
                            targetType,
                            targetId: req.params.id || req.body.id,
                            requestId: req.headers['x-request-id'] as string,
                            ip: req.ip,
                            userAgent: req.headers['user-agent'],
                            metadata: {
                                method: req.method,
                                path: req.path,
                                query: req.query,
                                body: req.body,
                                statusCode: res.statusCode
                            }
                        }
                    });
                } catch (error) {
                    console.error('Failed to create audit log:', error);
                }
            }
        });
        next();
    };
};
