"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import { useCalculatorStore } from "../../stores";

type QuestionUrlSynchronizerProps = {
  questionNumber: number;
};

export function QuestionUrlSynchronizer({ questionNumber }: QuestionUrlSynchronizerProps) {
  const pathname = usePathname();
  const basePath = pathname.replace(/\/\d+$/, "");

  const questions = useCalculatorStore((state) => state.questions);
  const currentQuestionIndex = useCalculatorStore((state) => state.currentQuestionIndex);
  const setCurrentQuestionIndex = useCalculatorStore((state) => state.setCurrentQuestionIndex);

  const isInitializedRef = useRef(false);
  const lastUrlQuestionNumberRef = useRef(questionNumber);
  const prevIndexRef = useRef<number | null>(null);
  const currentIndexRef = useRef<number>(currentQuestionIndex);

  // Keep a ref of the current question index to use in effects
  useEffect(() => {
    currentIndexRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  // Initialize store with URL question number IMMEDIATELY
  useEffect(() => {
    const questionIndex = questionNumber - 1;

    if (!isInitializedRef.current) {
      // First time initialization from URL - do this immediately
      if (questionIndex >= 0) {
        setCurrentQuestionIndex(questionIndex);
        lastUrlQuestionNumberRef.current = questionNumber;
        isInitializedRef.current = true;
      }
    } else if (questionNumber !== lastUrlQuestionNumberRef.current) {
      // URL changed externally (browser navigation, direct URL access)
      if (questionIndex >= 0) {
        setCurrentQuestionIndex(questionIndex);
        lastUrlQuestionNumberRef.current = questionNumber;
      }
    }
  }, [questionNumber, setCurrentQuestionIndex]); // Removed questions dependency to initialize immediately

  // Update URL when question index changes from store (navigation buttons)
  const updateUrlAndHistory = useCallback(
    (newIndex: number) => {
      const newQuestionNumber = newIndex + 1;
      if (newQuestionNumber !== lastUrlQuestionNumberRef.current) {
        requestAnimationFrame(() => {
          const newPath = `${basePath}/${newQuestionNumber}`;
          window.history.pushState({ questionIndex: newIndex }, "", newPath);
          lastUrlQuestionNumberRef.current = newQuestionNumber;
        });
      }
    },
    [basePath],
  );

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && typeof event.state.questionIndex === "number") {
        const index = event.state.questionIndex;
        if (index >= 0 && index < (questions?.length || 0)) {
          setCurrentQuestionIndex(index);
          lastUrlQuestionNumberRef.current = index + 1;
        }
      } else {
        const match = window.location.pathname.match(/\/(\d+)$/);
        if (match?.[1]) {
          const urlQuestionNumber = parseInt(match[1], 10);
          const index = urlQuestionNumber - 1;
          if (index >= 0 && index < (questions?.length || 0)) {
            setCurrentQuestionIndex(index);
            lastUrlQuestionNumberRef.current = urlQuestionNumber;
          }
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [questions, setCurrentQuestionIndex]);

  // Also react to pathname changes (Next router back/forward)
  // Only depend on `pathname` so we don't reset index on local navigation
  useEffect(() => {
    const match = pathname.match(/\/(\d+)$/);
    if (match?.[1]) {
      const urlQuestionNumber = parseInt(match[1], 10);
      const index = urlQuestionNumber - 1;
      if (index >= 0 && index !== currentIndexRef.current) {
        setCurrentQuestionIndex(index);
        lastUrlQuestionNumberRef.current = urlQuestionNumber;
      }
    }
    // If pathname does not end with a number (e.g., results), do nothing
  }, [pathname, setCurrentQuestionIndex]);

  // Update URL when currentQuestionIndex changes from navigation (but not from URL changes)
  useEffect(() => {
    // Only update URL after proper initialization and if it's actually a navigation change
    if (isInitializedRef.current && currentQuestionIndex >= 0) {
      // Skip the very first run to avoid pushing "/1" on initial mount
      if (prevIndexRef.current === null) {
        prevIndexRef.current = currentQuestionIndex;
        return;
      }

      // Only proceed if the index actually changed (user navigation)
      if (currentQuestionIndex === prevIndexRef.current) {
        return;
      }

      const expectedQuestionNumber = currentQuestionIndex + 1;
      // Only update URL if:
      // 1. The expected URL doesn't match our tracked URL
      // 2. The expected URL doesn't match the current URL parameter
      // 3. This isn't the initial sync (questionNumber should already be tracked)
      if (expectedQuestionNumber !== lastUrlQuestionNumberRef.current && expectedQuestionNumber !== questionNumber) {
        updateUrlAndHistory(currentQuestionIndex);
      }

      // Remember latest index for subsequent comparisons
      prevIndexRef.current = currentQuestionIndex;
    }
  }, [currentQuestionIndex, updateUrlAndHistory, questionNumber]);

  // Sync history state
  useEffect(() => {
    if (typeof window !== "undefined" && currentQuestionIndex >= 0 && isInitializedRef.current) {
      window.history.replaceState({ questionIndex: currentQuestionIndex }, "", window.location.pathname);
    }
  }, [currentQuestionIndex]);

  return null;
}
