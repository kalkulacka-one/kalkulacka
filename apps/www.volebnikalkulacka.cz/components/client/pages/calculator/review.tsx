import { useRouter } from "next/navigation";

import { ReviewPage as AppReviewPage } from "../../../../calculator/components/server";
import { useAnswers, useCalculator, useQuestions } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";

export function ReviewPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const questions = useQuestions();
  const answers = useAnswers();

  const handleNextClick = () => {
    router.push(routes.result(segments));
  };

  const handlePreviousClick = () => {
    router.push(routes.question(segments, questions.total));
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  return (
    <div>
      <AppReviewPage calculator={calculator} questions={questions} answers={answers} onNextClick={handleNextClick} onPreviousClick={handlePreviousClick} onCloseClick={handleCloseClick} />
    </div>
  );
}
