import { redirect } from "next/navigation";

import { prefixGuard, routes } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string }> }) {
  const segments = await params;
  const { first } = segments;

  prefixGuard(first);

  redirect(routes.introduction(segments));
}
