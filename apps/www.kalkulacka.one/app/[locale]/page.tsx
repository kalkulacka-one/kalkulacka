import { notFound } from "next/navigation";

import type { I18nParams } from "../i18n/params";
import Czech from "./page.cs";
import English from "./page.en";

export default async function Page({ params }: { params: I18nParams }) {
  const { locale } = await params;
  switch (locale) {
    case "en":
      return <English />;
    case "cs":
      return <Czech />;
    default:
      notFound();
  }
}
