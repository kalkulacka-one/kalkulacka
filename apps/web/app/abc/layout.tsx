import "../globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import { CounterStoreProvider } from "./providers/counterStoreProvider";
import UrlUpdater from "./utils/urlUpdater";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <CounterStoreProvider>
        <UrlUpdater>
          <body>{children}</body>
        </UrlUpdater>
      </CounterStoreProvider>
    </html>
  );
}
