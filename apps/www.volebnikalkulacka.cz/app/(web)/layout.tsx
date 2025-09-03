import "../globals.css";

import { ThemeProvider } from "../../components/client";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>
        <ThemeProvider name="default">{children}</ThemeProvider>
      </body>
    </html>
  );
}
