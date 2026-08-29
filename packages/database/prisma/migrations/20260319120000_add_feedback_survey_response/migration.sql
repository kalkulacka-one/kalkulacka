-- CreateTable
CREATE TABLE "FeedbackSurveyResponse" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "calculatorId" UUID NOT NULL,
    "calculatorKey" STRING NOT NULL,
    "helpfulness" INT4 NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackSurveyResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeedbackSurveyResponse_calculatorId_idx" ON "FeedbackSurveyResponse"("calculatorId");

-- CreateIndex
CREATE INDEX "FeedbackSurveyResponse_calculatorKey_idx" ON "FeedbackSurveyResponse"("calculatorKey");

-- CreateIndex
CREATE INDEX "FeedbackSurveyResponse_createdAt_idx" ON "FeedbackSurveyResponse"("createdAt");
