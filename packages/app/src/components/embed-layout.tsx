import React from "react";

import { Layout } from "@/components/layout";

function EmbedLayoutComponent({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children);
  const isSlot = (type: React.ElementType) => (child: React.ReactNode) => React.isValidElement(child) && child.type === type;
  const header = items.filter(isSlot(Layout.Header));
  const footer = items.filter(isSlot(Layout.Footer));
  const body = items.filter((child) => !isSlot(Layout.Header)(child) && !isSlot(Layout.Footer)(child));

  return (
    <div className="koa:relative koa:flex koa:h-dvh koa:flex-col koa:overflow-hidden">
      {header}
      <div className="koa:relative koa:flex koa:min-h-0 koa:flex-1 koa:flex-col koa:overflow-y-auto koa:pt-4 koa:[mask-image:linear-gradient(to_bottom,transparent,black_1rem)] koa:max-sm:justify-between">
        {body}
      </div>
      {footer}
    </div>
  );
}

EmbedLayoutComponent.displayName = "EmbedLayout";

export const EmbedLayout = Object.assign(EmbedLayoutComponent, {
  Header: Layout.Header,
  Content: Layout.Content,
  BottomNavigation: Layout.BottomNavigation,
  Footer: Layout.Footer,
});
