-- Admin Promotion Script
INSERT INTO "AdminRoleAssignment" ("id", "userId", "role", "assignedBy")
SELECT 'manual-' || id, id, 'SUPER_ADMIN', 'SYSTEM'
FROM "User"
WHERE email = 'admin@godnix.com'
ON CONFLICT DO NOTHING;
