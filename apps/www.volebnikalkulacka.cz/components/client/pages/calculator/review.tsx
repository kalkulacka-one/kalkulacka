import { useRouter } from "next/navigation";

import { ReviewPage as AppReviewPage } from "../../../../calculator/components/server";
import { useQuestionsViewModel } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";

export function ReviewPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const questionsViewModel = useQuestionsViewModel();

  const handleNextClick = () => {
    router.push(routes.result(segments));
  };

  const handlePreviousClick = () => {
    router.push(routes.question(segments, questionsViewModel.total));
  };

  return (
    <div>
      <AppReviewPage questions={questionsViewModel} onNextClick={handleNextClick} onPreviousClick={handlePreviousClick} />
    </div>
  );
}
