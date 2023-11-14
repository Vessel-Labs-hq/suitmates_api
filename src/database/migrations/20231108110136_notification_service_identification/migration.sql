/*
  Warnings:

  - Added the required column `service` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "service" TEXT NOT NULL,
ADD COLUMN     "serviceId" INTEGER;
