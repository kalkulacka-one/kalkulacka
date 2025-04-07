import RecapInject from "./recapInject";
import getQuestions from "../../../utils/getQuestions";

export default async function RecapLayout({
  params,
  children,
}: {
  children: React.ReactNode;
  params: { district: string };
}) {
  const district = params.district;
  const data = await getQuestions(district);
  const questions = data;

  return (
    <>
      <RecapInject questions={questions} />
      {children}
    </>
  );
}
