import { notFound, useRouter } from "next/navigation";
import { useEffect } from "react";

import { QuestionPage as AppQuestionPage } from "../../../../calculator/components/server";
import { useAnswersStore } from "../../../../calculator/stores/answers";
import { useAnswer, useCalculator, useQuestions } from "../../../../calculator/view-models";
import { useAutoSave } from "../../../../hooks/auto-save";
import { saveSessionData } from "../../../../lib/api/session-data";
import { reportError } from "../../../../lib/monitoring";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../../client/embed-context-provider";

export function QuestionPageWithRouting({ current, segments }: { current: number; segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const { questions, total } = useQuestions();
  const question = questions[current - 1];
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);
  const setAnswer = useAnswersStore((state) => state.setAnswer);
  const getAnswer = useAnswersStore((state) => state.getAnswer);

  useAutoSave();

  useEffect(() => {
    if (question) {
      const existingAnswer = getAnswer(question.id);
      // Only initialize with null if there's no existing answer record
      if (!existingAnswer) {
        setAnswer({ questionId: question.id, answer: null });
      }
    }
  }, [question, setAnswer, getAnswer]);

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
    try {
      if (answersStore.length > 0) {
        await saveSessionData(calculator.id, answersStore, undefined, calculator.version);
      }
    } catch (error) {
      reportError(error);
    }
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
