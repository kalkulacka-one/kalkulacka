import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { FeedbackSurvey, useShouldShowFeedbackSurvey } from "../../../../calculator/components/client";
import { ResultPage as AppResultPage } from "../../../../calculator/components/server";
import { useAnswersStore } from "../../../../calculator/stores/answers";
import { useCalculatedMatches, useCalculator, useResult } from "../../../../calculator/view-models";
import { submitAnonymously } from "../../../../lib/api/submit";
import { isCalculatorCompleted, markCalculatorCompleted, setAnswersExpiry } from "../../../../lib/local-storage";
import { reportError } from "../../../../lib/monitoring";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../embed-context-provider";

const TOP_TWO_CALCULATOR_ID = "12c0b7cc-2206-5f5e-a407-6e3687b18a82";
const TOP_TWO_PARTY_IDS = ["cf177ab5-1e70-40a7-afa0-afb2089259f0", "af78f800-49d1-4239-8ea7-0bc2d74639b5"];

export function ResultPageWithRouting({ segments }: { segments: RouteSegments }) {
  const [showOnlyNested, setShowOnlyNested] = useState(false);
  const [showAllParties, setShowAllParties] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);
  const submittedRef = useRef(false);
  const showFeedbackSurvey = useShouldShowFeedbackSurvey(calculator.id);

  const algorithmMatches = useCalculatedMatches();
  const result = useResult(algorithmMatches, { showOnlyNested });

  const isTopTwoMode = calculator.id === TOP_TWO_CALCULATOR_ID;
  const filteredResult = useMemo(() => {
    if (!isTopTwoMode || showAllParties) return result;
    const topTwoMatches = result.matches.filter((match) => TOP_TWO_PARTY_IDS.includes(match.candidate.id));
    return { ...result, matches: topTwoMatches };
  }, [result, isTopTwoMode, showAllParties]);

  // Submit answers anonymously once when the result page is reached
  useEffect(() => {
    if (submittedRef.current) return;
    if (isCalculatorCompleted(calculator.id)) return;
    const hasValidMatches = algorithmMatches?.some((match) => match.match !== undefined);

    if (answersStore.length > 0 && hasValidMatches) {
      submittedRef.current = true;

      const calculatorKey = segments.second ?? segments.first;
      const calculatorGroup = segments.second ? segments.first : undefined;

      // Read optional demography data from sessionStorage (set by the review page)
      let demography: Record<string, string | undefined> | undefined;
      try {
        const stored = sessionStorage.getItem(`voksmonitor-demography-${calculator.id}`);
        if (stored) {
          demography = JSON.parse(stored);
          sessionStorage.removeItem(`voksmonitor-demography-${calculator.id}`);
        }
      } catch {
        // silently ignore
      }

      submitAnonymously({
        calculatorId: calculator.id,
        calculatorKey,
        calculatorGroup,
        calculatorVersion: calculator.version,
        answers: answersStore,
        matches: algorithmMatches,
        demography,
      })
        .then(() => {
          setAnswersExpiry(calculator.id);
          markCalculatorCompleted(calculator.id);
        })
        .catch(reportError);
    }
  }, [algorithmMatches, answersStore, calculator.id, calculator.version, segments]);

  const handlePreviousClick = () => {
    router.push(routes.review(segments));
  };

  const navigateToComparison = () => {
    router.push(routes.comparison(segments));
  };

  const handleNextClick = () => {
    if (showFeedbackSurvey) {
      setIsFeedbackOpen(true);
    } else {
      navigateToComparison();
    }
  };

  const handleFeedbackComplete = () => {
    setIsFeedbackOpen(false);
    navigateToComparison();
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  const shareUrl = useMemo(() => {
    const params = new URLSearchParams();
    const calculatorKey = segments.second ? `${segments.first}/${segments.second}` : segments.first;
    params.set("calc", calculatorKey);
    for (const match of result.matches) {
      if (match.candidate.displayName && match.match !== undefined) {
        const slug = match.candidate.displayName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/\s+/g, "-");
        params.set(slug, String(Math.round(match.match)));
      }
    }
    if (typeof window !== "undefined") {
      return `${window.location.origin}/share?${params.toString()}`;
    }
    return `/share?${params.toString()}`;
  }, [result.matches, segments]);

  const donateCardPosition = embed.isEmbed ? (embed.config?.donateCard ?? 1) : 5;

  const calculatorKey = segments.second ? `${segments.first}/${segments.second}` : segments.first;

  return (
    <div>
      <AppResultPage
        embedContext={embed}
        calculator={calculator}
        result={filteredResult}
        onNextClick={handleNextClick}
        onPreviousClick={handlePreviousClick}
        onCloseClick={handleCloseClick}
        shareUrl={shareUrl}
        showOnlyNested={showOnlyNested}
        onFilterChange={setShowOnlyNested}
        donateCardPosition={donateCardPosition}
        showAllParties={showAllParties}
        onShowAllPartiesChange={isTopTwoMode ? setShowAllParties : undefined}
      />
      {isFeedbackOpen && <FeedbackSurvey calculatorId={calculator.id} calculatorKey={calculatorKey} onComplete={handleFeedbackComplete} />}
    </div>
  );
}
