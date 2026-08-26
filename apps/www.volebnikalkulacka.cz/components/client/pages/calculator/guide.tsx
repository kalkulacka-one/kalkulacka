import { GuidePage as AppGuidePage } from "@kalkulacka-one/app";
import { useAnswersStore, useCalculator } from "@kalkulacka-one/app/client";
import { saveSessionData } from "@kalkulacka-one/next/api";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { useEmbed } from "@/components/client";
import { useAutoSave } from "@/hooks/auto-save";
import { reportError } from "@/lib/monitoring";
import { type RouteSegments, routes } from "@/lib/routing";

export function GuidePageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);
  const locale = useLocale();

  useAutoSave();

  const handleNavigationNextClick = () => {
    router.push(routes.question(segments, 1, locale));
  };

  const handleBackClick = () => {
    router.push(routes.introduction(segments, locale));
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

  return <AppGuidePage embedContext={embed} calculator={calculator} onNextClick={handleNavigationNextClick} onBackClick={handleBackClick} onCloseClick={handleCloseClick} />;
}
