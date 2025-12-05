import "@testing-library/jest-dom/vitest";

import { vi } from "vitest";

// Mock next-intl for tests - returns Czech translations
vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    return (key: string) => {
      const translations: Record<string, Record<string, string>> = {
        "calculator.components.question-navigation-card": {
          guide: "Návod",
          previous: "Předchozí",
          next: "Další",
          skip: "Přeskočit",
          important: "Pro mě důležité",
          yes: "Ano",
          no: "Ne",
        },
        "calculator.components.guide-navigation-card": {
          start: "Začít odpovídat",
        },
        "calculator.components.result-navigation-card": {
          compare: "Porovnat",
          share: "Sdílet",
        },
        "calculator.components.review-navigation-card": {
          result: "Zobrazit výsledky",
        },
      };

      const fullPath = `${namespace}.${key}`;
      const parts = fullPath.split(".");
      const namespaceKey = parts.slice(0, -1).join(".");
      const translationKey = parts[parts.length - 1] || key;

      return translations[namespaceKey]?.[translationKey] ?? key;
    };
  },
}));
