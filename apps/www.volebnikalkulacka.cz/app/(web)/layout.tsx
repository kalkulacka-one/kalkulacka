import { Logo } from "@repo/design-system/client";

import "../globals.css";
import { ThemeProvider } from "../../components/client";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <ThemeProvider name="default">
          <div className="container mx-auto p-16 flex flex-col min-h-screen">
            <header className="h-14 flex">
              <Logo title="Volební kalkulačka" text />
            </header>
            <div className="flex flex-grow items-center justify-center">
              <main>{children}</main>
            </div>
            <footer className="h-14 flex justify-start items-center">
              <p>Vytvořeno spoluprací neziskových organizací.</p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
