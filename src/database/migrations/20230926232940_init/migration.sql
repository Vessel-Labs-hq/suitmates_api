/*
  Warnings:

  - You are about to drop the column `suite_cost` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `suite_number` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `suite_size` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `suite_type` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `timing` on the `Suite` table. All the data in the column will be lost.
  - You are about to drop the column `account_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `account_number` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `business_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `days_of_business` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hours_of_business_close` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `hours_of_business_open` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `license` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `routing_number` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `space_address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `space_amenities` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `space_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `space_size` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `User` table. All the data in the column will be lost.
  - Added the required column `account_name` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_number` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routing_number` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `space_address` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `space_amenities` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `space_name` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `space_size` to the `Suite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Suite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Suite" DROP COLUMN "suite_cost",
DROP COLUMN "suite_number",
DROP COLUMN "suite_size",
DROP COLUMN "suite_type",
DROP COLUMN "timing",
ADD COLUMN     "account_name" TEXT NOT NULL,
ADD COLUMN     "account_number" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "routing_number" TEXT NOT NULL,
ADD COLUMN     "space_address" TEXT NOT NULL,
ADD COLUMN     "space_amenities" TEXT NOT NULL,
ADD COLUMN     "space_name" TEXT NOT NULL,
ADD COLUMN     "space_size" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "account_name",
DROP COLUMN "account_number",
DROP COLUMN "business_name",
DROP COLUMN "days_of_business",
DROP COLUMN "hours_of_business_close",
DROP COLUMN "hours_of_business_open",
DROP COLUMN "license",
DROP COLUMN "occupation",
DROP COLUMN "routing_number",
DROP COLUMN "space_address",
DROP COLUMN "space_amenities",
DROP COLUMN "space_name",
DROP COLUMN "space_size",
DROP COLUMN "website",
ADD COLUMN     "onboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SuiteInformation" (
    "id" SERIAL NOT NULL,
    "suite_number" TEXT NOT NULL,
    "suite_type" TEXT NOT NULL,
    "suite_size" TEXT NOT NULL,
    "suite_cost" INTEGER NOT NULL,
    "timing" TEXT NOT NULL,
    "suite_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SuiteInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "business_name" TEXT NOT NULL,
    "days_of_business" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "hours_of_business_open" TEXT NOT NULL,
    "hours_of_business_close" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SuiteInformation" ADD CONSTRAINT "SuiteInformation_suite_id_fkey" FOREIGN KEY ("suite_id") REFERENCES "Suite"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
