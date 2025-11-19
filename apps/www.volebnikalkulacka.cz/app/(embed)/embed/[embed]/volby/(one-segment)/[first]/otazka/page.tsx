import { redirect } from "next/navigation";

import { routes } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const { embed, first } = await params;
  redirect(routes.question({ first, embed }, 1));
}
