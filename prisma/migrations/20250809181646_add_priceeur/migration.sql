-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'AWAITING_PAYMENT';

-- AlterTable
ALTER TABLE "applications" ADD COLUMN     "amountPaid" DECIMAL(10,2),
ADD COLUMN     "currency" TEXT,
ADD COLUMN     "paymentIntentId" TEXT,
ADD COLUMN     "paymentSessionId" TEXT,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "priceEUR" DECIMAL(10,2),
ADD COLUMN     "receiptEmailSentAt" TIMESTAMP(3),
ALTER COLUMN "status" SET DEFAULT 'AWAITING_PAYMENT';

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "trackingCode" TEXT,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "attachment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "applications_paymentSessionId_idx" ON "applications"("paymentSessionId");
