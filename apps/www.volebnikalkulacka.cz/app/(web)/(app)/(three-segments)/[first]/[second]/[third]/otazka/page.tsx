import { redirect } from "next/navigation";

import { routes } from "../../../../../../../../lib/routing/route-builders";

export default async function Page({ params }: { params: Promise<{ first: string; second: string; third: string }> }) {
  const { first, second, third } = await params;
  redirect(routes.question({ first, second, third }, 1));
}
