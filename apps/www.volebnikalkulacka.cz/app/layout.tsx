import "./globals.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs">
      <body>
        <div className="container mx-auto flex flex-col min-h-screen">
          <header className="h-14 bg-blue-200 flex justify-center items-center">Header</header>
          <div className="flex flex-grow items-center justify-center bg-gradient-to-tr from-blue-100 to-red-100 px-4">
            <main>{children}</main>
          </div>
          <footer className="h-14 bg-blue-200 flex justify-center items-center">Footer</footer>
        </div>
      </body>
    </html>
  );
}
