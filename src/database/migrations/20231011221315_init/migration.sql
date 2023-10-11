/*
  Warnings:

  - You are about to drop the column `suiteId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_SuiteToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SuiteToUser" DROP CONSTRAINT "_SuiteToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_SuiteToUser" DROP CONSTRAINT "_SuiteToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "suiteId";

-- DropTable
DROP TABLE "_SuiteToUser";
