import { notFound } from "next/navigation";

import type { I18nParams } from "@/i18n/params";

export default async function Page({ params }: { params: I18nParams }) {
  const { locale } = await params;

  try {
    const Component = (await import(`./page.${locale}`)).default;
    return <Component />;
  } catch {
    notFound();
  }
}
