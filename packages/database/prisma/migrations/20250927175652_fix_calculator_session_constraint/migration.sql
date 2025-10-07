/*
  Warnings:

  - A unique constraint covering the columns `[sessionId,calculatorId]` on the table `CalculatorSession` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."CalculatorSession_sessionId_calculatorId_calculatorGroup_em_key";

-- CreateIndex
CREATE UNIQUE INDEX "CalculatorSession_sessionId_calculatorId_key" ON "public"."CalculatorSession"("sessionId", "calculatorId");
