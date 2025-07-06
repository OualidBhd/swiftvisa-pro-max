/*
  Warnings:

  - You are about to drop the column `userId` on the `applications` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "applications" DROP CONSTRAINT "applications_userId_fkey";

-- AlterTable
ALTER TABLE "applications" DROP COLUMN "userId";
