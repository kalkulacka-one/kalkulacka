import { Card } from "@repo/design-system/server";

import { NavigationCardAttribution } from "./navigation-card-attribution";

export type NavigationCard = {
  children: React.ReactNode;
  attributionHref?: string;
};

export function NavigationCard({ children, attributionHref }: NavigationCard) {
  return (
    <div className="grid justify-items-end m-4">
      <Card corner="bottomRight" shadow="elevated">
        <div className="p-4">
          {children}
          {attributionHref && <NavigationCardAttribution href={attributionHref} />}
        </div>
      </Card>
    </div>
  );
}
