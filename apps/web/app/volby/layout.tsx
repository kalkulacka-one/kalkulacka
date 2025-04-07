import "../globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";

import { ElectionStoreProvider } from "../stores/electionStore";
import Header from "./header";

export default async function RootLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { district: string };
}) {
  const district = params.district;
  return (
    <html lang="en">
      <ElectionStoreProvider>
        <body>
          {/* blob container */}
          <div className="relative grid size-full">
            {/* root layout */}
            <div className="flex min-h-screen flex-col">
              <Header district={district} />
              {children}
            </div>
          </div>
        </body>
      </ElectionStoreProvider>
    </html>
  );
}
