import "./../../../globals.css";

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
        <div className="container mx-auto p-16 flex flex-col min-h-screen">
          <span>Param for theme: "{embed}"</span>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
