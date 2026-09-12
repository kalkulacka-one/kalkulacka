import { ResultPage } from "@kalkulacka-one/app";
import { useAnswersStore, useCalculatedMatches, useCalculator } from "@kalkulacka-one/app/client";
import { IconButton } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { ShareModal } from "@/calculator/components/client";
import { DonateCard, HideOnEmbed, useEmbed } from "@/components/client";
import { calculatorNames } from "@/config/calculator-names";
import { useAutoSave } from "@/hooks/auto-save";
import { saveSessionData } from "@/lib/api";
import { reportError } from "@/lib/monitoring";
import { type RouteSegments, routes } from "@/lib/routing";

/**
 * The comparison view's filter, as a query parameter — `?filtr=dulezite` for
 * the starred questions, `?filtr=<topic slug>` for one theme. A stand-in
 * until the comparison page itself is ported and defines the deep link.
 */
const FILTER_PARAM = "filtr";
const IMPORTANT_FILTER = "dulezite";

export function ResultPageWithRouting({ segments }: { segments: RouteSegments }) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);
  const locale = useLocale();

  const algorithmMatches = useCalculatedMatches();

  /*
   * The ranking is what marks the session finished server-side and what a
   * shared result is drawn from: saved eagerly the moment there is one, and
   * again with the ranking whenever the tab is hidden or left.
   */
  useAutoSave({ matches: algorithmMatches });

  useEffect(() => {
    const hasValidMatches = algorithmMatches?.some((match) => match.match !== undefined);

    if (answersStore.length > 0 && hasValidMatches) {
      saveSessionData(calculator.id, answersStore, algorithmMatches, calculator.version).catch(reportError);
    }
  }, [algorithmMatches, answersStore, calculator.id, calculator.version]);

  // A group calculator (`snemovni-2025/kalkulacka`) is named by its group and
  // variant keys; a standalone one by its own key. Neither carries a display
  // name in the data, hence the config.
  const { electionName, calculatorName } = calculatorNames({
    group: "calculatorGroup" in calculator ? calculator.calculatorGroup.key : undefined,
    key: ("variant" in calculator ? calculator.variant?.key : undefined) ?? calculator.key,
    fallback: calculator.title || undefined,
  });

  // In an embed the wordmark doubles as the attribution — the one way out of a
  // partner's iframe to the full site — unless the partner opted out of it.
  const attributionHref = embed.isEmbed && embed.config?.attribution !== false ? (process.env.NEXT_PUBLIC_CANONICAL_URL ?? "/") : undefined;
  const logoMonochrome = embed.isEmbed && embed.config?.logo === "monochrome";

  const comparisonRoute = routes.comparison(segments, locale);

  const handleBackClick = () => {
    router.push(routes.review(segments, locale));
  };

  const handleCompareClick = () => {
    router.push(comparisonRoute);
  };

  const handleCompareTopicClick = (topicSlug: string) => {
    router.push(`${comparisonRoute}?${FILTER_PARAM}=${encodeURIComponent(topicSlug)}`);
  };

  const handleCompareImportantClick = () => {
    router.push(`${comparisonRoute}?${FILTER_PARAM}=${IMPORTANT_FILTER}`);
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
      <ResultPage
        appTitle="Volební kalkulačka"
        electionName={electionName}
        calculatorName={calculatorName}
        headerActions={
          <HideOnEmbed>
            <IconButton icon={icons.close} label="Zavřít" variant="surface" onClick={handleCloseClick} />
          </HideOnEmbed>
        }
        attributionHref={attributionHref}
        logoMonochrome={logoMonochrome}
        onBackClick={handleBackClick}
        onCompareClick={handleCompareClick}
        onCompareTopicClick={handleCompareTopicClick}
        onCompareImportantClick={handleCompareImportantClick}
        onShareClick={handleShareClick}
        donateCardPosition={donateCardPosition}
        donateCard={
          <DonateCard source="result-card" logo dismissible>
            <DonateCard.Heading>
              Pomohla vám <span className="whitespace-nowrap">Volební kalkulačka?</span>
            </DonateCard.Heading>
            <DonateCard.Description>Volební kalkulačka je nezávislá a nezisková. Podpořte demokracii a pomozte milionům voličů.</DonateCard.Description>
          </DonateCard>
        }
      />
      <ShareModal calculatorId={calculator.id} segments={segments} isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </>
  );
}
