type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}

export function LayoutBottomNavigation({ children }: { children: React.ReactNode }) {
  return <div className="fixed bottom-0">{children}</div>;
}
