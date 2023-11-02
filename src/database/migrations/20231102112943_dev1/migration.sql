-- AlterTable
ALTER TABLE "Business" ALTER COLUMN "website" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MaintenanceRequest" ADD COLUMN     "category" TEXT,
ALTER COLUMN "status" SET DEFAULT 'PENDING';
