/*
  Warnings:

  - You are about to drop the column `space_id` on the `MaintenanceRequest` table. All the data in the column will be lost.
  - Added the required column `suite_id` to the `MaintenanceRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MaintenanceRequest" DROP CONSTRAINT "MaintenanceRequest_space_id_fkey";

-- AlterTable
ALTER TABLE "MaintenanceRequest" DROP COLUMN "space_id",
ADD COLUMN     "suite_id" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';

-- AddForeignKey
ALTER TABLE "MaintenanceRequest" ADD CONSTRAINT "MaintenanceRequest_suite_id_fkey" FOREIGN KEY ("suite_id") REFERENCES "Suite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
