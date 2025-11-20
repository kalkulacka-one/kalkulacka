import { redirect } from "next/navigation";

import { allowedPrefixGuard, routes } from "@/lib/routing";

// TODO: Election landing page
export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;

  allowedPrefixGuard(first);

  redirect(routes.introduction({ first, second }));
}
