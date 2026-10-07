import { IntroductionPage } from "@kalkulacka-one/app";
import { useAnswersStore, useCalculator, useLauncher } from "@kalkulacka-one/app/client";
import { saveSessionData } from "@kalkulacka-one/next/api";
import { reportError } from "@kalkulacka-one/next/monitoring/client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { useEmbed } from "@/components/client";
import { appConfig } from "@/config/app-config";
import { useAutoSave } from "@/hooks/auto-save";
import { canonical, type RouteSegments, routes } from "@/lib/routing";

export function IntroductionPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const launcher = useLauncher();
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
    router.push(launcher ?? routes.homepage(locale));
  };

  return (
    <IntroductionPage
      homepageHref={canonical.homepage()}
      privacyHref={appConfig.links?.privacy}
      embedContext={embed}
      calculator={calculator}
      onNextClick={handleNavigationNextClick}
      onCloseClick={handleCloseClick}
    />
  );
}
