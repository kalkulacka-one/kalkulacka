import { notFound } from "next/navigation";
import NavodPage from "../../../../../../../../calculator/components/navod/navodPage";
export default async function Page({ params }: { params: Promise<{ guideStep: string }> }) {
  const guideStepInt = Number.parseInt((await params).guideStep);
  if (Number.isNaN(guideStepInt)) {
    notFound();
  }
  return <NavodPage guideStep={guideStepInt} />;
}
