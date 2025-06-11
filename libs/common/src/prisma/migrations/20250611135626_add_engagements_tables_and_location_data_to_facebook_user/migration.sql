/*
  Warnings:

  - You are about to drop the column `engagement` on the `facebook_events` table. All the data in the column will be lost.
  - You are about to drop the column `eventType` on the `facebook_events` table. All the data in the column will be lost.
  - You are about to drop the column `funnelStage` on the `facebook_events` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `facebook_events` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `facebook_users` table. All the data in the column will be lost.
  - You are about to drop the `TiktokEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TiktokUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `event_type` to the `facebook_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `funnel_stage` to the `facebook_events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `facebook_events` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TiktokEvent" DROP CONSTRAINT "TiktokEvent_userId_fkey";

-- DropForeignKey
ALTER TABLE "facebook_events" DROP CONSTRAINT "facebook_events_userId_fkey";

-- AlterTable
ALTER TABLE "facebook_events" DROP COLUMN "engagement",
DROP COLUMN "eventType",
DROP COLUMN "funnelStage",
DROP COLUMN "userId",
ADD COLUMN     "event_type" "FacebookEventType" NOT NULL,
ADD COLUMN     "funnel_stage" "FunnelStage" NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "facebook_users" DROP COLUMN "location";

-- DropTable
DROP TABLE "TiktokEvent";

-- DropTable
DROP TABLE "TiktokUser";

-- CreateTable
CREATE TABLE "facebook_engagements" (
    "id" TEXT NOT NULL,
    "action_time" TIMESTAMP(3),
    "referer" TEXT,
    "video_id" TEXT,
    "ad_id" TEXT,
    "campaign_id" TEXT,
    "click_position" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "purchase_amount" DOUBLE PRECISION,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "facebook_engagements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_locations" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiktok_users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "tiktok_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiktok_events" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" "Source" NOT NULL,
    "funnel_stage" "FunnelStage" NOT NULL,
    "event_type" "TiktokEventType" NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "tiktok_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tiktok_engagements" (
    "id" TEXT NOT NULL,
    "watch_time" INTEGER,
    "percentage_watched" INTEGER,
    "device" TEXT,
    "country" TEXT,
    "video_id" TEXT,
    "action_time" TIMESTAMP(3),
    "profile_id" TEXT,
    "purchased_item" TEXT,
    "purchase_amount" DOUBLE PRECISION,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "tiktok_engagements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facebook_engagements_event_id_key" ON "facebook_engagements"("event_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_locations_user_id_key" ON "user_locations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tiktok_engagements_event_id_key" ON "tiktok_engagements"("event_id");

-- AddForeignKey
ALTER TABLE "facebook_events" ADD CONSTRAINT "facebook_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "facebook_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facebook_engagements" ADD CONSTRAINT "facebook_engagements_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "facebook_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_locations" ADD CONSTRAINT "user_locations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "facebook_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiktok_events" ADD CONSTRAINT "tiktok_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tiktok_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tiktok_engagements" ADD CONSTRAINT "tiktok_engagements_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "tiktok_events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
