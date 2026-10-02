import { Card } from "@kalkulacka-one/design-system/server";

export type NavigationCard = {
  children: React.ReactNode;
  // Single-CTA screens (intro/guide/review) float the button directly, pill-shaped with its own drop shadow, like
  // the 2026 shell — no card chrome around it. Multi-control screens (question, result) keep the bordered card
  // surface beneath their row of controls, unchanged.
  bare?: boolean;
};

export function NavigationCard({ children, bare = false }: NavigationCard) {
  if (bare) {
    return (
      // `isolate` + the `before:` layer below is the 2026 action band: on a phone, the list scrolling
      // underneath the floating button settles toward the page colour before it reaches the pill, instead of
      // running straight up to its edge. `-z-10` needs its own stacking context (`isolate`) or it would compare
      // against the sticky nav's siblings instead of staying behind just this card's own button.
      <div className="koa:@container koa:relative koa:isolate koa:grid koa:justify-items-center koa:px-gutter koa:pb-4 koa:sm:p-0 koa:sm:mx-auto koa:sm:w-full koa:sm:max-w-xl koa:sm:px-4 koa:sm:py-3 koa:lg:py-4 koa:before:content-[''] koa:before:pointer-events-none koa:before:absolute koa:before:-z-10 koa:before:bottom-0 koa:before:left-1/2 koa:before:w-screen koa:before:-translate-x-1/2 koa:before:h-[5rem] koa:before:bg-[image:var(--ko-fade-to-bottom)] koa:sm:before:hidden">
        <div className="koa:pointer-events-auto koa:[&>:first-child]:shadow-sticky koa:sm:[&>:first-child]:shadow-none">{children}</div>
      </div>
    );
  }

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
