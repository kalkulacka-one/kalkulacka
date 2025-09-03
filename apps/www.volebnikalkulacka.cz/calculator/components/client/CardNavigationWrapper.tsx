"use client";

import { CardNavigation } from "@repo/design-system/client";
import { useEffect, useState } from "react";

import { useCardNavigation } from "../../hooks/useCardNavigation";
import { QuestionCard } from "../server/components/question-card";

export function CardNavigationWrapper() {
  const { previousButton, nextButton, currentQuestion, currentQuestionIndex, totalQuestions } = useCardNavigation();
  const [prevIndex, setPrevIndex] = useState(currentQuestionIndex);
  const [animationClass, setAnimationClass] = useState("animate-fade-in-scale");

  useEffect(() => {
    if (currentQuestionIndex !== prevIndex) {
      // Determine animation direction based on navigation
      if (currentQuestionIndex > prevIndex) {
        setAnimationClass("animate-slide-in-from-right");
      } else if (currentQuestionIndex < prevIndex) {
        setAnimationClass("animate-slide-in-from-left");
      }
      setPrevIndex(currentQuestionIndex);
    }
  }, [currentQuestionIndex, prevIndex]);

  return (
    <CardNavigation previous={previousButton} next={nextButton}>
      <div className="relative overflow-hidden">
        {currentQuestion && (
          <div key={currentQuestion.id} className={animationClass}>
            <QuestionCard question={currentQuestion} questionCurrent={currentQuestionIndex + 1} questionTotal={totalQuestions} />
          </div>
        )}
      </div>
    </CardNavigation>
  );
}
