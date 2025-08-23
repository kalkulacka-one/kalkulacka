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
        <div>
          <span>Calculator: "{calculator}"</span>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
