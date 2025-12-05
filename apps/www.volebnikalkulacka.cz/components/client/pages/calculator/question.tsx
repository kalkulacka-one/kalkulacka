import { notFound, usePathname, useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";

import { useAnswer, useAnswersStore, useCalculator, useQuestions } from "@/calculator/client";
import { QuestionPage as AppQuestionPage } from "@/calculator/server";
import { useEmbed } from "@/components/client";
import { useAutoSave } from "@/hooks/auto-save";
import { saveSessionData } from "@/lib/api";
import { reportError } from "@/lib/monitoring";
import { parsedParams, type RouteSegments, routes } from "@/lib/routing";

export function QuestionPageWithRouting({ current, segments }: { current: number; segments: RouteSegments }) {
  const router = useRouter();
  const pathname = usePathname();
  const calculator = useCalculator();
  const { questions, total } = useQuestions();
  const [, forceRender] = useReducer((x) => x + 1, 0);

  const currentQuestion = (() => {
    try {
      return parsedParams.questionNumber(pathname);
    } catch {
      return current;
    }
  })();
  const question = questions[currentQuestion - 1];
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);
  const setAnswer = useAnswersStore((state) => state.setAnswer);

  useAutoSave();

  useEffect(() => {
    if (question) {
      setAnswer({ questionId: question.id });
    }
  }, [question, setAnswer]);

  useEffect(() => {
    const handlePopState = () => {
      forceRender();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (!question) {
    notFound();
  }

  const handleNextClick = () => {
    if (currentQuestion < total) {
      const nextUrl = routes.question(segments, currentQuestion + 1);
      window.history.pushState(null, "", nextUrl);
      forceRender();
    } else {
      router.push(routes.review(segments));
    }
  };

  const handlePreviousClick = () => {
    if (currentQuestion === 1) {
      router.push(routes.guide(segments));
    } else {
      const prevUrl = routes.question(segments, currentQuestion - 1);
      window.history.pushState(null, "", prevUrl);
      forceRender();
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
        number={currentQuestion}
        total={total}
        onPreviousClick={handlePreviousClick}
        onNextClick={handleNextClick}
        onCloseClick={handleCloseClick}
        answer={answer}
      />
    </div>
  );
}
