import { useRouter } from "next/navigation";

import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";
import { useCalculatorViewModel } from "../../../../calculator/view-models";
import { createBaseSegment } from "../../../../lib/routing/path-config";

export function GuidePageWithRouting({ step, segments }: { step: 1 | 2; segments: { first: string; second?: string; embed?: string } }) {
  const router = useRouter();
  const calculator = useCalculatorViewModel();
  const baseSegment = createBaseSegment(segments);

  const handleNavigationNextClick = () => {
    if (step === 1) {
      router.push(`/${baseSegment}/navod/2`);
    } else {
      router.push(`/${baseSegment}/otazka/1`);
    }
  };

  return <AppGuidePage calculator={calculator} step={step} onNavigationNextClick={handleNavigationNextClick} />;
}
