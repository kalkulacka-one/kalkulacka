type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}

export function LayoutHeader({ children }: { children: React.ReactNode }) {
  return <div className="sticky top-0">{children}</div>;
}

export function LayoutContent({ children }: { children: React.ReactNode }) {
  return <main className="max-w-xl mx-auto px-4 py-6">{children}</main>;
}

export function LayoutBottomNavigation({ children, spacer = "5rem" }: { children: React.ReactNode; spacer?: string | false }) {
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
