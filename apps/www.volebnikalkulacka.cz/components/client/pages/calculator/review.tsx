import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { ReviewPage as AppReviewPage } from "@/calculator";
import { useAnswers, useCalculator, useQuestions } from "@/calculator/client";
import { useAnswersStore } from "@kalkulacka-one/app/client";
import { useEmbed } from "@/components/client";
import { useAutoSave } from "@/hooks/auto-save";
import { saveSessionData } from "@/lib/api";
import { reportError } from "@/lib/monitoring";
import { type RouteSegments, routes } from "@/lib/routing";

export function ReviewPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const questions = useQuestions();
  const answersStore = useAnswersStore((state) => state.answers);
  const answers = useAnswers();
  const embed = useEmbed();
  const locale = useLocale();

  useAutoSave();

  const handleNextClick = () => {
    router.push(routes.result(segments, locale));
  };

  const handlePreviousClick = () => {
    router.push(routes.question(segments, questions.total, locale));
  };

  const handleCloseClick = async () => {
    try {
      if (answersStore.length > 0) {
        await saveSessionData(calculator.id, answersStore, undefined, calculator.version);
      }
    } catch (error) {
      reportError(error);
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
    </div>
  );
}
