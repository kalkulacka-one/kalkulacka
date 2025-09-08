import type { Metadata } from "next";
import Link from "next/link";

import "../globals.css";

import { ThemeProvider } from "../../components/client";

export const metadata: Metadata = {
  title: {
    default: "Volební kalkulačka",
    template: "%s — Volební kalkulačka",
  },
  description: "Nejužitečnějších 5 minut před parlamentními volbami 2025",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <ThemeProvider name="default">
          <nav>
            <Link href="/">Domů</Link>
            <Link href="/o-nas">O nás</Link>
            <Link href="/metodika">Metodika</Link>
            <Link href="/soukromi">Ochrana soukromí</Link>
            <Link href="/kontakt">Kontakt</Link>
          </nav>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
