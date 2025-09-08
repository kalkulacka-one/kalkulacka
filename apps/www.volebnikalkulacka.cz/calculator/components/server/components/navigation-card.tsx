import { Card } from "@repo/design-system/server";

export type NavigationCard = {
  children: React.ReactNode;
};

export function NavigationCard({ children }: NavigationCard) {
  return (
    <div className="grid justify-items-end m-4">
      <Card corner="bottomRight" shadow="elevated">
        <div className="p-4">{children}</div>
      </Card>
    </div>
  );
}
