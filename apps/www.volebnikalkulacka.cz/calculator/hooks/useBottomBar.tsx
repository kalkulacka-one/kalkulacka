"use client";

import type { BottomBarButton } from "@repo/design-system/client";
import { CheckIcon, StarIcon, XIcon } from "@repo/design-system/icons";
import { useCallback, useMemo } from "react";

import type { Question } from "../../../../packages/schema/schemas/question.schema";
import { useCalculatorStore } from "../stores";

interface UseBottomBarReturn {
  leftButton: BottomBarButton | undefined;
  centerButton: BottomBarButton | undefined;
  rightButton: BottomBarButton | undefined;
  stepItems: (Question & { answerStatus?: boolean | null })[];
  stepCurrent: number;
  stepTotal: number;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
}

export const useBottomBar = (): UseBottomBarReturn => {
  const questions = useCalculatorStore((state) => state.questions);
  const currentQuestionIndex = useCalculatorStore((state) => state.currentQuestionIndex);
  const setAnswer = useCalculatorStore((state) => state.setAnswer);
  const setImportant = useCalculatorStore((state) => state.setImportant);
  const isQuestionImportant = useCalculatorStore((state) => state.isQuestionImportant);
  const setCurrentQuestionIndex = useCalculatorStore((state) => state.setCurrentQuestionIndex);
  const answers = useCalculatorStore((state) => state.answers);

  const totalQuestions = questions?.length || 0;
  const currentQuestion = questions?.[currentQuestionIndex] || null;
  const currentQuestionId = currentQuestion?.id;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const isImportant = currentQuestionId ? isQuestionImportant(currentQuestionId) : false;

  // Create step items with answer status for progress bar
  const stepItems = useMemo(() => {
    if (!questions) return [];
    return questions.map((question) => ({
      ...question,
      answerStatus: answers.get(question.id)?.answer,
    }));
  }, [questions, answers]);

  const handleFavoriteClick = useCallback(() => {
    if (currentQuestionId) {
      setImportant(currentQuestionId, !isImportant);
    }
  }, [currentQuestionId, isImportant, setImportant]);

  const handleYesClick = useCallback(() => {
    if (currentQuestionId) {
      setAnswer(currentQuestionId, true);
      // Move to next question if not the last one
      if (!isLastQuestion) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  }, [currentQuestionId, setAnswer, isLastQuestion, currentQuestionIndex, setCurrentQuestionIndex]);

  const handleNoClick = useCallback(() => {
    if (currentQuestionId) {
      setAnswer(currentQuestionId, false);
      // Move to next question if not the last one
      if (!isLastQuestion) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  }, [currentQuestionId, setAnswer, isLastQuestion, currentQuestionIndex, setCurrentQuestionIndex]);

  const leftButton = useMemo<BottomBarButton | undefined>(() => {
    return {
      label: "",
      onClick: handleFavoriteClick,
      disabled: false,
      icon: <StarIcon fill={isImportant ? "currentColor" : "none"} />,
      variant: "link" as const,
      color: "neutral" as const,
      "aria-label": "Označit otázku jako důležitou",
      "aria-pressed": isImportant,
    };
  }, [handleFavoriteClick, isImportant]);

  const centerButton = useMemo<BottomBarButton | undefined>(() => {
    return {
      label: "ANO",
      onClick: handleYesClick,
      disabled: false,
      icon: <CheckIcon width="20" height="20" />,
      variant: "answer" as const,
      color: "primary" as const,
      "data-checked": currentQuestionId && answers.get(currentQuestionId)?.answer === true ? "true" : undefined,
    };
  }, [handleYesClick, answers, currentQuestionId]);

  const rightButton = useMemo<BottomBarButton | undefined>(() => {
    return {
      label: "NE",
      onClick: handleNoClick,
      disabled: false,
      icon: <XIcon width="20" height="20" />,
      variant: "answer" as const,
      color: "secondary" as const,
      "data-checked": currentQuestionId && answers.get(currentQuestionId)?.answer === false ? "true" : undefined,
    };
  }, [handleNoClick, answers, currentQuestionId]);

  return {
    leftButton,
    centerButton,
    rightButton,
    stepItems,
    stepCurrent: currentQuestionIndex + 1,
    stepTotal: totalQuestions,
    currentQuestion,
    currentQuestionIndex,
  };
};
