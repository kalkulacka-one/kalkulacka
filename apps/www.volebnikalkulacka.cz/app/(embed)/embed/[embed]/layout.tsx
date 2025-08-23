import "../../../globals.css";

import { ThemeProvider } from "../../../../components/client";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ embed: string }>;
}) {
  const { embed } = await params;
  return (
    <html lang="cs">
      <body>
        <ThemeProvider name={embed}>
          <div>
            <span className="text-[var(--ko-palette-primary)]">Embed: `{embed}`</span>
            <main>{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
