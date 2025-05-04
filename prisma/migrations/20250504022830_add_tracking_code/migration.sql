/*
  Warnings:

  - A unique constraint covering the columns `[trackingCode]` on the table `Application` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `trackingCode` to the `Application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "trackingCode" TEXT NOT NULL,
ALTER COLUMN "travelDate" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Application_trackingCode_key" ON "Application"("trackingCode");
