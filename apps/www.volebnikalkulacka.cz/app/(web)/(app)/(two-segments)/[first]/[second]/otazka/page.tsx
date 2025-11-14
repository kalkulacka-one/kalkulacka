import { redirect } from "next/navigation";

import { routes } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;
  redirect(routes.question({ first, second }, 1));
}
