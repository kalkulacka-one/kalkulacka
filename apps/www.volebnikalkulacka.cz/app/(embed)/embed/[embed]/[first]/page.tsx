import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ embed: string; first: string }>;
}) {
  const { embed, first } = await params;
  redirect(`/embed/${embed}/${first}/navod`);
}
