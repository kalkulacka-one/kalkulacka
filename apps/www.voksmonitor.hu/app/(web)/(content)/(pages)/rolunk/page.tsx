import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { DonateCard } from "../../../../../calculator/components/client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.rolunk");
  return { title: t("meta-title") };
}

export default async function Page() {
  const t = await getTranslations("pages.rolunk");

  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">{t("about-kmonitor-heading")}</h2>

      {t("about-kmonitor")
        .split("\n")
        .map((para, i) => (
          <p key={i} className="text-lg text-gray-700 leading-relaxed mb-0">
            {para}
          </p>
        ))}

      <p className="text-lg text-gray-700 leading-relaxed mb-0">
        {t.rich("about-kmonitor-links", {
          website: (chunks) => (
            <a href="https://k-monitor.hu" className="font-semibold text-gray-900">
              {chunks}
            </a>
          ),
          blog: (chunks) => (
            <a href="https://k.blog.hu" className="font-semibold text-gray-900">
              {chunks}
            </a>
          ),
        })}
      </p>

      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">{t("support-heading")}</h2>

      <p className="text-lg text-gray-700 leading-relaxed mb-6">{t("support-text")}</p>
      <DonateCard />
    </div>
  );
}
