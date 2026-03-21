-- AlterTable
ALTER TABLE "PullRequest" ADD COLUMN     "additions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "changedFiles" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deletions" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "healthScore" INTEGER;

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'info',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
