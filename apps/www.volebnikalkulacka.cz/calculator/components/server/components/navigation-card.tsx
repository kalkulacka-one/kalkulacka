import { Card } from "@repo/design-system/server";

import { NavigationCardAttribution } from "./navigation-card-attribution";

export type NavigationCard = {
  children: React.ReactNode;
  attribution?: boolean;
};

export function NavigationCard({ children, attribution }: NavigationCard) {
  return (
    <div className="grid justify-items-end m-4">
      <Card corner="bottomRight" shadow="elevated">
        <div className="p-4 grid grid-flow-row gap-4">
          {children}
          {attribution && (
            <div className="place-self-center">
              <NavigationCardAttribution />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
