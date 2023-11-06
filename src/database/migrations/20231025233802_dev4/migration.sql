-- AlterTable
ALTER TABLE "MaintenanceRequest" ALTER COLUMN "repair_date" DROP NOT NULL,
ALTER COLUMN "repair_time" DROP NOT NULL;
