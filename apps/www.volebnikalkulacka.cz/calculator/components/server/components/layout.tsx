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
