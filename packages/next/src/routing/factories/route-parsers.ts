import type { PageType } from "@/routing/localized-slugs";
import { validateQuestionNumber } from "@/routing/validators";

export function createRouteParsers({ pageSlugs }: { pageSlugs: Record<string, Record<PageType, string>> }) {
  function parseQuestionNumber(path: string): number {
    const segments = path.split("/").filter(Boolean);

    const questionIndex = (() => {
      for (const slugs of Object.values(pageSlugs)) {
        const index = segments.indexOf(slugs.question);
        if (index !== -1) return index;
      }
      return -1;
    })();

    if (questionIndex === -1) {
      throw new Error("Question segment not found in path");
    }

    const questionNumberString = segments[questionIndex + 1];
    if (!questionNumberString) {
      throw new Error("Missing question number in path");
    }

    if (segments[questionIndex + 2]) {
      throw new Error("Unexpected path segments after question number");
    }

    return validateQuestionNumber(questionNumberString);
  }

  const parsedParams = {
    questionNumber: (path: string): number => parseQuestionNumber(path),
  } as const;

  return { parsedParams };
}
