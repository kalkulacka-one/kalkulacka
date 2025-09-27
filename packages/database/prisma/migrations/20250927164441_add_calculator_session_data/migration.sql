-- CreateTable
CREATE TABLE "public"."CalculatorSessionData" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionId" UUID NOT NULL,
    "answers" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "completedAt" TIMESTAMPTZ(3),

    CONSTRAINT "CalculatorSessionData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CalculatorSessionData_sessionId_key" ON "public"."CalculatorSessionData"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."CalculatorSessionData" ADD CONSTRAINT "CalculatorSessionData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."CalculatorSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
