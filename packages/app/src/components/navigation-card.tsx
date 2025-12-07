import { Card } from "@kalkulacka-one/design-system/server";

export type NavigationCard = {
  children: React.ReactNode;
};

export function NavigationCard({ children }: NavigationCard) {
  return (
    <div className="koa:@container koa:grid koa:justify-items-end koa:m-2 koa:sm:m-3 koa:lg:m-4">
      <Card corner="bottomRight" shadow="elevated" className="koa:border koa:border-slate-200 koa:pointer-events-auto">
        <div className="koa:p-3 koa:sm:p-4 koa:grid koa:grid-flow-row koa:gap-2 koa:sm:gap-3">{children}</div>
      </Card>
    </div>
  );
}
