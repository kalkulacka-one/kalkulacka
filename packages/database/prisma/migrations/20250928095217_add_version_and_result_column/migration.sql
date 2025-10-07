-- AlterTable
ALTER TABLE "public"."CalculatorSession" ADD COLUMN     "calculatorVersion" STRING;

-- AlterTable
ALTER TABLE "public"."CalculatorSessionData" ADD COLUMN     "result" JSONB;
