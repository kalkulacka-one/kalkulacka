import { notFound, useRouter } from "next/navigation";

import { QuestionPage as AppQuestionPage } from "../../../../calculator/components/server";
import { useAnswerViewModel, useQuestionsViewModel } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";

export function QuestionPageWithRouting({ current, segments }: { current: number; segments: RouteSegments }) {
  const router = useRouter();
  const { questions, total } = useQuestionsViewModel();
  const question = questions[current - 1];

  if (!question) {
    notFound();
  }

  const handleNextClick = () => {
    if (current < total) {
      router.push(routes.question(segments, current + 1));
    } else {
      router.push(routes.review(segments));
    }
  };

  const handlePreviousClick = () => {
    if (current === 1) {
      router.push(routes.guide(segments));
    } else {
      router.push(routes.question(segments, current - 1));
    }
  };

  const answer = useAnswerViewModel(question.id);

  return (
    <div>
      <AppQuestionPage question={question} number={current} total={total} onPreviousClick={handlePreviousClick} onNextClick={handleNextClick} answer={answer} />
    </div>
  );
}
