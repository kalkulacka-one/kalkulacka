"use client";

import { Button } from "@repo/design-system/client";

import type { CalculatorViewModel } from "../../../view-models/calculator.view-model";
import { Introduction } from "../components";

export type GuidePage = {
  calculator: CalculatorViewModel;
  step: number;
  onNext: () => void;
  onPrevious: () => void;
};

function GuideContent({ step, calculator }: { step: number; calculator: CalculatorViewModel }) {
  switch (step) {
    case 1:
      return <Introduction calculator={calculator} />;
    case 2:
      return <div>Should be step TWO. This is step: {step}</div>;
    case 3:
      return <div>Should be step THREE. This is step: {step}</div>;
    case 4:
      return <div>Should be step FOUR. This is step: {step}</div>;
  }
}

export function GuidePage({ calculator, step, onNext, onPrevious }: GuidePage) {
  if (!calculator) {
    return <div>...Loading</div>;
  }
  return (
    <>
      <GuideContent step={step} calculator={calculator} />
      <Button variant="outline" color="neutral" onClick={onPrevious}>
        Previous
      </Button>
      <Button variant="outline" color="neutral" onClick={onNext}>
        Next
      </Button>
    </>
  );
}
