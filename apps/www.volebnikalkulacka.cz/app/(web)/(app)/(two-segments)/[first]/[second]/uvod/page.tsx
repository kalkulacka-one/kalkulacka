import { IntroductionPageWithRouting } from "../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  return <IntroductionPageWithRouting segments={{ first, second }} />;
}
