"use client";

import { type Messages, useTranslations } from "next-intl";

export function useCalculatorTranslations<T extends keyof Messages>(namespace: T) {
  return useTranslations(namespace);
}
