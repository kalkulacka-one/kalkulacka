import { IntroductionPage, type IntroductionResumeTarget } from "@kalkulacka-one/app";
import { useCalculator, useCandidates } from "@kalkulacka-one/app/client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { CalculatorMenu, useEmbed } from "@/components/client";
import { calculatorNames } from "@/config/calculator-names";
import { useAutoSave } from "@/hooks/auto-save";
import { useCalculatorActions } from "@/hooks/calculator-actions";
import { trackEvent } from "@/lib/analytics";
import { type RouteSegments, routes } from "@/lib/routing";

export function IntroductionPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const candidates = useCandidates();
  const embed = useEmbed();
  const locale = useLocale();
  // The same restart the shell menu offers — the intro's own "Začať znova"
  // must land in the same place, so the two share one handler.
  const { restart } = useCalculatorActions({ segments });

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

  const handleContinueClick = () => {
    // Fired on the click, not on arrival at the guide: a tap here is the
    // decision to start, and the tutorial after it is still onboarding, not
    // a second start worth counting separately.
    trackEvent("Calculator started", { calculator: calculator.id });
    router.push(routes.guide(segments, locale));
  };

  const handleResumeClick = (target: IntroductionResumeTarget) => {
    router.push("review" in target ? routes.review(segments, locale) : routes.question(segments, target.question, locale));
  };

  return (
    <IntroductionPage
      appTitle="Volebná kalkulačka"
      electionName={electionName}
      calculatorName={calculatorName}
      candidateCount={candidates.length}
      headerActions={<CalculatorMenu segments={segments} />}
      attributionHref={attributionHref}
      logoMonochrome={logoMonochrome}
      onContinueClick={handleContinueClick}
      onResumeClick={handleResumeClick}
      onRestartClick={restart}
    />
  );
}
