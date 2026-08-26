import { twMerge } from "@kalkulacka-one/design-system/utilities";

export type Layout = {
  children: React.ReactNode;
};

function LayoutComponent({ children }: Layout) {
  return <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">{children}</div>;
}

LayoutComponent.displayName = "Layout";

export type LayoutHeader = {
  children: React.ReactNode;
  fixed?: boolean;
};

function Header({ children, fixed }: LayoutHeader) {
  return <div className={` ${fixed ? "fixed left-0 w-full" : "sticky"} top-0 z-50`}>{children}</div>;
}

Header.displayName = "Layout.Header";

export type LayoutContent = {
  children: React.ReactNode;
  fullWidth?: boolean;
  fixed?: boolean;
};

function Content({ children, fullWidth }: LayoutContent) {
  return <main className={`${fullWidth ? "w-full" : "max-w-xl w-full"} mx-auto p-2 sm:p-4`}>{children}</main>;
}

Content.displayName = "Layout.Content";

export type LayoutBottomNavigation = {
  children: React.ReactNode;
  className?: string;
};

function BottomNavigation({ children, className }: LayoutBottomNavigation) {
  return <div className={twMerge("fixed bottom-0 left-0 right-0 pointer-events-none z-20", className)}>{children}</div>;
}

BottomNavigation.displayName = "Layout.BottomNavigation";

export type LayoutFooter = {
  children: React.ReactNode;
};

function Footer({ children }: LayoutFooter) {
  if (!children) {
    return null;
  }
  return <footer className="grid justify-items-center fixed bottom-0 left-0 right-0 z-5 mt-2 sm:mt-3 lg:mt-4 p-1">{children}</footer>;
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
