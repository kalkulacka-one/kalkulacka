type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <div>
      <header>Volební kalkulačka</header>
      <main>{children}</main>
    </div>
  );
}

export function LayoutBottomNavigation({ children }: { children: React.ReactNode }) {
  return <div className="fixed bottom-0">{children}</div>;
}
