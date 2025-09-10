import { ResultPageWithRouting } from "../../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;

  return <ResultPageWithRouting segments={{ first, second, embed }} />;
}
