import "../globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import { StoreProvider } from "./providers/storeProvider";
import UrlUpdater from "./utils/urlUpdater";
import getQuestions from "./utils/getQuestions";
import Header from "./header";
import ClientBlobs from "./clientBlobs";

const baseUrl =
  "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json";

const questions = await getQuestions(baseUrl);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <StoreProvider questions={questions}>
        <UrlUpdater>
          <body>
            {/* blob container */}
            <div className="grid size-full">
              {/* root layout */}
              <div className="relative grid min-h-screen">
                {/* <Header /> */}
                {children}
              </div>
            </div>
          </body>
        </UrlUpdater>
      </StoreProvider>
    </html>
  );
}
