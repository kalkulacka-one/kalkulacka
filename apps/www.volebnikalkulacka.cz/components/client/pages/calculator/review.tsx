import { useRouter } from "next/navigation";

import { ReviewPage as AppReviewPage } from "../../../../calculator/components/server";
import { useAnswersStore } from "../../../../calculator/stores/answers";
import { useAnswers, useCalculator, useQuestions } from "../../../../calculator/view-models";
import { saveSessionData } from "../../../../lib/api/session-data";
import { reportError } from "../../../../lib/monitoring";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../../client/embed-context-provider";

export function ReviewPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const questions = useQuestions();
  const answersStore = useAnswersStore((state) => state.answers);
  const answers = useAnswers();
  const embed = useEmbed();

  const handleNextClick = () => {
    router.push(routes.result(segments));
  };

  const handlePreviousClick = () => {
    router.push(routes.question(segments, questions.total));
  };

  const handleCloseClick = async () => {
    try {
      await saveSessionData(calculator.id, answersStore);
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
