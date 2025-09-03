import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";
import { useCalculatorViewModel } from "../../../../calculator/view-models";

export function GuidePage({ step }: { step: number }) {
  const calculator = useCalculatorViewModel();
  return <AppGuidePage calculator={calculator} step={step} />;
}
