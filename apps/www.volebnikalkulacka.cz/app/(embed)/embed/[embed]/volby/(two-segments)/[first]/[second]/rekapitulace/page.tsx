import { ReviewPageWithRouting } from "../../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;

  return <ReviewPageWithRouting segments={{ first, second, embed }} />;
}
