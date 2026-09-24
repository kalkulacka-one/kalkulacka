import { twMerge } from "@/utilities/tailwind";

export type Layout = {
  children: React.ReactNode;
};

function LayoutComponent({ children }: Layout) {
  // Mobile (< sm) keeps today's grid: Content stretches to fill the viewport and BottomNavigation floats over it, fixed.
  // sm and up switch to a plain column flow: Content sizes to its own content and BottomNavigation follows it in the
  // document, sticking to the viewport bottom only once the page is taller than the screen.
  return <div className="koa:min-h-screen koa:grid koa:grid-rows-[auto_1fr_auto] koa:sm:flex koa:sm:flex-col">{children}</div>;
}

LayoutComponent.displayName = "Layout";

export type LayoutHeader = {
  children: React.ReactNode;
  fixed?: boolean;
};

function Header({ children, fixed }: LayoutHeader) {
  return <div className={` ${fixed ? "koa:fixed koa:left-0 koa:w-full" : "koa:sticky"} koa:top-0 koa:z-50`}>{children}</div>;
}

Header.displayName = "Layout.Header";

export type LayoutContent = {
  children: React.ReactNode;
  fullWidth?: boolean;
  fixed?: boolean;
};

function Content({ children, fullWidth }: LayoutContent) {
  return <main className={`${fullWidth ? "koa:w-full" : "koa:max-w-xl koa:w-full"} koa:mx-auto koa:p-2 koa:sm:p-4`}>{children}</main>;
}

Content.displayName = "Layout.Content";

export type LayoutBottomNavigation = {
  children: React.ReactNode;
  className?: string;
};

function BottomNavigation({ children, className }: LayoutBottomNavigation) {
  // < sm: unchanged, fixed overlay docked to the viewport bottom.
  // sm+: back into the document flow, sticky to the viewport bottom so short pages keep it right under the content
  // and long ones let it stick while the list scrolls underneath.
  return (
    <div className={twMerge("koa:fixed koa:bottom-0 koa:left-0 koa:right-0 koa:pointer-events-none koa:z-20 koa:sm:sticky koa:sm:left-auto koa:sm:right-auto koa:sm:pointer-events-auto", className)}>
      {children}
    </div>
  );
}

BottomNavigation.displayName = "Layout.BottomNavigation";

export type LayoutFooter = {
  children: React.ReactNode;
};

function Footer({ children }: LayoutFooter) {
  if (!children) {
    return null;
  }
  return <footer className="koa:grid koa:justify-items-center koa:fixed koa:bottom-0 koa:left-0 koa:right-0 koa:z-5 koa:mt-2 koa:sm:mt-3 koa:lg:mt-4 koa:p-1">{children}</footer>;
}

Footer.displayName = "Layout.Footer";

export type LayoutBottomSpacer = {
  className?: string;
};

function BottomSpacer({ className }: LayoutBottomSpacer) {
  return <div className={className} aria-hidden="true" />;
}

BottomSpacer.displayName = "Layout.BottomSpacer";

type LayoutCompound = React.FC<Layout> & {
  Header: React.FC<LayoutHeader>;
  Content: React.FC<LayoutContent>;
  BottomNavigation: React.FC<LayoutBottomNavigation>;
  Footer: React.FC<LayoutFooter>;
  BottomSpacer: React.FC<LayoutBottomSpacer>;
};

export const Layout = Object.assign(LayoutComponent, {
  Header,
  Content,
  BottomNavigation,
  Footer,
  BottomSpacer,
}) satisfies LayoutCompound;
