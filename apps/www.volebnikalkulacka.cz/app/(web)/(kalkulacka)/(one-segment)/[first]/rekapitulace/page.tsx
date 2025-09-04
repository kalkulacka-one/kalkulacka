import { ReviewPage } from "../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ first: string }> }) {
  const { first } = await params;

  const navigationNextPath = async () => {
    "use server";
    return `/${first}/vysledek`;
  };

  return <ReviewPage navigationNextPath={navigationNextPath} />;
}
