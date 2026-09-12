import { ReviewPage } from "@kalkulacka-one/app";
import { useCalculator, useQuestions } from "@kalkulacka-one/app/client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { CalculatorMenu, useEmbed } from "@/components/client";
import { calculatorNames } from "@/config/calculator-names";
import { useAutoSave } from "@/hooks/auto-save";
import { type RouteSegments, routes } from "@/lib/routing";

export function ReviewPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const { total } = useQuestions();
  const embed = useEmbed();
  const locale = useLocale();

  useAutoSave();

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

  const resultRoute = routes.result(segments, locale);

  /*
   * Warm the results route while the recap is being read. The screen after
   * this one opens on a loading animation that should start the moment the
   * button is pressed, not after an RSC round-trip — and the button is a
   * `router.push`, not a `<Link>`, so nothing prefetches it on its own.
   * Explicit is cheap. (No-op in dev.)
   */
  useEffect(() => {
    router.prefetch(resultRoute);
  }, [router, resultRoute]);

  // The recap follows the deck's end, so "back" is the card it came from — the
  // last question — as 2026 has it, not the first.
  const handleBackClick = () => {
    router.push(routes.question(segments, total, locale));
  };

  const handleShowResultsClick = () => {
    router.push(resultRoute);
  };

  return (
    <ReviewPage
      appTitle="Volebná kalkulačka"
      electionName={electionName}
      calculatorName={calculatorName}
      headerActions={<CalculatorMenu segments={segments} />}
      attributionHref={attributionHref}
      logoMonochrome={logoMonochrome}
      onBackClick={handleBackClick}
      onShowResultsClick={handleShowResultsClick}
    />
  );
}
