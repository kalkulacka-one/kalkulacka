import "../globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import { StoreProvider } from "./providers/storeProvider";
import UrlUpdater from "./utils/urlUpdater";
import getQuestions from "./utils/getQuestions";
import Header from "./header";

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
            {/* implementation sticky but does not make sense, ask  */}
            <Header />
            {children}
          </body>
        </UrlUpdater>
      </StoreProvider>
    </html>
  );
}
