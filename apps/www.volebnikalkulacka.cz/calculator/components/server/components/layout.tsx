type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">{children}</div>;
}

export function LayoutHeader({ children }: { children: React.ReactNode }) {
  return <div className="sticky top-0">{children}</div>;
}

export function LayoutBottomNavigation({ children }: { children: React.ReactNode }) {
  return <div className="fixed bottom-0 left-0 right-0">{children}</div>;
}
