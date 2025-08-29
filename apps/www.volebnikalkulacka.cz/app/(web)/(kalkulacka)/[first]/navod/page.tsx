import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ first: string; step: string }> }) {
  const { first, step } = await params;
  if (!step) {
    redirect(`/${first}/navod/1`);
  }
}
