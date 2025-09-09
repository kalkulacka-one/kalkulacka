import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type IntroductionNavigationCard = {
  onNextClick: () => void;
};

export function IntroductionNavigationCard({ onNextClick }: IntroductionNavigationCard) {
  return (
    <NavigationCard>
      <Button onClick={onNextClick}>Pokračovat</Button>
    </NavigationCard>
  );
}
