import { IntroductionPageWithRouting } from "../../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ first: string; second: string; embed: string }> }) {
  const { first, second, embed } = await params;

  return <IntroductionPageWithRouting segments={{ first, second, embed }} />;
}
