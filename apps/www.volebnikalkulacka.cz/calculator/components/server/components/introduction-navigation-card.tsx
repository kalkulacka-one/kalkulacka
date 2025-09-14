import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type IntroductionNavigationCard = {
  onNextClick: () => void;
  attribution?: boolean;
};

export function IntroductionNavigationCard({ onNextClick, attribution }: IntroductionNavigationCard) {
  return (
    <NavigationCard attribution={attribution}>
      <Button onClick={onNextClick}>Pokračovat</Button>
    </NavigationCard>
  );
}
