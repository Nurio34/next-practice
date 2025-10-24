/*
  Warnings:

  - Added the required column `category` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('shop', 'hobby', 'social');

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "category" "Category" NOT NULL;
