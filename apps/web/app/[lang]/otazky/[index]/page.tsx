import OtazkaComponent from "../../../temp/OtazkaComponent";

export async function generateStaticParams() {
  const res = await fetch(
    "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
  );
  const data = await res.json();

  return data.map((_, index) => ({
    index: index.toString(),
  }));
}

async function getQuestion(index) {
  const res = await fetch(
    "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
  );
  const data = await res.json();
  return data[index];
}

export default async function Page({ params }) {
  const question = await getQuestion(params.index);
  console.log(question);
  return (
    <OtazkaComponent
      key={question.id}
      statement={question.statement}
      detail={question.detail}
    />
  );
}
