import { notFound, useRouter } from "next/navigation";

import { QuestionPage as AppQuestionPage } from "../../../../calculator/components/server";
import { useAnswersStore } from "../../../../calculator/stores/answers";
import { useAnswer, useCalculator, useQuestions } from "../../../../calculator/view-models";
import { saveSessionData } from "../../../../lib/api/session-data";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../../client/embed-context-provider";

export function QuestionPageWithRouting({ current, segments }: { current: number; segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const { questions, total } = useQuestions();
  const question = questions[current - 1];
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);

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

  const handleCloseClick = async () => {
    await saveSessionData(calculator.id, answersStore);
    router.push("/");
  };

  const answer = useAnswer(question.id);

  return (
    <div>
      <AppQuestionPage
        embedContext={embed}
        calculator={calculator}
        question={question}
        number={current}
        total={total}
        onPreviousClick={handlePreviousClick}
        onNextClick={handleNextClick}
        onCloseClick={handleCloseClick}
        answer={answer}
      />
    </div>
  );
}
