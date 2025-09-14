import { useRouter } from "next/navigation";
import { useState } from "react";

import { ResultPage as AppResultPage } from "../../../../calculator/components/server";
import { useCalculator, useResult } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../embed-context-provider";

export function ResultPageWithRouting({ segments }: { segments: RouteSegments }) {
  const [showOnlyNested, setShowOnlyNested] = useState(false);
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();

  const result = useResult({ showOnlyNested });

  const handlePreviousClick = () => {
    router.push(routes.review(segments));
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  const donateCardPosition = embed.isEmbed ? (embed.config?.donateCard ?? 1) : 5;

  return (
    <AppResultPage
      calculator={calculator}
      result={result}
      onPreviousClick={handlePreviousClick}
      onCloseClick={handleCloseClick}
      showOnlyNested={showOnlyNested}
      onFilterChange={setShowOnlyNested}
      donateCardPosition={donateCardPosition}
    />
  );
}
