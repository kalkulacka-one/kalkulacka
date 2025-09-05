import { redirect } from "next/navigation";

import { createBaseSegment } from "../../../../../../../lib/routing/path-config";

export default async function Page({ params }: { params: Promise<{ first: string; second: string }> }) {
  const { first, second } = await params;
  const baseSegment = createBaseSegment({ first, second });
  redirect(`/${baseSegment}/otazka/1`);
}
