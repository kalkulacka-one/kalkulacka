import { useRouter } from "next/navigation";
import { useState } from "react";

import { DemographySurvey, useShouldShowDemographySurvey } from "../../../../calculator/components/client";
import { ReviewPage as AppReviewPage } from "../../../../calculator/components/server";
import { useAnswersStore } from "../../../../calculator/stores/answers";
import { useAnswers, useCalculator, useQuestions } from "../../../../calculator/view-models";
import { useAutoSave } from "../../../../hooks/auto-save";
import { saveAnswersToLocalStorage } from "../../../../lib/local-storage";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../../client/embed-context-provider";

export function ReviewPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const questions = useQuestions();
  const answersStore = useAnswersStore((state) => state.answers);
  const answers = useAnswers();
  const embed = useEmbed();
  const showDemographySurvey = useShouldShowDemographySurvey(calculator.id);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);

  useAutoSave();

  const navigateToResult = () => {
    router.push(routes.result(segments));
  };

  const handleNextClick = () => {
    if (showDemographySurvey) {
      setIsSurveyOpen(true);
    } else {
      navigateToResult();
    }
  };

  const handleSurveyComplete = (demography?: Record<string, string | undefined>) => {
    setIsSurveyOpen(false);
    // Store demography data in sessionStorage so the result page can include it
    // in the anonymous submission
    if (demography) {
      try {
        sessionStorage.setItem(`voksmonitor-demography-${calculator.id}`, JSON.stringify(demography));
      } catch {
        // silently ignore
      }
    }
    navigateToResult();
  };

  const handlePreviousClick = () => {
    router.push(routes.question(segments, questions.total));
  };

  const handleCloseClick = () => {
    // Save progress to localStorage before leaving
    if (answersStore.length > 0) {
      saveAnswersToLocalStorage(calculator.id, answersStore);
    }
    router.push("/");
  };

  return (
    <div>
      <AppReviewPage
        embedContext={embed}
        calculator={calculator}
        questions={questions}
        answers={answers}
        onNextClick={handleNextClick}
        onPreviousClick={handlePreviousClick}
        onCloseClick={handleCloseClick}
      />
      {isSurveyOpen && <DemographySurvey calculatorId={calculator.id} calculatorKey={segments.first} onComplete={handleSurveyComplete} />}
    </div>
  );
}
