-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'seller');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
