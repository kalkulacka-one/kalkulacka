import {
  ClientBottomBar,
  ClientQuestionWrapper,
} from "../../temp/ClientWrapper";

export default async function Page() {
  const res = await fetch(
    "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
  );

  const data = await res.json();

  console.log(data);

  return (
    <div>
      {data.map((item) => (
        <span>{item.title}</span>
      ))}
      <ClientQuestionWrapper />
      <ClientBottomBar />
    </div>
  );
}
