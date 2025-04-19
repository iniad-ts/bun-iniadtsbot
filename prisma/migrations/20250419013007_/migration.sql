/*
  Warnings:

  - You are about to drop the column `isCafeteria` on the `daily_records` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "daily_records" DROP COLUMN "isCafeteria",
ADD COLUMN     "is_1f" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_2f" BOOLEAN NOT NULL DEFAULT false;
