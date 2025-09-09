import { useRouter } from "next/navigation";

import { ReviewPage as AppReviewPage } from "../../../../calculator/components/server";
import { useAnswersViewModel, useQuestionsViewModel } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";

export function ReviewPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const questions = useQuestionsViewModel();
  const answers = useAnswersViewModel();

  const handleNextClick = () => {
    router.push(routes.result(segments));
  };

  const handlePreviousClick = () => {
    router.push(routes.question(segments, questions.total));
  };

  return <AppReviewPage questions={questions} answers={answers} onNextClick={handleNextClick} onPreviousClick={handlePreviousClick} />;
}
