import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ first: string }> }) {
  const { first } = await params;
  redirect(`/${first}/navod`);
}
