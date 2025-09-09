export function AppHeader({ children }: { children: React.ReactNode }) {
  return <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">{children}</header>;
}
