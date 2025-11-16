import { redirect } from "next/navigation";

import { routes } from "../../../../../../../../../../lib/routing/route-builders";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;
  redirect(routes.question({ first, second, embed }, 1));
}
