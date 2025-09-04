import { ReviewPage } from "../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const { embed, first } = await params;

  const navigationNextPath = async () => {
    "use server";
    return `/embed/${embed}/${first}/vysledek`;
  };

  return <ReviewPage navigationNextPath={navigationNextPath} />;
}
