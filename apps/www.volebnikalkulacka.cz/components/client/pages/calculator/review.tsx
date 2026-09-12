import { ReviewPage } from "@kalkulacka-one/app";
import { useAnswersStore, useCalculator, useQuestions } from "@kalkulacka-one/app/client";
import { IconButton } from "@kalkulacka-one/design-system/client";
import { icons } from "@kalkulacka-one/design-system/icons";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";

import { HideOnEmbed, useEmbed } from "@/components/client";
import { calculatorNames } from "@/config/calculator-names";
import { useAutoSave } from "@/hooks/auto-save";
import { saveSessionData } from "@/lib/api";
import { reportError } from "@/lib/monitoring";
import { type RouteSegments, routes } from "@/lib/routing";

export function ReviewPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const { total } = useQuestions();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);
  const locale = useLocale();

  useAutoSave();

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
    <ReviewPage
      appTitle="Volební kalkulačka"
      electionName={electionName}
      calculatorName={calculatorName}
      headerActions={
        <HideOnEmbed>
          <IconButton icon={icons.close} label="Zavřít" variant="surface" onClick={handleCloseClick} />
        </HideOnEmbed>
      }
      attributionHref={attributionHref}
      logoMonochrome={logoMonochrome}
      onBackClick={handleBackClick}
      onShowResultsClick={handleShowResultsClick}
    />
  );
}
