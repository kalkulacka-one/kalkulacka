import { addLauncherParam, LAUNCHER_PARAM } from "@kalkulacka-one/app";

import type { AppConfigWithDefaults } from "@/config-helpers";
import type { Routes } from "@/routing/factories/route-builders";
import type { PageType } from "@/routing/localized-slugs";
import { validateQuestionNumber } from "@/routing/validators";

const SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function createRouteParsers({ pageSlugs, i18n, routes }: { pageSlugs: Record<string, Record<PageType, string>>; i18n: AppConfigWithDefaults["i18n"]; routes: Routes }) {
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

  // A route of this app (inside the same embed), returned as `routes` builds it, or nothing.
  function parseLauncherPath(path: string, embed: string | undefined): string | undefined {
    const parts = path.split("/").slice(1);
    const locale = i18n.locales.includes(parts[0] ?? "") ? parts.shift() : i18n.defaultLocale;
    const launcherEmbed = parts[0] === "embed" ? parts.splice(0, 2)[1] : undefined;
    const [first, second, third, ...rest] = parts;
    if (!locale || launcherEmbed !== embed || !first || rest.length > 0 || !parts.every((part) => SEGMENT.test(part))) return undefined;

    const launcher = routes.base({ first, second, third, embed }, locale);
    return launcher === path ? launcher : undefined;
  }

  // A calculator picker opened from the district picker carries that one as its own `?from=`.
  function parseLauncher(value: unknown, embed: string | undefined): string | undefined {
    if (typeof value !== "string") return undefined;
    const [path = "", query, ...rest] = value.split("?");
    const launcher = parseLauncherPath(path, embed);
    if (!launcher || query === undefined) return launcher;

    const params = new URLSearchParams(query);
    const parent = parseLauncherPath(params.get(LAUNCHER_PARAM) ?? "", embed);
    return parent && rest.length === 0 && params.size === 1 ? addLauncherParam(launcher, parent) : undefined;
  }

  const parsedParams = {
    questionNumber: (path: string): number => parseQuestionNumber(path),
    launcher: (value: unknown, embed?: string): string | undefined => parseLauncher(value, embed),
  } as const;

  return { parsedParams };
}
