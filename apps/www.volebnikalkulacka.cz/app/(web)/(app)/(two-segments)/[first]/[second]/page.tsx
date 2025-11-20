import { redirect } from "next/navigation";

import { allowedPrefixGuard, isAllowedPrefix, routes } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  if (isAllowedPrefix(first)) {
    allowedPrefixGuard(first);
  }

  redirect(routes.introduction({ first, second }));
}
