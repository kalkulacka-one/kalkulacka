import type { Question } from "@repo/schema/dist";
import OtazkaComponent from "../../temp/OtazkaComponent";

type Props = {
  params: { otazkaId: string };
};

async function getData() {
  const res = await fetch(
    "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
  );
  const data = await res.json();
  return data;
}
export default async function Page({ params }: Props) {
  const questions = await getData();
  return (
    <>
      <h1>Otazky page {params.otazkaId}</h1>
      <span>ID otázky:</span>
      {questions.length > 0 &&
        questions.map((item: any) => {
          return (
            // understand type error here
            <OtazkaComponent
              key={item.id}
              statement={item.statement}
              detail={item.detail}
              id={item.id}
            />
          );
        })}
    </>
  );
}
