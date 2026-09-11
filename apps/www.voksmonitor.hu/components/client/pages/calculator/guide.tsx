import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { GuidePage as AppGuidePage } from "../../../../calculator/components/server";
import { useCalculatorStore } from "../../../../calculator/stores";
import { useAnswersStore } from "../../../../calculator/stores/answers";
import { useCalculator } from "../../../../calculator/view-models";
import { useAutoSave } from "../../../../hooks/auto-save";
import { clearExpiredAnswersFromLocalStorage, saveAnswersToLocalStorage } from "../../../../lib/local-storage";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../../client/embed-context-provider";

export function GuidePageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);
  const questions = useCalculatorStore((state) => state.data.questions);

  useAutoSave();
  useEffect(() => {
    clearExpiredAnswersFromLocalStorage();
  }, []);

  const handleNavigationNextClick = () => {
    // get last unanswered question and navigate there instead of always going to the first question
    for (const answers of answersStore) {
      if (answers.answer === null || answers.answer === undefined) {
        const questionIndex = questions.findIndex((q) => q.id === answers.questionId);
        if (questionIndex !== -1) {
          router.push(routes.question(segments, questionIndex + 1));
          return;
        }
      }
    }

    // If all questions are answered, navigate to the first question page
    router.push(routes.question(segments, 1));
  };

  const handleBackClick = () => {
    router.push(routes.introduction(segments));
  };

  const handleCloseClick = () => {
    if (answersStore.length > 0) {
      saveAnswersToLocalStorage(calculator.id, answersStore);
    }
    router.push("/");
  };

  return <AppGuidePage embedContext={embed} calculator={calculator} onNextClick={handleNavigationNextClick} onBackClick={handleBackClick} onCloseClick={handleCloseClick} />;
}
