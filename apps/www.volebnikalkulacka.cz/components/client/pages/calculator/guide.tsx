import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";
import { useCalculatorViewModel } from "../../../../calculator/view-models";

export function GuidePage({ step }: { step: 1 | 2 }) {
  const calculator = useCalculatorViewModel();
  return <AppGuidePage calculator={calculator} step={step} />;
}
