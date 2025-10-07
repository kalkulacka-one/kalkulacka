-- CreateTable
CREATE TABLE "public"."CalculatorSession" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionId" UUID NOT NULL DEFAULT gen_random_uuid(),
    "calculatorId" UUID NOT NULL,
    "calculatorKey" STRING NOT NULL,
    "calculatorGroup" STRING,
    "embedName" STRING,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "deletedAt" TIMESTAMPTZ(3),

    CONSTRAINT "CalculatorSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CalculatorSession_sessionId_idx" ON "public"."CalculatorSession"("sessionId");

-- CreateIndex
CREATE INDEX "CalculatorSession_calculatorId_idx" ON "public"."CalculatorSession"("calculatorId");

-- CreateIndex
CREATE INDEX "CalculatorSession_calculatorKey_idx" ON "public"."CalculatorSession"("calculatorKey");

-- CreateIndex
CREATE INDEX "CalculatorSession_calculatorKey_calculatorGroup_idx" ON "public"."CalculatorSession"("calculatorKey", "calculatorGroup");

-- CreateIndex
CREATE INDEX "CalculatorSession_embedName_idx" ON "public"."CalculatorSession"("embedName");

-- CreateIndex
CREATE INDEX "CalculatorSession_createdAt_idx" ON "public"."CalculatorSession"("createdAt");

-- CreateIndex
CREATE INDEX "CalculatorSession_updatedAt_idx" ON "public"."CalculatorSession"("updatedAt");

-- CreateIndex
CREATE INDEX "CalculatorSession_deletedAt_idx" ON "public"."CalculatorSession"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CalculatorSession_sessionId_calculatorId_calculatorGroup_em_key" ON "public"."CalculatorSession"("sessionId", "calculatorId", "calculatorGroup", "embedName");
