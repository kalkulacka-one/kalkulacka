import "../globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";

import { ElectionStoreProvider } from "../stores/electionStore";
import Header from "./header/header";
import ClientBlobs from "./clientBlobs";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ElectionStoreProvider>
        <body>
          {/* blobs container */}
          <div className="relative grid size-full">
            <ClientBlobs />
            {/* root layout */}
            <div className="grid min-h-screen">
              {/* sticky header layout */}
              <div
                className="grid grid-rows-[auto_auto_1fr]"
                style={{ gridTemplateAreas: `"header" "sticky-header" "main"` }}
              >
                <Header />
                {/* main */}
                {children}
              </div>
            </div>
          </div>
        </body>
      </ElectionStoreProvider>
    </html>
  );
}
