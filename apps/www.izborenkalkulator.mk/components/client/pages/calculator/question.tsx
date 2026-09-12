import { QuestionPage } from "@kalkulacka-one/app";
import { useCalculator, useQuestions } from "@kalkulacka-one/app/client";

import { notFound, usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useCallback, useEffect, useReducer } from "react";

import { CalculatorMenu, useEmbed } from "@/components/client";
import { calculatorNames } from "@/config/calculator-names";
import { useAutoSave } from "@/hooks/auto-save";
import { parsedParams, type RouteSegments, routes } from "@/lib/routing";

export function QuestionPageWithRouting({ current, segments }: { current: number; segments: RouteSegments }) {
  const router = useRouter();
  const pathname = usePathname();
  const calculator = useCalculator();
  const { questions } = useQuestions();
  const [, forceRender] = useReducer((x) => x + 1, 0);
  const locale = useLocale();
  const embed = useEmbed();

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

  // A standalone calculator is named by its own data; there is no election
  // group to name it after — see `config/calculator-names.ts`.
  const { electionName, calculatorName } = calculatorNames({
    key: ("variant" in calculator ? calculator.variant?.key : undefined) ?? calculator.key,
    title: calculator.title || undefined,
    shortTitle: calculator.shortTitle,
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

  return (
    <QuestionPage
      appTitle="Изборен калкулатор"
      electionName={electionName}
      calculatorName={calculatorName}
      initialPosition={currentQuestion}
      headerActions={<CalculatorMenu segments={segments} />}
      attributionHref={attributionHref}
      logoMonochrome={logoMonochrome}
      onPositionChange={handlePositionChange}
      onFinish={handleFinish}
      onBackToGuide={handleBackToGuide}
    />
  );
}
