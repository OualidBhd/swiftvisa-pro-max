/*
  Warnings:

  - A unique constraint covering the columns `[trackingCode]` on the table `applications` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "applications_trackingCode_key" ON "applications"("trackingCode");
