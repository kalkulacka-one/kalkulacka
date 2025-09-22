import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type ResultNavigationCard = {
  onNextClick: () => void;
};

export function ResultNavigationCard({ onNextClick }: ResultNavigationCard) {
  return (
    <NavigationCard>
      <Button color="neutral" onClick={onNextClick}>
        Zobrazit porovnání
      </Button>
    </NavigationCard>
  );
}
