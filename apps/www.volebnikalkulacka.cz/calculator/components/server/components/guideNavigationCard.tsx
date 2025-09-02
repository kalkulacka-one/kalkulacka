import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigationCard";

export type GuideNavigationCard = {
  step: number;
};

export function GuideNavigationCard({ step }: GuideNavigationCard) {
  return (
    <NavigationCard>
      <Button>{step === 1 ? "Pokračovat" : "Začít odpovídat"}</Button>
    </NavigationCard>
  );
}
