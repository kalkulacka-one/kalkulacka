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
      // No band behind the button anymore — like 2026, the pill floats on shadow alone: a tight contact shadow
      // plus a soft, wide ambient one, both tinted through `--ko-shadow-color` so they read as the page's own
      // light rather than a grey halo. That is what separates it from a list scrolling underneath on a phone;
      // sm+ lays the button out in the normal content flow (see `Layout`'s comment above), so it drops the
      // shadow there same as before.
      <div className="koa:@container koa:grid koa:justify-items-center koa:px-gutter koa:pb-4 koa:sm:p-0 koa:sm:mx-auto koa:sm:w-full koa:sm:max-w-xl koa:sm:px-4 koa:sm:py-3 koa:lg:py-4">
        <div className="koa:pointer-events-auto koa:[&>:first-child]:shadow-[0_2px_6px_-2px_oklch(from_var(--ko-shadow-color)_l_c_h/0.2),0_10px_28px_-6px_oklch(from_var(--ko-shadow-color)_l_c_h/0.35),0_28px_64px_-12px_oklch(from_var(--ko-shadow-color)_l_c_h/0.28)] koa:sm:[&>:first-child]:shadow-none">
          {children}
        </div>
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
