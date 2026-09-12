import { ResultPage as AppResultPage } from "@kalkulacka-one/app";
import { ShareModal, useAnswersStore, useCalculatedMatches, useCalculator, useResult } from "@kalkulacka-one/app/client";
import { saveSessionData, shareSession } from "@kalkulacka-one/next/api";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { DonateCard, useEmbed } from "@/components/client";
import { appConfig } from "@/config/app-config";
import { reportError } from "@/lib/monitoring";
import { canonical, type RouteSegments, routes } from "@/lib/routing";

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
        homepageHref={canonical.homepage()}
        privacyHref={appConfig.links?.privacy}
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
        donateCard={
          <DonateCard source="result-card" className="sm:mx-4 lg:mx-8" logo dismissible>
            <DonateCard.Heading>
              Pomohla vám <span className="whitespace-nowrap">Volební kalkulačka?</span>
            </DonateCard.Heading>
            <DonateCard.Description>Volební kalkulačka je nezávislá a nezisková. Podpořte demokracii a pomozte milionům voličů.</DonateCard.Description>
          </DonateCard>
        }
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onShare={() => shareSession(calculator.id)}
        privacyHref={appConfig.links?.privacy}
        buildShareUrl={(publicId) => canonical.publicResult({ first: segments.first, second: segments.second, third: segments.third }, publicId, locale)}
      />
    </>
  );
}
