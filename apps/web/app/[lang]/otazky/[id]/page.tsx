import OtazkaComponent from "../../../temp/OtazkaComponent";

export async function generateStaticParams() {
  const res = await fetch(
    "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
  );
  const data = await res.json();

  return data.map((question) => ({
    id: question.id,
  }));
}

async function getQuestion(id) {
  const res = await fetch(
    "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
  );
  const data = await res.json();
  const question = data.filter((question) => question.id === id);
  return question;
}

export default async function Page({ params }) {
  const questionArray = await getQuestion(params.id);
  // convert object to array
  const convertArrayToObject = (array) => {
    if (array.length === 1) {
      return array[0];
    }
    throw "Array containt more than 1 item!";
  };
  const question = await convertArrayToObject(questionArray);
  console.log(questionArray);
  return (
    <OtazkaComponent
      key={question.id}
      statement={question.statement}
      detail={question.detail}
    />
  );
}
