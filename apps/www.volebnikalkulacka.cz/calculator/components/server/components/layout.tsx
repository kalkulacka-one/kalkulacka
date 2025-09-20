export type Layout = {
  children: React.ReactNode;
};

function LayoutComponent({ children }: Layout) {
  return <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">{children}</div>;
}

LayoutComponent.displayName = "Layout";

export type LayoutHeader = {
  children: React.ReactNode;
};

function Header({ children }: LayoutHeader) {
  return <div className="sticky top-0 z-20">{children}</div>;
}

Header.displayName = "Layout.Header";

export type LayoutContent = {
  children: React.ReactNode;
};

function Content({ children }: LayoutContent) {
  return <main className="max-w-xl mx-auto p-2 sm:p-4">{children}</main>;
}

Content.displayName = "Layout.Content";

export type LayoutBottomNavigation = {
  children: React.ReactNode;
};

function BottomNavigation({ children }: LayoutBottomNavigation) {
  return <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-10">{children}</div>;
}

BottomNavigation.displayName = "Layout.BottomNavigation";

export type LayoutFooter = {
  children: React.ReactNode;
};

function Footer({ children }: LayoutFooter) {
  if (!children) {
    return null;
  }
  return <footer className="grid justify-items-center mt-2 sm:mt-3 lg:mt-4 fixed bottom-0 left-0 right-0">{children}</footer>;
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
