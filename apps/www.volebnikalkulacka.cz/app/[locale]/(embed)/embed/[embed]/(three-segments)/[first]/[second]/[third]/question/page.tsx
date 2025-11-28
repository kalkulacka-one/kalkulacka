import { redirect } from "next/navigation";

import { routes } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ locale: string; embed: string; first: string; second: string; third: string }> }) {
  const { locale, ...segments } = await params;
  redirect(routes.question(segments, 1, locale));
}
