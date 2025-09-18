import { Button } from "@repo/design-system/client";

import { NavigationCard } from "./navigation-card";

export type ResultNavigationCard = {
  onNextClick: () => void;
  attribution?: boolean;
};

export function ResultNavigationCard({ onNextClick, attribution }: ResultNavigationCard) {
  return (
    <NavigationCard attribution={attribution}>
      <Button color="neutral" onClick={onNextClick}>
        Zobrazit porovnání
      </Button>
    </NavigationCard>
  );
}
