import { IntroductionPage } from "@kalkulacka-one/app";
import { useAnswersStore, useCalculator } from "@kalkulacka-one/app/client";
import { saveSessionData } from "@kalkulacka-one/next/api";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { useEmbed } from "@/components/client";
import { appConfig } from "@/config/app-config";
import { useAutoSave } from "@/hooks/auto-save";
import { reportError } from "@/lib/monitoring";
import { canonical, type RouteSegments, routes } from "@/lib/routing";

export function IntroductionPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);
  const locale = useLocale();

  useAutoSave();

  const handleNavigationNextClick = () => {
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
    <IntroductionPage
      // TODO: drop this fallback — it hardcodes a past election as the heading for any calculator whose data has no shortTitle, which hides the missing data instead of surfacing it
      fallbackShortTitle="Sněmovní 2025"
      homepageHref={canonical.homepage()}
      privacyHref={appConfig.links?.privacy}
      embedContext={embed}
      calculator={calculator}
      onNextClick={handleNavigationNextClick}
      onCloseClick={handleCloseClick}
    />
  );
}
