const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const repos = await prisma.repository.findMany();
  console.log('--- REPOSITORIES ---');
  repos.forEach(r => {
    console.log(`ID: ${r.id} | GitHubID: ${r.githubRepoId} | Name: ${r.name} | Status: ${r.status} | UserID: ${r.userId}`);
  });
  
  const users = await prisma.user.findMany({ include: { roleAssignments: true } });
  console.log('--- USERS ---');
  users.forEach(u => {
    console.log(`ID: ${u.id} | Email: ${u.email} | Token: ${u.githubAccessToken ? 'YES' : 'NO'}`);
    u.roleAssignments.forEach(ra => console.log(`  Role: ${ra.role}`));
  });
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
