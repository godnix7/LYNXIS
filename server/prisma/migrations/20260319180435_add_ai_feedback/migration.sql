-- AlterTable
ALTER TABLE "PullRequest" ADD COLUMN     "aiFeedback" JSONB,
ADD COLUMN     "lastScannedAt" TIMESTAMP(3);
