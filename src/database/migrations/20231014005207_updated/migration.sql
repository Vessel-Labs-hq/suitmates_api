/*
  Warnings:

  - You are about to drop the column `suite_id` on the `MaintenanceRequest` table. All the data in the column will be lost.
  - You are about to drop the column `account_name` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `account_number` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `routing_number` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `space_address` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `space_amenities` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `space_name` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `space_size` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `owned_suite_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `rented_suite_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `SuiteInformation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[tenant_id]` on the table `Suite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `space_id` to the `MaintenanceRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `space_id` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suite_cost` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suite_number` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suite_size` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suite_type` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timing` to the `Suite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MaintenanceRequest" DROP CONSTRAINT "MaintenanceRequest_suite_id_fkey";

-- DropForeignKey
ALTER TABLE "Suite" DROP CONSTRAINT "Suite_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "SuiteInformation" DROP CONSTRAINT "SuiteInformation_suite_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rented_suite_id_fkey";

-- DropIndex
DROP INDEX "Suite_owner_id_key";

-- DropIndex
DROP INDEX "User_owned_suite_id_key";

-- DropIndex
DROP INDEX "User_rented_suite_id_key";

-- AlterTable
ALTER TABLE "MaintenanceRequest" DROP COLUMN "suite_id",
ADD COLUMN     "space_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Suite" DROP COLUMN "account_name",
DROP COLUMN "account_number",
DROP COLUMN "owner_id",
DROP COLUMN "routing_number",
DROP COLUMN "space_address",
DROP COLUMN "space_amenities",
DROP COLUMN "space_name",
DROP COLUMN "space_size",
ADD COLUMN     "deleted" TIMESTAMP(3),
ADD COLUMN     "space_id" INTEGER NOT NULL,
ADD COLUMN     "suite_cost" INTEGER NOT NULL,
ADD COLUMN     "suite_number" TEXT NOT NULL,
ADD COLUMN     "suite_size" TEXT NOT NULL,
ADD COLUMN     "suite_type" TEXT NOT NULL,
ADD COLUMN     "tenant_id" INTEGER,
ADD COLUMN     "timing" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "owned_suite_id",
DROP COLUMN "rented_suite_id",
ADD COLUMN     "deleted" TIMESTAMP(3),
ALTER COLUMN "role" SET DEFAULT 'owner';

-- DropTable
DROP TABLE "SuiteInformation";

-- CreateTable
CREATE TABLE "Space" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER,
    "space_name" TEXT NOT NULL,
    "space_address" TEXT NOT NULL,
    "space_size" INTEGER NOT NULL,
    "space_amenities" TEXT NOT NULL,
    "account_number" TEXT,
    "account_name" TEXT,
    "routing_number" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted" TIMESTAMP(3),

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Space_owner_id_key" ON "Space"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "Suite_tenant_id_key" ON "Suite"("tenant_id");

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suite" ADD CONSTRAINT "Suite_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Suite" ADD CONSTRAINT "Suite_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRequest" ADD CONSTRAINT "MaintenanceRequest_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
