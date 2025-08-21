import "./..//globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>
        <div className="container mx-auto p-16 flex flex-col min-h-screen">Embed Root Layout{children}</div>
      </body>
    </html>
  );
}
