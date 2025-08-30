import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;
  redirect(`/embed/${embed}/${first}/${second}/navod`);
}
