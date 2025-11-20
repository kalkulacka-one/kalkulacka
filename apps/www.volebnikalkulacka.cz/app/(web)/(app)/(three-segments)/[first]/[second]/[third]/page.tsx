import { redirect } from "next/navigation";

import { prefixGuard, routes } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;

  prefixGuard(first);

  redirect(routes.introduction({ first, second, third }));
}
