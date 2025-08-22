import "../../globals.css";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ kalkulacka: string }>;
}) {
  const { kalkulacka } = await params;
  return (
    <html lang="cs">
      <body>
        <div className="container mx-auto p-16 flex flex-col min-h-screen">
          <span>Param for election fetch: "{kalkulacka}"</span>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
