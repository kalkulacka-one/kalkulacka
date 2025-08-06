import { notFound } from "next/navigation";
import Czech from "./page.cs";
import English from "./page.en";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
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
