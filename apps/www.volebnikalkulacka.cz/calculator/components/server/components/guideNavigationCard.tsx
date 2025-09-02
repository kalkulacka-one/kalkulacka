import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigationCard";

export type GuideNavigationCard = {
  step: number;
  onNavigationClick: () => void;
};

export function GuideNavigationCard({ step, onNavigationClick }: GuideNavigationCard) {
  return (
    <NavigationCard>
      <Button onClick={onNavigationClick}>{step === 1 ? "Pokračovat" : "Začít odpovídat"}</Button>
    </NavigationCard>
  );
}
