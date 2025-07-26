-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'AWAITING_PAYMENT';

-- AlterTable
ALTER TABLE "applications" ALTER COLUMN "status" SET DEFAULT 'AWAITING_PAYMENT';
