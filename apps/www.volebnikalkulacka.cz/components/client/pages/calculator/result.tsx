import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ResultPage as AppResultPage } from "../../../../calculator/components/server";
import { useAnswersStore } from "../../../../calculator/stores/answers";
import { useCalculatedMatches, useCalculator, useResult } from "../../../../calculator/view-models";
import { saveSessionData } from "../../../../lib/api/session-data";
import { reportError } from "../../../../lib/monitoring";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../embed-context-provider";

export function ResultPageWithRouting({ segments }: { segments: RouteSegments }) {
  const [showOnlyNested, setShowOnlyNested] = useState(false);
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);

  const algorithmMatches = useCalculatedMatches();
  const result = useResult(algorithmMatches, { showOnlyNested });

  useEffect(() => {
    const hasValidMatches = algorithmMatches?.some((match) => match.match !== undefined);

    if (answersStore.length > 0 && hasValidMatches) {
      saveSessionData(calculator.id, answersStore, algorithmMatches, calculator.version).catch(reportError);
    }
  }, [algorithmMatches, answersStore, calculator.id, calculator.version]);

  const handlePreviousClick = () => {
    router.push(routes.review(segments));
  };

  const handleNextClick = () => {
    router.push(routes.comparison(segments));
  };

  const handleCloseClick = async () => {
    try {
      const hasValidMatches = algorithmMatches?.some((match) => match.match !== undefined);

      if (answersStore.length > 0 && hasValidMatches) {
        await saveSessionData(calculator.id, answersStore, algorithmMatches, calculator.version);
      }
    } catch (error) {
      reportError(error);
    }
    router.push("/");
  };

  const donateCardPosition = embed.isEmbed ? (embed.config?.donateCard ?? 1) : 5;

  return (
    <AppResultPage
      embedContext={embed}
      calculator={calculator}
      result={result}
      onNextClick={handleNextClick}
      onPreviousClick={handlePreviousClick}
      onCloseClick={handleCloseClick}
      showOnlyNested={showOnlyNested}
      onFilterChange={setShowOnlyNested}
      donateCardPosition={donateCardPosition}
    />
  );
}
