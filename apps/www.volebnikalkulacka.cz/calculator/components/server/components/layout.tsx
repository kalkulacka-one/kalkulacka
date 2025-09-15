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
  return <div className="sticky top-0 z-10">{children}</div>;
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
  spacer?: string | false;
};

function BottomNavigation({ children, spacer = "5rem" }: LayoutBottomNavigation) {
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none">{children}</div>
      {spacer && (
        <style jsx global>{`
          body {
            padding-bottom: ${spacer};
          }
        `}</style>
      )}
    </>
  );
}

BottomNavigation.displayName = "Layout.BottomNavigation";

export type LayoutFooter = {
  children: React.ReactNode;
};

function Footer({ children }: LayoutFooter) {
  return <footer className="grid justify-items-center mt-2 sm:mt-3 lg:mt-4">{children}</footer>;
}

Footer.displayName = "Layout.Footer";

type LayoutCompound = React.FC<Layout> & {
  Header: React.FC<LayoutHeader>;
  Content: React.FC<LayoutContent>;
  BottomNavigation: React.FC<LayoutBottomNavigation>;
  Footer: React.FC<LayoutFooter>;
};

export const Layout = Object.assign(LayoutComponent, {
  Header,
  Content,
  BottomNavigation,
  Footer,
}) satisfies LayoutCompound;
