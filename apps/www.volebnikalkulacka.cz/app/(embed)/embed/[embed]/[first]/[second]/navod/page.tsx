import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string; step: string }> }) {
  const { embed, first, second, step } = await params;
  if (!step) {
    redirect(`/embed/${embed}/${first}/${second}/navod/1`);
  }
}
