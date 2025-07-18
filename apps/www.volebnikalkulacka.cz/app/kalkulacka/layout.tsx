import { Button } from "@repo/design-system/client";
import "./../globals.css";
import Link from "next/link";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>
        <div className="container mx-auto p-16 flex flex-col min-h-screen">
          <header className="h-14 flex items-center justify-between">
            <div>Logo</div>
            <div>Parlamentní volby 2025</div>
            <Link href="/">
              <Button variant="link" color="neutral">
                Zpět na hlavní stránku
              </Button>
            </Link>
          </header>
          <div className="flex flex-grow items-center justify-center w-full">
            <main className="w-full">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
