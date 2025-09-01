"use client";

import type { Calculator } from "../../../../../../packages/schema/schemas/calculator.schema";
import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";
import { useCalculatorStore } from "../../../../calculator/stores/calculatorStore";

export function GuidePage({ step }: { step: number }) {
  const calculator = useCalculatorStore((state) => state.calculator?.calculator || ({} as Calculator));
  return <AppGuidePage calculator={calculator} step={step} />;
}
