import { useRouter } from "next/navigation";

import { GuidePage as AppGuidePage } from "@/calculator/components/server";
import { useAnswersStore } from "@/calculator/stores/answers";
import { useCalculator } from "@/calculator/view-models";
import { useAutoSave } from "@/hooks/auto-save";
import { saveSessionData } from "@/lib/api";
import { reportError } from "@/lib/monitoring";
import { type RouteSegments, routes } from "@/lib/routing";

import { useEmbed } from "../../../client/embed-context-provider";

export function GuidePageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);

  useAutoSave();

  const handleNavigationNextClick = () => {
    router.push(routes.question(segments, 1));
  };

  const handleBackClick = () => {
    router.push(routes.introduction(segments));
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
