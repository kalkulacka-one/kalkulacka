import { twMerge } from "@/utilities/tailwind";

export type Layout = {
  children: React.ReactNode;
};

function LayoutComponent({ children }: Layout) {
  return <div className="koa:min-h-screen koa:grid koa:grid-rows-[auto_1fr_auto]">{children}</div>;
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
  return <div className={twMerge("koa:fixed koa:bottom-0 koa:left-0 koa:right-0 koa:pointer-events-none koa:z-20", className)}>{children}</div>;
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
