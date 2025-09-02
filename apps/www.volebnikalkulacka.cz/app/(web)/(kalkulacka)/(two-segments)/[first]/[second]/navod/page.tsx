import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ first: string; second: string; step: string }> }) {
  const { first, second, step } = await params;
  if (!step) {
    redirect(`/${first}/${second}/navod/1`);
  }
}
