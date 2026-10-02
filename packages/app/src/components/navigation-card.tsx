import { Card } from "@kalkulacka-one/design-system/server";

export type NavigationCard = {
  children: React.ReactNode;
};

export function NavigationCard({ children }: NavigationCard) {
  // < sm: unchanged — a small card docked to the bottom-right corner of the fixed overlay.
  // sm+: the card belongs to the content column now — centred and exactly as wide as Layout.Content
  // (`max-w-xl`, same horizontal inset as its `sm:p-4`), with its own vertical breathing room above/below.
  return (
    <div className="koa:@container koa:grid koa:justify-items-end koa:m-2 koa:sm:m-0 koa:sm:justify-items-stretch koa:sm:mx-auto koa:sm:w-full koa:sm:max-w-xl koa:sm:px-4 koa:sm:py-3 koa:lg:py-4">
      <Card corner="bottomRight" shadow="elevated" className="koa:border koa:border-slate-200 koa:pointer-events-auto koa:w-full koa:sm:rounded-br-3xl">
        <div className="koa:p-3 koa:sm:p-4 koa:grid koa:grid-flow-row koa:gap-2 koa:sm:gap-3">{children}</div>
      </Card>
    </div>
  );
}
