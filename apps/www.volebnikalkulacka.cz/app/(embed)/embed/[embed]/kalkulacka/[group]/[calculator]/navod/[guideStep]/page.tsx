import { notFound } from "next/navigation";
export default async function Page({ params }: { params: Promise<{ guideStep: string }> }) {
  const guideStepInt = Number.parseInt((await params).guideStep);
  if (Number.isNaN(guideStepInt)) {
    notFound();
  }
  return <h2>Návod, guideStep: {guideStepInt}</h2>;
}
