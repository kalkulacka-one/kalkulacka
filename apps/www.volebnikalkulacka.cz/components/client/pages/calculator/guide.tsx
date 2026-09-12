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

  // A group calculator (`snemovni-2025/kalkulacka`) is named by its group and
  // variant keys; a standalone one by its own key. Neither carries a display
  // name in the data, hence the config.
  const { electionName, calculatorName } = calculatorNames({
    group: "calculatorGroup" in calculator ? calculator.calculatorGroup.key : undefined,
    key: ("variant" in calculator ? calculator.variant?.key : undefined) ?? calculator.key,
    shortTitle: calculator.shortTitle || undefined,
    fallback: calculator.title || undefined,
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
      appTitle="Volební kalkulačka"
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
