import { ReviewPage } from "../../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;

  const navigationNextPath = async () => {
    "use server";
    return `/embed/${embed}/${first}/${second}/vysledek`;
  };

  return <ReviewPage navigationNextPath={navigationNextPath} />;
}
