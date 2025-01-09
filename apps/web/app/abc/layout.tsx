import "../globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import { StoreProvider } from "./providers/storeProvider";
import UrlUpdater from "./utils/urlUpdater";

const collection = ["Collection 1", "Collection 2", "Collection 3"];

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(collection);
  return (
    <html lang="en">
      <StoreProvider collection={collection}>
        <UrlUpdater>
          <body>{children}</body>
        </UrlUpdater>
      </StoreProvider>
    </html>
  );
}
