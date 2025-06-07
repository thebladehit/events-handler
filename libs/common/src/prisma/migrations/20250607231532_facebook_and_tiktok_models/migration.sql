-- CreateEnum
CREATE TYPE "Source" AS ENUM ('facebook', 'tiktok');

-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "FacebookEventType" AS ENUM ('ad.view', 'page.like', 'comment', 'video.view', 'ad.click', 'form.submission', 'checkout.complete');

-- CreateEnum
CREATE TYPE "TiktokEventType" AS ENUM ('video.view', 'like', 'share', 'comment', 'profile_visit', 'purchase', 'follow');

-- CreateTable
CREATE TABLE "facebook_events" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" "Source" NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" "FacebookEventType" NOT NULL,
    "userId" TEXT NOT NULL,
    "engagement" JSONB NOT NULL,

    CONSTRAINT "facebook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facebook_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "location" JSONB NOT NULL,

    CONSTRAINT "facebook_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiktokUser" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "TiktokUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiktokEvent" (
    "id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" "Source" NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" "TiktokEventType" NOT NULL,
    "userId" TEXT NOT NULL,
    "engagement" JSONB NOT NULL,

    CONSTRAINT "TiktokEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "facebook_events" ADD CONSTRAINT "facebook_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "facebook_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokEvent" ADD CONSTRAINT "TiktokEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "TiktokUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
