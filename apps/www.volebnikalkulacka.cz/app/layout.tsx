import "./globals.css";
import { Logo } from "@repo/design-system/client";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body className="ko:bg-gradient-to-r ko:from-sky-100 ko:to-red-50">
        <div className="ko:container ko:mx-auto ko:px-4 ko:lg:px-8 ko:py-4 ko:flex ko:flex-col ko:min-h-screen">
          <header className="ko:h-14 ko:flex ko:bg-transparent">
            <Logo title="Volební kalkulačka" text />
          </header>
          <div className="ko:flex ko:flex-grow ko:items-center ko:justify-center">
            <main>{children}</main>
          </div>
          <footer className="ko:h-14 ko:flex ko:justify-start ko:items-center">
            <p className="ko:text-sm ko:leading-[1.23] ko:opacity-60">Vytvořeno spoluprací neziskových organizací.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
