import "../globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import { StoreProvider } from "./providers/storeProvider";
import UrlUpdater from "./utils/urlUpdater";
import getQuestions from "./utils/getQuestions";

// const baseUrl = "https://dummyjson.com/c/7ee4-a7f4-4977-bb54";

const baseUrlKalk =
  "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json";

const questions = await getQuestions(baseUrlKalk);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <StoreProvider questions={questions}>
        <UrlUpdater>
          <body>{children}</body>
        </UrlUpdater>
      </StoreProvider>
    </html>
  );
}
