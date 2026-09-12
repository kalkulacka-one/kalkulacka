import { GuidePage } from "@kalkulacka-one/app";
import { useCalculator } from "@kalkulacka-one/app/client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { CalculatorMenu, useEmbed } from "@/components/client";
import { calculatorNames } from "@/config/calculator-names";
import { useAutoSave } from "@/hooks/auto-save";
import { type RouteSegments, routes } from "@/lib/routing";

export function GuidePageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
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

  const handleStartClick = () => {
    router.push(routes.question(segments, 1, locale));
  };

  const handleBackClick = () => {
    router.push(routes.introduction(segments, locale));
  };

  return (
    <GuidePage
      appTitle="Изборен калкулатор"
      electionName={electionName}
      calculatorName={calculatorName}
      headerActions={<CalculatorMenu segments={segments} />}
      attributionHref={attributionHref}
      logoMonochrome={logoMonochrome}
      onBackClick={handleBackClick}
      onStartClick={handleStartClick}
    />
  );
}
