-- CreateTable
CREATE TABLE "DemographySurveyResponse" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sessionId" UUID NOT NULL,
    "calculatorId" UUID NOT NULL,
    "calculatorKey" STRING NOT NULL,
    "gender" STRING,
    "age" STRING,
    "residence" STRING,
    "education" STRING,
    "resultMatch" STRING,
    "voted2022" STRING,
    "wouldVote" STRING,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemographySurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DemographySurveyResponse_sessionId_idx" ON "DemographySurveyResponse"("sessionId");

-- CreateIndex
CREATE INDEX "DemographySurveyResponse_calculatorId_idx" ON "DemographySurveyResponse"("calculatorId");

-- CreateIndex
CREATE INDEX "DemographySurveyResponse_calculatorKey_idx" ON "DemographySurveyResponse"("calculatorKey");

-- CreateIndex
CREATE INDEX "DemographySurveyResponse_createdAt_idx" ON "DemographySurveyResponse"("createdAt");
