import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { ShareModal } from "@/calculator/components/client";
import { ResultPage as AppResultPage } from "@/calculator/components/server";
import { useAnswersStore } from "@kalkulacka-one/app/client";
import { useCalculatedMatches, useCalculator, useResult } from "@/calculator/view-models/client";
import { useEmbed } from "@/components/client";
import { saveSessionData } from "@/lib/api";
import { reportError } from "@/lib/monitoring";
import { type RouteSegments, routes } from "@/lib/routing";

export function ResultPageWithRouting({ segments }: { segments: RouteSegments }) {
  const [showOnlyNested, setShowOnlyNested] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);
  const locale = useLocale();

  const algorithmMatches = useCalculatedMatches();
  const result = useResult(algorithmMatches, { showOnlyNested });

  useEffect(() => {
    const hasValidMatches = algorithmMatches?.some((match) => match.match !== undefined);

    if (answersStore.length > 0 && hasValidMatches) {
      saveSessionData(calculator.id, answersStore, algorithmMatches, calculator.version).catch(reportError);
    }
  }, [algorithmMatches, answersStore, calculator.id, calculator.version]);

  const handlePreviousClick = () => {
    router.push(routes.review(segments, locale));
  };

  const handleNextClick = () => {
    router.push(routes.comparison(segments, locale));
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

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  const donateCardPosition = embed.isEmbed ? (embed.config?.donateCard ?? 1) : 5;

  return (
    <>
      <AppResultPage
        embedContext={embed}
        calculator={calculator}
        result={result}
        onNextClick={handleNextClick}
        onPreviousClick={handlePreviousClick}
        onCloseClick={handleCloseClick}
        onShareClick={handleShareClick}
        showOnlyNested={showOnlyNested}
        onFilterChange={setShowOnlyNested}
        donateCardPosition={donateCardPosition}
      />
      <ShareModal calculatorId={calculator.id} segments={segments} isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </>
  );
}
