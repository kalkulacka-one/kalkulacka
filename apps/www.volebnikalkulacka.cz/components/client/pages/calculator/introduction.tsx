import { useAnswersStore } from "@kalkulacka-one/app/stores";
import { useCalculator } from "@kalkulacka-one/app/view-models/client";

import { useRouter } from "next/navigation";

import { IntroductionPage } from "@/calculator/components/server";
import { useEmbed } from "@/components/client";
import { useAutoSave } from "@/hooks/auto-save";
import { saveSessionData } from "@/lib/api";
import { reportError } from "@/lib/monitoring";
import { type RouteSegments, routes } from "@/lib/routing";

export function IntroductionPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);

  useAutoSave();

  const handleNavigationNextClick = () => {
    router.push(routes.guide(segments));
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

  return <IntroductionPage embedContext={embed} calculator={calculator} onNextClick={handleNavigationNextClick} onCloseClick={handleCloseClick} />;
}
