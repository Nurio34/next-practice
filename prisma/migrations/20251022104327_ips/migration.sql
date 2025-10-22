/*
  Warnings:

  - You are about to drop the column `ip` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "ip";

-- CreateTable
CREATE TABLE "UserIP" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserIP_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserIP" ADD CONSTRAINT "UserIP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
