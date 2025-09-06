import { useRouter } from "next/navigation";

import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";
import { useCalculatorViewModel } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";

export function GuidePageWithRouting({ step, segments }: { step: 1 | 2; segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculatorViewModel();

  const handleNavigationNextClick = () => {
    if (step === 1) {
      router.push(routes.guide(segments, 2));
    } else {
      router.push(routes.question(segments, 1));
    }
  };

  return <AppGuidePage calculator={calculator} step={step} onNavigationNextClick={handleNavigationNextClick} />;
}
