import Link from "next/link";

import "../globals.css";

type Params = Promise<{ lang: string }>;

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <head>
        <script defer data-domain="kalkulacka.one" src="/js/script.tagged-events.outbound-links.js" />
      </head>
      <body>
        <main className="p-4 grid gap-8">
          <header className="grid gap-2">
            <Link href="/cs">
              <h1 className="text-5xl font-semibold">Kalkulacka.1</h1>
              <p className="text-lg font-medium">
                Ta <em>pravá</em> volební kalkulačka pro miliony voličů ve 4 zemích
              </p>
            </Link>
            <nav className="flex flex-wrap gap-2">
              <Link href="/cs" className="underline hover:no-underline">
                Domů
              </Link>
              <Link href="/cs/podporte-kalkulacku" className="underline hover:no-underline">
                Podpora
              </Link>
              <Link href="/cs/zapojte-se" className="underline hover:no-underline">
                Dobrovolnictví
              </Link>
              <Link href="/cs/vlastni-kalkulacka" className="underline hover:no-underline">
                Vlastní kalkulačka
              </Link>
            </nav>
            <div className="flex flex-wrap gap-2">
              →
              <Link href="https://x.com/kalkulacka_one" className="underline hover:no-underline">
                @kalkulacka_one na X
              </Link>
            </div>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
