import "@testing-library/jest-dom";

import { vi } from "vitest";

import messages from "@/messages/sk.json";

vi.mock("next-intl", () => ({
  useTranslations: (namespace: string) => {
    return (key: string) => {
      const fullPath = `${namespace}.${key}`;
      const keys = fullPath.split(".");

      let value: unknown = messages;
      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          return key;
        }
      }

      return typeof value === "string" ? value : key;
    };
  },
  hasLocale: (locales: readonly string[], locale: string) => {
    return locales.includes(locale);
  },
}));
