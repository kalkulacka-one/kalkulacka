import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { IntroductionPage } from "../../../../calculator/components/server";
import { useAnswersStore } from "../../../../calculator/stores/answers";
import { useCalculator } from "../../../../calculator/view-models";
import { useAutoSave } from "../../../../hooks/auto-save";
import { clearExpiredAnswersFromLocalStorage, saveAnswersToLocalStorage } from "../../../../lib/local-storage";
import { type RouteSegments, routes } from "../../../../lib/routing/route-builders";
import { useEmbed } from "../../../client/embed-context-provider";

export function IntroductionPageWithRouting({ segments }: { segments: RouteSegments }) {
  const router = useRouter();
  const calculator = useCalculator();
  const embed = useEmbed();
  const answersStore = useAnswersStore((state) => state.answers);

  useAutoSave();
  useEffect(() => {
    clearExpiredAnswersFromLocalStorage();
  }, []);

  const handleNavigationNextClick = () => {
    router.push(routes.guide(segments));
  };

  const handleCloseClick = () => {
    if (answersStore.length > 0) {
      saveAnswersToLocalStorage(calculator.id, answersStore);
    }
    router.push("/");
  };

  return <IntroductionPage embedContext={embed} calculator={calculator} onNextClick={handleNavigationNextClick} onCloseClick={handleCloseClick} />;
}
