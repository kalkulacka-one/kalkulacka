import { notFound, useRouter } from "next/navigation";

import { QuestionPage as AppQuestionPage } from "../../../../calculator/components/server";
import { useAnswersViewModel, useAnswerViewModel, useCalculatorViewModel, useQuestionsViewModel } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";

export function QuestionPageWithRouting({ current, segments }: { current: number; segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculatorViewModel();
  const { questions, total } = useQuestionsViewModel();
  const question = questions[current - 1];
  const answers = useAnswersViewModel();

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

  const handleCloseClick = () => {
    router.push("/");
  };

  const answer = useAnswerViewModel(question.id);

  return (
    <div>
      <AppQuestionPage
        calculator={calculator}
        question={question}
        questions={{ questions, total }}
        number={current}
        total={total}
        onPreviousClick={handlePreviousClick}
        onNextClick={handleNextClick}
        onCloseClick={handleCloseClick}
        answer={answer}
        answers={answers}
      />
    </div>
  );
}
