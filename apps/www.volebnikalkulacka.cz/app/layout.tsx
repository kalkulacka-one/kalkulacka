import "./globals.css";
import { Logo } from "@repo/design-system/client";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>
        <div className="ko:container ko:mx-auto ko:flex ko:flex-col ko:min-h-screen">
          <header className="ko:h-14 ko:flex">
            <Logo title="Volební kalkulačka" text />
          </header>
          <div className="ko:flex ko:flex-grow ko:items-center ko:justify-center ko:bg-gradient-to-tr ko:from-blue-100 ko:to-red-100 px-4">
            <main>{children}</main>
          </div>
          <footer className="ko:h-14 ko:bg-blue-200 ko:flex ko:justify-center ko:items-center">Footer</footer>
        </div>
      </body>
    </html>
  );
}
