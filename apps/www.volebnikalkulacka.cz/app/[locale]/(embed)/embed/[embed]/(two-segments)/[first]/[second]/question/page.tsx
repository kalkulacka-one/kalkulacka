import { redirect } from "next/navigation";
import type { Locale } from "next-intl";

import { routes } from "@/lib/routing";

export default async function Page({ params }: { params: Promise<{ locale: Locale; embed: string; first: string; second: string }> }) {
  const { locale, ...segments } = await params;
  redirect(routes.question(segments, 1, locale));
}
