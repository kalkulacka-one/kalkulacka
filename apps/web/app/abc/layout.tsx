import "../globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import { StoreProvider } from "./providers/storeProvider";
import UrlUpdater from "./utils/urlUpdater";
import getQuestions from "./utils/getQuestions";

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
            <header className="flex h-10 items-center justify-center bg-primary">
              Header
            </header>
            {children}
          </body>
        </UrlUpdater>
      </StoreProvider>
    </html>
  );
}
