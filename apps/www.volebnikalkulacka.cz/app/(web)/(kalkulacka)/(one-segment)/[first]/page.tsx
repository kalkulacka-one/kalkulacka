import { redirect } from "next/navigation";

import { createBaseSegment } from "../../../../../lib/routing/path-config";

export default async function Page({ params }: { params: Promise<{ first: string }> }) {
  const { first } = await params;
  const baseSegment = createBaseSegment({ first });
  redirect(`/${baseSegment}/navod/1`);
}
