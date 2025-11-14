import { redirect } from "next/navigation";

import { routes } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ first: string }> }) {
  const { first } = await params;
  redirect(routes.question({ first }, 1));
}
