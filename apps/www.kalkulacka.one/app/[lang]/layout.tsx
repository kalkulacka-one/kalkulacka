import { IntlProvider } from "@repo/design-system/client";
// import { ClientTest } from "@repo/design-system/client";
import Link from "next/link";
import getIntl from "../server/getIntl";
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

  const intl = await getIntl(lang);

  console.log(intl);

  // TODO:
  // 4. Translation keys tests / types (look up formatjs/cli)
  // 5. hooks in client components and memoization
  // 6. Fallbacks
  // 7. Switcher

  return (
    <IntlProvider locale={intl.locale} messages={intl.messages}>
      <html lang={lang}>
        <head>
          <script defer data-domain="kalkulacka.one" src="/js/script.tagged-events.outbound-links.js" />
        </head>
        <body>
          <main className="p-4 grid gap-8">
            <header className="grid gap-2">
              <Link href="/cs">
                <h1 className="text-5xl font-semibold">{intl.formatMessage({ id: "header.title" })}</h1>
                <p className="text-lg font-medium">{intl.formatMessage({ id: "header.tagline" }, { em: (chunks) => <em>{chunks}</em> })}</p>
              </Link>
              <nav className="flex flex-wrap gap-2">
                <Link href="/cs" className="underline hover:no-underline">
                  {intl.formatMessage({
                    id: "navigation.home",
                  })}
                </Link>
                <Link href="/cs/podporte-kalkulacku" className="underline hover:no-underline">
                  {intl.formatMessage({
                    id: "navigation.support",
                  })}
                </Link>
                <Link href="/cs/zapojte-se" className="underline hover:no-underline">
                  {intl.formatMessage({
                    id: "navigation.volunteer",
                  })}
                </Link>
                <Link href="/cs/vlastni-kalkulacka" className="underline hover:no-underline">
                  {intl.formatMessage({
                    id: "navigation.customCalculator",
                  })}
                </Link>
              </nav>
              <div className="flex flex-wrap gap-2">
                →
                <Link href="https://x.com/kalkulacka_one" className="underline hover:no-underline">
                  {intl.formatMessage({
                    id: "social.twitterLink",
                  })}
                </Link>
              </div>
            </header>
            {children}
          </main>
        </body>
      </html>
    </IntlProvider>
  );
}
