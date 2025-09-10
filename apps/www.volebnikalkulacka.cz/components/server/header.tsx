import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0">
      <h1>Volební kalkulačka</h1>
      <div>
        <nav>
          <Link href="/">Domů</Link>
          <Link href="/o-nas">O nás</Link>
          <Link href="/metodika">Metodika</Link>
          <Link href="/soukromi">Ochrana soukromí</Link>
          <Link href="/kontakt">Kontakt</Link>
        </nav>
      </div>
    </header>
  );
}
