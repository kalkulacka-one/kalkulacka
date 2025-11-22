import { redirect } from "next/navigation";

import { routes } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ embed: string; first: string }> }) {
  const segments = await params;
  redirect(routes.introduction(segments));
}
