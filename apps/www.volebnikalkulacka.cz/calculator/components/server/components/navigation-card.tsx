import { Card } from "@repo/design-system/server";

import { NavigationCardAttribution } from "./navigation-card-attribution";

export type NavigationCard = {
  children: React.ReactNode;
  attribution?: boolean;
};

export function NavigationCard({ children, attribution }: NavigationCard) {
  return (
    <div className="@container grid justify-items-end m-2 @sm:m-3 @lg:m-4">
      <Card corner="bottomRight" shadow="elevated">
        <div className="p-2 @sm:p-3 @lg:p-4 grid grid-flow-row gap-2 sm:gap-4">
          {children}
          {attribution && (
            <div className="place-self-center -mb-2">
              <NavigationCardAttribution />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
