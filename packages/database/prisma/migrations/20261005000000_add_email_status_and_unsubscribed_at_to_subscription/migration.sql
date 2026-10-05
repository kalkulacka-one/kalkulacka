-- CreateEnum
CREATE TYPE "public"."EmailStatus" AS ENUM ('valid', 'invalid', 'unverified', 'bounced');

-- AlterTable
ALTER TABLE "public"."Subscription" ADD COLUMN "emailStatus" "public"."EmailStatus" NOT NULL DEFAULT 'unverified';
ALTER TABLE "public"."Subscription" ADD COLUMN "unsubscribedAt" TIMESTAMPTZ(3);
