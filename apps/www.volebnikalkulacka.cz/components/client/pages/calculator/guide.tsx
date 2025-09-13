import { useRouter } from "next/navigation";

import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";
import { useCalculator } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../../client/embed-context-provider";

export function GuidePageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const { isEmbed } = useEmbed();

  const handleNavigationNextClick = () => {
    router.push(routes.question(segments, 1));
  };

  const handleBackClick = () => {
    router.push(routes.introduction(segments));
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  return <AppGuidePage calculator={calculator} onNextClick={handleNavigationNextClick} onBackClick={handleBackClick} onCloseClick={handleCloseClick} isEmbed={isEmbed} />;
}
