import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type GuideNavigationCard = {
  step: 1 | 2;
  onNextClick: () => void;
};

export function GuideNavigationCard({ step, onNextClick }: GuideNavigationCard) {
  return (
    <NavigationCard>
      <Button onClick={onNextClick}>{step === 1 ? "Pokračovat" : "Začít odpovídat"}</Button>
    </NavigationCard>
  );
}
