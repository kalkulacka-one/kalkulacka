"use client";

import { useTranslations } from "next-intl";

export type QuestionNavigationCardTranslations = {
  agree: string;
  disagree: string;
  previous: string;
  next: string;
  guide: string;
  skip: string;
  important: string;
};

export function useQuestionNavigationCardTranslations(): QuestionNavigationCardTranslations {
  const t = useTranslations("calculator.pages.question.navigationCard");

  return {
    agree: t("yes"),
    disagree: t("no"),
    previous: t("previous"),
    next: t("next"),
    guide: t("guide"),
    skip: t("skip"),
    important: t("important"),
  };
}
