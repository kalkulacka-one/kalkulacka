import "../globals.css";
import "@repo/design-system/styles";
import "@repo/design-system/themes/theme-default";
import { useQuestionsStore } from "./store";

async function fetchQuestions() {
  const res = await fetch(
    "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
  );
  const data = await res.json();
  // console.log(data);
}

fetchQuestions();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
