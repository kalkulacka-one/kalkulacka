import { QuestionPage } from "@kalkulacka-one/app";
import { useAnswersStore, useCalculator, useQuestions } from "@kalkulacka-one/app/client";
import { IconButton } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";

import { notFound, usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useReducer } from "react";

import { HideOnEmbed, useEmbed } from "@/components/client";
import { calculatorNames } from "@/config/calculator-names";
import { useAutoSave } from "@/hooks/auto-save";
import { saveSessionData } from "@/lib/api";
import { reportError } from "@/lib/monitoring";
import { parsedParams, type RouteSegments, routes } from "@/lib/routing";

export function QuestionPageWithRouting({ current, segments }: { current: number; segments: RouteSegments }) {
  const router = useRouter();
  const pathname = usePathname();
  const calculator = useCalculator();
  const { questions } = useQuestions();
  const [, forceRender] = useReducer((x) => x + 1, 0);
  const locale = useLocale();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);

  useAutoSave();

  // The position the URL says — `current` from the route on the first render,
  // the path itself afterwards: the page keeps it in step through
  // `replaceState`, and `usePathname` follows that. Only the guard below and
  // the page's initial position read it; the page owns the position from then on.
  const currentQuestion = (() => {
    try {
      return parsedParams.questionNumber(pathname);
    } catch {
      return current;
    }
  })();

  useEffect(() => {
    const handlePopState = () => {
      forceRender();
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  if (!questions[currentQuestion - 1]) {
    notFound();
  }

  // A group calculator (`snemovni-2025/kalkulacka`) is named by its group and
  // variant keys; a standalone one by its own key. Neither carries a display
  // name in the data, hence the config.
  const { electionName, calculatorName } = calculatorNames({
    group: "calculatorGroup" in calculator ? calculator.calculatorGroup.key : undefined,
    key: ("variant" in calculator ? calculator.variant?.key : undefined) ?? calculator.key,
    fallback: calculator.title || undefined,
  });

  // In an embed the wordmark doubles as the attribution — the one way out of a
  // partner's iframe to the full site — unless the partner opted out of it.
  const attributionHref = embed.isEmbed && embed.config?.attribution !== false ? (process.env.NEXT_PUBLIC_CANONICAL_URL ?? "/") : undefined;
  const logoMonochrome = embed.isEmbed && embed.config?.logo === "monochrome";

  /*
   * The URL tracks the question so a refresh or a shared link lands in the
   * right place — but via `replaceState` rather than a router push (or the
   * `pushState` the previous page used). Routing on every answer would put a
   * navigation between the swipe and the next card, which is exactly the
   * latency this interaction cannot afford; and a history entry per question
   * made the back button walk through every answered card before it left the
   * flow. Next's router follows `replaceState`, so `usePathname` above stays
   * in step.
   */
  const handlePositionChange = useCallback(
    (position: number) => {
      window.history.replaceState(null, "", routes.question(segments, position, locale));
    },
    [segments, locale],
  );

  const handleFinish = () => {
    router.push(routes.review(segments, locale));
  };

  const handleBackToGuide = () => {
    router.push(routes.guide(segments, locale));
  };

  const handleCloseClick = async () => {
    try {
      if (answersStore.length > 0) {
        await saveSessionData(calculator.id, answersStore, undefined, calculator.version);
      }
    } catch (error) {
      reportError(error);
    }
    router.push("/");
  };

  return (
    <QuestionPage
      appTitle="Volební kalkulačka"
      electionName={electionName}
      calculatorName={calculatorName}
      initialPosition={currentQuestion}
      headerActions={
        <HideOnEmbed>
          <IconButton icon={icons.close} label="Zavřít" variant="surface" onClick={handleCloseClick} />
        </HideOnEmbed>
      }
      attributionHref={attributionHref}
      logoMonochrome={logoMonochrome}
      onPositionChange={handlePositionChange}
      onFinish={handleFinish}
      onBackToGuide={handleBackToGuide}
    />
  );
}
