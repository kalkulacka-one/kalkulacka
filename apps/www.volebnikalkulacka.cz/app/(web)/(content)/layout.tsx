export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <h1>Volební kalkulačka</h1>
        <nav>
          <a href="/">Domů</a>
          <a href="/o-nas">O nás</a>
          <a href="/metodika">Metodika</a>
          <a href="/soukromi">Ochrana soukromí</a>
          <a href="/kontakt">Kontakt</a>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
