import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;
  redirect(`/${first}/${second}/navod`);
}
