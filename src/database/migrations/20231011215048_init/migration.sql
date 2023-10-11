/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Business` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `SuiteInformation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `SuiteInformation` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner_id]` on the table `Suite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[owned_suite_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rented_suite_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `SuiteInformation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suiteId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- DropForeignKey
ALTER TABLE "Suite" DROP CONSTRAINT "Suite_user_id_fkey";

-- AlterTable
ALTER TABLE "Business" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Suite" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "user_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "owner_id" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SuiteInformation" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "owned_suite_id" INTEGER,
ADD COLUMN     "rented_suite_id" INTEGER,
ADD COLUMN     "suiteId" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "UserDocument" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "UserDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceImages" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "maintenance_request_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRequest" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "suite_id" INTEGER NOT NULL,
    "priority" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "repair_date" TEXT NOT NULL,
    "repair_time" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "maintenance_request_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "opened" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SuiteToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_SuiteToUser_AB_unique" ON "_SuiteToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_SuiteToUser_B_index" ON "_SuiteToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Suite_owner_id_key" ON "Suite"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_owned_suite_id_key" ON "User"("owned_suite_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_rented_suite_id_key" ON "User"("rented_suite_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rented_suite_id_fkey" FOREIGN KEY ("rented_suite_id") REFERENCES "Suite"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suite" ADD CONSTRAINT "Suite_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceImages" ADD CONSTRAINT "MaintenanceImages_maintenance_request_id_fkey" FOREIGN KEY ("maintenance_request_id") REFERENCES "MaintenanceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRequest" ADD CONSTRAINT "MaintenanceRequest_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRequest" ADD CONSTRAINT "MaintenanceRequest_suite_id_fkey" FOREIGN KEY ("suite_id") REFERENCES "Suite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_maintenance_request_id_fkey" FOREIGN KEY ("maintenance_request_id") REFERENCES "MaintenanceRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SuiteToUser" ADD CONSTRAINT "_SuiteToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Suite"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SuiteToUser" ADD CONSTRAINT "_SuiteToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
