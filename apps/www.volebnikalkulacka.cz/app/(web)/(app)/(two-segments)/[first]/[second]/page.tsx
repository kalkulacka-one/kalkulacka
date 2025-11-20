import { redirect } from "next/navigation";

import { prefixGuard, isPrefix, routes } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  if (isPrefix(first)) {
    prefixGuard(first);
  }

  redirect(routes.introduction({ first, second }));
}
