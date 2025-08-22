import "./../../../globals.css";
import { getTheme } from "./getTheme";

import Provider from "./provider";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ embed: string; kalkulacka: string }>;
}) {
  const { embed } = await params;

  return (
    <html lang="cs">
      <body>
        <Provider name={embed}>
          <div className="container mx-auto p-16 flex flex-col min-h-screen">
            <span className="text-[var(--ko-palette-primary)]">Param for theme: "{embed}"</span>
            <main>{children}</main>
          </div>
        </Provider>
      </body>
    </html>
  );
}
