import { ResultPageWithRouting } from "../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const { embed, first } = await params;

  return <ResultPageWithRouting segments={{ first, embed }} />;
}
