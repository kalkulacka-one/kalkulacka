import { useRouter } from "next/navigation";

import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";
import { useCalculatorViewModel } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";

export function GuidePageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculatorViewModel();

  const handleNavigationNextClick = () => {
    router.push(routes.question(segments, 1));
  };

  return <AppGuidePage calculator={calculator} onNextClick={handleNavigationNextClick} />;
}
