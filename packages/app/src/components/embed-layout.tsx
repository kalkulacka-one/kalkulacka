import { Layout } from "@/components/layout";

type EmbedLayoutBody = {
  children: React.ReactNode;
};

function EmbedLayoutComponent({ children }: { children: React.ReactNode }) {
  return <div className="koa:relative koa:flex koa:h-dvh koa:flex-col koa:overflow-hidden">{children}</div>;
}

EmbedLayoutComponent.displayName = "EmbedLayout";

function Body({ children }: EmbedLayoutBody) {
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
