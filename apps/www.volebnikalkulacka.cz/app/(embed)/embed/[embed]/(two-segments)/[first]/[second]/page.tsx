import { redirect } from "next/navigation";

import { createBaseSegment } from "../../../../../../../lib/routing/path-config";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string; second: string }> }) {
  const { embed, first, second } = await params;
  const baseSegment = createBaseSegment({ first, second, embed });
  redirect(`/${baseSegment}/navod/1`);
}
