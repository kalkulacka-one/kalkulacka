import "@/app/globals.css";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ calculator: string }>;
}) {
  const { calculator } = await params;
  return (
    <html lang="cs">
      <body>
        <div className="container mx-auto p-16 flex flex-col min-h-screen">
          <span>Calculator: "{calculator}"</span>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
