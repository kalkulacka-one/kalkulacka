import { useRouter } from "next/navigation";

import { ComparisonPage } from "../../../../calculator/components/server";
import { useCalculator } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../embed-context-provider";

export function ComparisonPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();

  const handlePreviousClick = () => {
    router.push(routes.result(segments));
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  const attribution = embed.isEmbed && (embed.config?.navigationAttribution ?? true);

  return <ComparisonPage calculator={calculator} onPreviousClick={handlePreviousClick} onCloseClick={handleCloseClick} attribution={attribution} />;
}
