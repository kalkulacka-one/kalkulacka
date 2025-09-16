import { notFound, useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";

import { QuestionPage as AppQuestionPage } from "../../../../calculator/components/server";
import { useAnswer, useCalculator, useQuestions } from "../../../../calculator/view-models";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../../client/embed-context-provider";

// Get current question number from URL
function getCurrentQuestionFromUrl(): number {
  const urlParts = window.location.pathname.split("/");
  const questionIndex = urlParts.indexOf("otazka");

  if (questionIndex !== -1 && questionIndex < urlParts.length - 1) {
    const questionNumberStr = urlParts[questionIndex + 1];
    if (questionNumberStr) {
      const questionNumber = Number.parseInt(questionNumberStr, 10);
      if (!Number.isNaN(questionNumber)) {
        return questionNumber;
      }
    }
  }
  return 1;
}

export function QuestionPageWithRouting({ current, segments }: { current: number; segments: RouteSegments }) {
  const router = useRouter();
  const embed = useEmbed();
  const calculator = useCalculator();
  const { questions, total } = useQuestions();
  const [, forceRender] = useReducer((x) => x + 1, 0);

  // Use URL as source of truth, fallback to prop
  const currentQuestion = typeof window !== "undefined" ? getCurrentQuestionFromUrl() : current;
  const question = questions[current - 1];

  if (!question) {
    notFound();
  }

  useEffect(() => {
    const handlePopState = () => {
      // Force component re-render to pick up new URL
      forceRender();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNextClick = () => {
    if (currentQuestion < total) {
      const nextUrl = routes.question(segments, currentQuestion + 1);
      window.history.pushState(null, "", nextUrl);
      // Force re-render to pick up new URL
      forceRender();
    } else {
      router.push(routes.review(segments));
    }
  };

  const handlePreviousClick = () => {
    if (current === 1) {
      router.push(routes.guide(segments));
    } else {
      const prevUrl = routes.question(segments, currentQuestion - 1);
      window.history.pushState(null, "", prevUrl);
      // Force re-render to pick up new URL
      forceRender();
    }
  };

  const handleCloseClick = () => {
    router.push("/");
  };

  const answer = useAnswer(question.id);
  const attribution = embed.isEmbed && (embed.config?.navigationAttribution ?? true);

  return (
    <div>
      <AppQuestionPage
        calculator={calculator}
        question={question}
        number={current}
        total={total}
        onPreviousClick={handlePreviousClick}
        onNextClick={handleNextClick}
        onCloseClick={handleCloseClick}
        answer={answer}
        attribution={attribution}
      />
    </div>
  );
}
