-- DropForeignKey
ALTER TABLE "PullRequest" DROP CONSTRAINT "PullRequest_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "Repository" DROP CONSTRAINT "Repository_userId_fkey";

-- AlterTable
ALTER TABLE "PullRequest" ALTER COLUMN "githubPrId" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Repository" ALTER COLUMN "githubRepoId" SET DATA TYPE BIGINT;

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PullRequest" ADD CONSTRAINT "PullRequest_repositoryId_fkey" FOREIGN KEY ("repositoryId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
