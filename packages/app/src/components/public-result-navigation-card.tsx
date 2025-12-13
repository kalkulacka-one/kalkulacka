import { NavigationCard } from "@kalkulacka-one/app";
import { Button } from "@kalkulacka-one/design-system/client";

const HEIGHT = "h-22";

export type PublicResultNavigationCard = {
  onStartClick: () => void;
};

export function PublicResultNavigationCard({ onStartClick }: PublicResultNavigationCard) {
  return (
    <NavigationCard>
      <Button color="neutral" variant="fill" onClick={onStartClick}>
        Vyplnit vlastní kalkulačku
      </Button>
    </NavigationCard>
  );
}

PublicResultNavigationCard.heightClassNames = HEIGHT;
