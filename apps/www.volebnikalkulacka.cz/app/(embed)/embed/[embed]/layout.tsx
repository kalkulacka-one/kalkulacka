import "@/app/globals.css";

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
        <div>
          <span>Embed: `{embed}`</span>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
