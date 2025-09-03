import { useRouter } from "next/navigation";

import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";
import { useCalculatorViewModel } from "../../../../calculator/view-models";

export function GuidePage({ step, navigationNextPath }: { step: 1 | 2; navigationNextPath: (currentStep: 1 | 2) => string }) {
  const router = useRouter();
  const calculator = useCalculatorViewModel();

  const handleNavigationNextClick = () => {
    const nextUrl = navigationNextPath(step);
    router.push(nextUrl);
  };

  return <AppGuidePage calculator={calculator} step={step} onNavigationNextClick={handleNavigationNextClick} />;
}
