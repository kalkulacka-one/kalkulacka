"use client";

import type { NavigationButton } from "@repo/design-system/client";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

import type { Question } from "../../../../packages/schema/schemas/question.schema";
import { useCalculatorStore } from "../stores";

interface UseCardNavigationReturn {
  previousButton: NavigationButton | undefined;
  nextButton: NavigationButton | undefined;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const useCardNavigation = (): UseCardNavigationReturn => {
  const questions = useCalculatorStore((state) => state.questions);
  const currentQuestionIndex = useCalculatorStore((state) => state.currentQuestionIndex);
  const setCurrentQuestionIndex = useCalculatorStore((state) => state.setCurrentQuestionIndex);
  const isQuestionAnswered = useCalculatorStore((state) => state.isQuestionAnswered);

  const router = useRouter();
  const pathname = usePathname();
  const basePath = pathname.replace(/\/\d+$/, "");

  const totalQuestions = questions?.length || 0;
  const currentQuestion = questions?.[currentQuestionIndex] || null;
  const isAnswered = currentQuestion?.id ? isQuestionAnswered(currentQuestion.id) : false;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handlePreviousClick = useCallback(() => {
    const newIndex = Math.max(currentQuestionIndex - 1, 0);
    setCurrentQuestionIndex(newIndex);
  }, [currentQuestionIndex, setCurrentQuestionIndex]);

  const handleNextClick = useCallback(() => {
    const newIndex = Math.min(currentQuestionIndex + 1, totalQuestions - 1);
    setCurrentQuestionIndex(newIndex);
  }, [currentQuestionIndex, totalQuestions, setCurrentQuestionIndex]);

  const handleSkipClick = useCallback(() => {
    const newIndex = Math.min(currentQuestionIndex + 1, totalQuestions - 1);
    setCurrentQuestionIndex(newIndex);
  }, [currentQuestionIndex, totalQuestions, setCurrentQuestionIndex]);

  const handleResultsClick = useCallback(() => {
    router.push(`${basePath}/vysledky`);
  }, [basePath, router]);

  const handleGuideClick = useCallback(() => {
    router.push(`${basePath}/navod`);
  }, [basePath, router]);

  const previousButton = useMemo<NavigationButton | undefined>(() => {
    if (isFirstQuestion) {
      return {
        label: "NÁVOD",
        shortLabel: "NÁVOD",
        onClick: handleGuideClick,
        disabled: false,
        icon: "chevron",
      };
    }

    return {
      label: "PŘEDCHOZÍ OTÁZKA",
      shortLabel: "PŘEDCHOZÍ",
      onClick: handlePreviousClick,
      disabled: false,
      icon: "chevron",
    };
  }, [isFirstQuestion, handlePreviousClick, handleGuideClick]);

  const nextButton = useMemo<NavigationButton | undefined>(() => {
    if (isLastQuestion) {
      return {
        label: "VÝSLEDKY",
        shortLabel: "VÝSLEDKY",
        onClick: handleResultsClick,
        disabled: false,
        icon: "chevron",
      };
    }

    if (!isAnswered) {
      return {
        label: "PŘESKOČIT OTÁZKU",
        shortLabel: "PŘESKOČIT",
        onClick: handleSkipClick,
        disabled: false,
        icon: "doubleChevron",
      };
    }

    return {
      label: "DALŠÍ OTÁZKA",
      shortLabel: "DALŠÍ",
      onClick: handleNextClick,
      disabled: false,
      icon: "chevron",
    };
  }, [isLastQuestion, isAnswered, handleResultsClick, handleSkipClick, handleNextClick]);

  return {
    previousButton,
    nextButton,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
  };
};
