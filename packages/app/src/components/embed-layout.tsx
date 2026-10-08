import { Layout, type LayoutBody } from "@/components/layout";

/**
 * The layout for embeds, which sit in a fixed-height partner iframe: exactly the frame tall, the header stays on top,
 * the body scrolls between them and the footer (attribution) is always visible at the bottom. Same parts as Layout,
 * so a page picks one or the other and keeps its markup. `relative` also contains absolutely positioned descendants
 * (visually hidden labels), so they can't extend the frame.
 */
function EmbedLayoutComponent({ children }: { children: React.ReactNode }) {
  return <div className="koa:relative koa:flex koa:h-dvh koa:flex-col koa:overflow-hidden">{children}</div>;
}

EmbedLayoutComponent.displayName = "EmbedLayout";

// The region that scrolls, with a soft top edge where content goes under the header. Below sm its content stretches,
// so a short page keeps its bottom navigation at the bottom of the frame, like Layout's mobile grid does.
function Body({ children }: LayoutBody) {
  return <div className="koa:relative koa:flex koa:min-h-0 koa:flex-1 koa:flex-col koa:overflow-y-auto koa:embed-scroll-edge koa:max-sm:[&>main]:flex-[1_0_auto]">{children}</div>;
}

Body.displayName = "EmbedLayout.Body";

export const EmbedLayout = Object.assign(EmbedLayoutComponent, {
  Header: Layout.Header,
  Body,
  Content: Layout.Content,
  BottomNavigation: Layout.BottomNavigation,
  Footer: Layout.Footer,
});
