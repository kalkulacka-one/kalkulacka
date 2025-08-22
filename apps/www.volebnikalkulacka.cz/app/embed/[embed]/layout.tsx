import "./../../globals.css";
import { getThemeStyles } from "../themeProvider";

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ embed: string }>;
}) {
  const { embed } = await params;
  const themeStyle = getThemeStyles(embed);
  return (
    <html lang="cs">
      <body>
        <style>{themeStyle}</style>
        <main>{children}</main>
      </body>
    </html>
  );
}
