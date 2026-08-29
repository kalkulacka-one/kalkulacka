"use client";

import { Button, Icon } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";

import { mdiArrowRight, mdiClose, mdiStar, mdiStarOutline } from "@mdi/js";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

/** Probability (0–1) that a user sees the feedback survey */
const FEEDBACK_SHOW_PROBABILITY = 1.0;

const FEEDBACK_SESSION_KEY = "voksmonitor-feedback-shown";
const FEEDBACK_COMPLETED_PREFIX = "voksmonitor-feedback-completed-";

function completedKey(calculatorId: string): string {
  return `${FEEDBACK_COMPLETED_PREFIX}${calculatorId}`;
}

function isFeedbackCompleted(calculatorId: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(completedKey(calculatorId)) === "true";
  } catch {
    return false;
  }
}

function markFeedbackCompleted(calculatorId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(completedKey(calculatorId), "true");
  } catch {
    // silently ignore
  }
}

function shouldShowFeedback(calculatorId: string): boolean {
  if (typeof window === "undefined") return false;
  if (isFeedbackCompleted(calculatorId)) return false;

  try {
    const stored = sessionStorage.getItem(FEEDBACK_SESSION_KEY);
    if (stored === "yes") return true;
    if (stored === "no") return false;

    const show = Math.random() < FEEDBACK_SHOW_PROBABILITY;
    sessionStorage.setItem(FEEDBACK_SESSION_KEY, show ? "yes" : "no");
    return show;
  } catch {
    return false;
  }
}

export function useShouldShowFeedbackSurvey(calculatorId: string): boolean {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(shouldShowFeedback(calculatorId));
  }, [calculatorId]);

  return show;
}

export type FeedbackSurveyProps = {
  calculatorId: string;
  calculatorKey: string;
  onComplete: () => void;
};

export function FeedbackSurvey({ calculatorId, calculatorKey, onComplete }: FeedbackSurveyProps) {
  const t = useTranslations("calculator.feedback-survey");
  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (rating === null) {
      onComplete();
      return;
    }

    setIsSubmitting(true);
    markFeedbackCompleted(calculatorId);

    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          calculatorId,
          calculatorKey,
          helpfulness: rating,
        }),
      });
    } catch {
      // silently ignore — feedback is best-effort
    }

    onComplete();
  }, [rating, calculatorId, calculatorKey, onComplete]);

  const handleSkip = useCallback(() => {
    markFeedbackCompleted(calculatorId);
    onComplete();
  }, [calculatorId, onComplete]);

  const displayRating = hoveredRating ?? rating;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 backdrop-blur-sm p-4 sm:p-8">
      <Card corner="bottomRight" className="relative w-full max-w-md bg-white shadow-xl rounded-2xl my-8">
        <div className="absolute top-3 right-3 z-10">
          <Button variant="link" color="neutral" size="small" aria-label={t("close-aria-label")} onClick={handleSkip}>
            <Icon icon={mdiClose} size="medium" decorative />
          </Button>
        </div>

        <div className="p-5 sm:p-6 grid gap-5">
          <div>
            <h2 className="font-display font-semibold text-xl sm:text-2xl tracking-tight text-gray-800">{t("heading")}</h2>
            <p className="text-sm text-gray-500 mt-1">{t("description")}</p>
          </div>

          <fieldset className="grid gap-3">
            <legend className="font-medium text-sm text-gray-700">{t("helpfulness-label")}</legend>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="p-1 transition-transform hover:scale-110 cursor-pointer"
                  aria-label={t("star-aria-label", { value })}
                >
                  <Icon icon={displayRating !== null && value <= displayRating ? mdiStar : mdiStarOutline} size="large" decorative />
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 px-1">
              <span>{t("scale-low")}</span>
              <span>{t("scale-high")}</span>
            </div>
          </fieldset>

          <div className="flex items-center justify-end pt-2 border-t border-gray-100">
            <div className="flex gap-2">
              <Button variant="link" color="neutral" size="small" onClick={handleSkip}>
                {t("skip-button")}
              </Button>
              <Button color="primary" size="small" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? t("submitting-button") : t("submit-button")}
                <Icon icon={mdiArrowRight} size="small" decorative />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
