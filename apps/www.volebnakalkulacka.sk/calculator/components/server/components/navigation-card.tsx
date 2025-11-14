import { Card } from "@repo/design-system/server";

export type NavigationCard = {
  children: React.ReactNode;
};

export function NavigationCard({ children }: NavigationCard) {
  return (
    <div className="@container grid justify-items-end m-2 sm:m-3 lg:m-4">
      <Card corner="bottomRight" shadow="elevated" className="border border-slate-200  pointer-events-auto">
        <div className="p-3 sm:p-4 grid grid-flow-row gap-2 sm:gap-3">{children}</div>
      </Card>
    </div>
  );
}
