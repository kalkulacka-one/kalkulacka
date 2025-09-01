"use client";

import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";
import { useCalculatorViewModel } from "../../../../calculator/view-models/calculator.view-model";

export function GuidePage({ step }: { step: number }) {
  const calculator = useCalculatorViewModel();
  if (!calculator) {
    return <div>Loading...</div>;
  }
  return <AppGuidePage calculator={calculator} step={step} />;
}
