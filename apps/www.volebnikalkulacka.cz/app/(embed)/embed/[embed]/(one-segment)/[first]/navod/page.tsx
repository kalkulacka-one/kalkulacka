import { GuidePageWithRouting } from "../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ first: string; embed: string }> }) {
  const { first, embed } = await params;

  return <GuidePageWithRouting segments={{ first, embed }} />;
}
