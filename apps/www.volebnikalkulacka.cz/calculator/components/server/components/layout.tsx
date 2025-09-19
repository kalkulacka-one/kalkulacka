type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}

export function LayoutHeader({ children }: { children: React.ReactNode }) {
  return <div className="sticky top-0 z-10">{children}</div>;
}

export function LayoutContent({ children, fullWidth = false }: { children: React.ReactNode; fullWidth?: boolean }) {
  return <main className={`${fullWidth ? "w-full" : "max-w-xl"} mx-auto p-2 sm:p-4`}>{children}</main>;
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
