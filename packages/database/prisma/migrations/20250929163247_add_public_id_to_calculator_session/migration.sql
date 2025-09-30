/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `CalculatorSession` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."CalculatorSession" ADD COLUMN     "publicId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "CalculatorSession_publicId_key" ON "public"."CalculatorSession"("publicId");

-- CreateIndex
CREATE INDEX "CalculatorSession_publicId_idx" ON "public"."CalculatorSession"("publicId");
