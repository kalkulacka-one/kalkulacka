export type Layout = {
  children: React.ReactNode;
};

function LayoutComponent({ children }: Layout) {
  return <>{children}</>;
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
      <div className="fixed bottom-0 left-0 right-0">{children}</div>
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

type LayoutCompound = React.FC<Layout> & {
  Header: React.FC<LayoutHeader>;
  Content: React.FC<LayoutContent>;
  BottomNavigation: React.FC<LayoutBottomNavigation>;
};

export const Layout = Object.assign(LayoutComponent, {
  Header,
  Content,
  BottomNavigation,
}) satisfies LayoutCompound;
