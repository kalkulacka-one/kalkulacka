import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type GuideNavigationCard = {
  step: 1 | 2;
  onNextClick: () => void;
  onPreviousClick: () => void;
};

export function GuideNavigationCard({ step, onNextClick, onPreviousClick }: GuideNavigationCard) {
  return (
    <NavigationCard>
      {step === 2 && (
        <Button variant="outline" onClick={onPreviousClick}>
          Zpět
        </Button>
      )}
      <Button onClick={onNextClick}>{step === 1 ? "Pokračovat" : "Začít odpovídat"}</Button>
    </NavigationCard>
  );
}
