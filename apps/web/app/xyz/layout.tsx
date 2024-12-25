import "../globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import KalkulackaInitializer from "./KalkulackaInitializer";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  async function fetchQuestions() {
    "use server";
    const res = await fetch(
      // AT questions test: https://www.wahlrechner.at/data/instance/wahlrechner.at/nationalratswahl-2024/wahlrechner/questions.json
      "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
    );
    const data = await res.json();
    return data;
  }

  const testQuestions = await fetchQuestions();
  return (
    <html lang="en">
      <body>
        <KalkulackaInitializer testQuestions={testQuestions}>
          {children}
        </KalkulackaInitializer>
      </body>
    </html>
  );
}
