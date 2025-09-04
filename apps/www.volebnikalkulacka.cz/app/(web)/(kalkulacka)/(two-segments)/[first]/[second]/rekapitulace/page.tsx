import { ReviewPage } from "../../../../../../../components/client";

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  const navigationNextPath = async () => {
    "use server";
    return `/${first}/${second}/vysledek`;
  };

  return <ReviewPage navigationNextPath={navigationNextPath} />;
}
