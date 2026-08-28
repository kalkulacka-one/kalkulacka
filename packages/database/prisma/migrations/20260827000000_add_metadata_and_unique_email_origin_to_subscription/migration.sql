-- AlterTable
ALTER TABLE "public"."Subscription" ADD COLUMN "metadata" JSONB;

-- CreateIndex
-- Created before dropping the email unique: migrations are not atomic on CockroachDB,
-- and the existing email-only constraint is stricter, so this can never fail
CREATE UNIQUE INDEX "Subscription_email_origin_key" ON "public"."Subscription"("email", "origin");

-- DropIndex
DROP INDEX "public"."Subscription_email_key" CASCADE;
