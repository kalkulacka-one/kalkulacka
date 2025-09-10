import { IntroductionPageWithRouting } from "../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ first: string; embed: string }> }) {
  const { first, embed } = await params;

  return <IntroductionPageWithRouting segments={{ first, embed }} />;
}
