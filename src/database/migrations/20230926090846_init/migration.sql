-- AlterTable
ALTER TABLE "User" ADD COLUMN     "account_name" TEXT,
ADD COLUMN     "account_number" TEXT,
ADD COLUMN     "routing_number" TEXT,
ADD COLUMN     "space_address" TEXT,
ADD COLUMN     "space_amenities" TEXT,
ADD COLUMN     "space_name" TEXT,
ADD COLUMN     "space_size" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Suite" (
    "id" SERIAL NOT NULL,
    "suite_number" TEXT NOT NULL,
    "suite_type" TEXT NOT NULL,
    "suite_size" TEXT NOT NULL,
    "suite_cost" TEXT NOT NULL,
    "timing" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Suite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Suite" ADD CONSTRAINT "Suite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
