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
  return <main className="px-4 py-6">{children}</main>;
}

export function LayoutBottomNavigation({ children }: { children: React.ReactNode }) {
  return <div className="fixed bottom-0 left-0 right-0">{children}</div>;
}
