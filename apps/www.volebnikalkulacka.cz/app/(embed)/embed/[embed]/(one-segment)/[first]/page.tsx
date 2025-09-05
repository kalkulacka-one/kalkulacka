import { redirect } from "next/navigation";

import { createBaseSegment } from "../../../../../../lib/routing/path-config";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const { embed, first } = await params;
  const baseSegment = createBaseSegment({ first, embed });
  redirect(`/${baseSegment}/navod/1`);
}
