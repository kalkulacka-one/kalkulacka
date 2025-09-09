import { useRouter } from "next/navigation";

import { IntroductionPage } from "../../../../calculator/components/server";
import { useCalculatorViewModel } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";

export function IntroductionPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculatorViewModel();

  const handleNavigationNextClick = () => {
    router.push(routes.guide(segments));
  };

  return <IntroductionPage calculator={calculator} onNextClick={handleNavigationNextClick} />;
}
