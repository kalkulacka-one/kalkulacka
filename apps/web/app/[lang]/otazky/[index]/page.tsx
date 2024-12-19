// import OtazkaComponent from "../../../temp/OtazkaComponent";
import QuestionPageWrapper from "../../../temp/QuestionPageWrapper";

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

async function getQuestionsLength() {
  const res = await fetch(
    "https://www.volebnikalkulacka.cz/data/instance/volebnikalkulacka.cz/krajske-2024/10-jihomoravsky/questions.json",
  );
  const data = await res.json();
  return data.length;
}

export default async function Page({ params }) {
  const question = await getQuestion(params.index);
  const questionLength = await getQuestionsLength();
  console.log(questionLength);
  return (
    <div>
      {/* <OtazkaComponent
        key={question.id}
        statement={question.statement}
        detail={question.detail}
      /> */}
      <QuestionPageWrapper
        questions={question}
        currentQuestion={params.index}
        questionCount={questionLength}
      />
    </div>
  );
}
