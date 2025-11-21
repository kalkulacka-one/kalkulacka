import { redirect } from "next/navigation";

import { isPrefix, prefixGuard, routes } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const segments = await params;
  const { first } = segments;

  if (isPrefix(first)) {
    prefixGuard(first);
  }

  redirect(routes.introduction(segments));
}
