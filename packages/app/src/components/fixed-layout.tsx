import { Layout } from "@/components/layout";

function FixedLayoutComponent({ children }: { children: React.ReactNode }) {
  return <div className="koa:relative koa:flex koa:h-dvh koa:flex-col koa:overflow-hidden">{children}</div>;
}

FixedLayoutComponent.displayName = "FixedLayout";

export const FixedLayout = Object.assign(FixedLayoutComponent, {
  Header: Layout.Header,
  Content: Layout.Content,
  Footer: Layout.Footer,
});
