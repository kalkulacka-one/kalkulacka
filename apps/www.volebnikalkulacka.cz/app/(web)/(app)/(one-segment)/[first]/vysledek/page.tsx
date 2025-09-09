import { ResultPageWithRouting } from "../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ first: string }> }) {
  const { first } = await params;

  return <ResultPageWithRouting segments={{ first }} />;
}
