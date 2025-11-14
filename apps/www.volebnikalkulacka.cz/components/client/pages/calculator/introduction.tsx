import { useRouter } from "next/navigation";
import { IntroductionPage } from "@/calculator/components/server";
import { useAnswersStore } from "@/calculator/stores/answers";
import { useCalculator } from "@/calculator/view-models";
import { useAutoSave } from "@/hooks/auto-save";
import { saveSessionData } from "@/lib/api/session-data";
import { reportError } from "@/lib/monitoring";
import { type RouteSegments, routes } from "@/lib/routing/route-builders";

import { useEmbed } from "../../../client/embed-context-provider";

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
