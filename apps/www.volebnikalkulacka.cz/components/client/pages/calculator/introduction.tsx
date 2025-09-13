import { useRouter } from "next/navigation";

import { IntroductionPage } from "../../../../calculator/components/server";
import { useCalculator } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../../client/embed-context-provider";

export function IntroductionPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();

  const handleNavigationNextClick = () => {
    router.push(routes.guide(segments));
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  const showAttribution = embed.isEmbed && (embed.config?.navigationAttribution ?? true);

  return <IntroductionPage calculator={calculator} onNextClick={handleNavigationNextClick} onCloseClick={handleCloseClick} isEmbed={showAttribution} />;
}
