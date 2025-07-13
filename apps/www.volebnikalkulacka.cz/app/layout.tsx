import "./globals.css";
import { Logo } from "@repo/design-system/client";
import { LogoCeskoDigital } from "./logo-ceskodigital";
import { LogoKohoVolit } from "./logo-kohovolit";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>
        <div className="container mx-auto p-8 sm:p-16 flex flex-col min-h-screen">
          <header className="h-14 flex">
            <Logo title="Volební kalkulačka" text />
          </header>
          <div className="flex flex-grow items-center justify-center">
            <main>{children}</main>
          </div>
          <footer className="h-14 flex-col sm:flex-row flex justify-start items-center gap-4">
            <p className="text-sm">Vytvořeno spoluprací neziskových organizací.</p>
            <a className="flex items-center gap-2 after:content-['_↗'] hover:underline" href="https://www.facebook.com/KohoVolit.eu">
              <LogoKohoVolit className="h-[28px] w-[93px] shrink-0" />
            </a>
            <a className="flex items-center gap-2 after:content-['_↗'] hover:underline" href="https://cesko.digital/">
              <LogoCeskoDigital className="h-[20px] w-[96px] shrink-0" />
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
