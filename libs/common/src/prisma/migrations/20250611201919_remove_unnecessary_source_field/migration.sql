/*
  Warnings:

  - You are about to drop the column `source` on the `facebook_events` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `tiktok_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "facebook_events" DROP COLUMN "source";

-- AlterTable
ALTER TABLE "tiktok_events" DROP COLUMN "source";

-- DropEnum
DROP TYPE "Source";
