import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.kontakt");
  return { title: t("meta-title") };
}

export default async function Page() {
  const t = await getTranslations("pages.kontakt");

  return <h1>{t("heading")}</h1>;
}
