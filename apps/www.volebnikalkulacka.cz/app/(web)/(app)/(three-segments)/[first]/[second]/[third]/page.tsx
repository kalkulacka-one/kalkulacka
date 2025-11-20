import { notFound, redirect } from "next/navigation";

import { isAllowedPrefix } from "@/lib/routing/allowed-prefixes";
import { routes } from "../../../../../../../lib/routing/route-builders";

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;

  // Validate prefix
  if (!isAllowedPrefix(first)) {
    notFound();
  }

  redirect(routes.introduction({ first, second, third }));
}
