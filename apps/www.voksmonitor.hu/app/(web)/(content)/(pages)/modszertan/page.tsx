import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { DonateCard } from "../../../../../calculator/components/client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.modszertan");
  return { title: t("meta-title") };
}

export default async function Page() {
  const t = await getTranslations("pages.modszertan");

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      <h1 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-3xl md:text-4xl mb-8">{t("heading")}</h1>
      <div className="prose prose-gray max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          {t.rich("p1", {
            kmonitor: (chunks) => <strong className="font-semibold text-gray-900">{chunks}</strong>,
            kohopolit: (chunks) => <strong className="font-semibold text-gray-900">{chunks}</strong>,
            website: (chunks) => (
              <a href="https://k-monitor.hu" target="_blank" className="font-semibold text-gray-900" rel="noopener noreferrer">
                {chunks}
              </a>
            ),
            koho: (chunks) => (
              <a href="https://kohovolit.eu/" target="_blank" className="font-semibold text-gray-900" rel="noopener noreferrer">
                {chunks}
              </a>
            ),
            vox: (chunks) => (
              <a href="https://www.facebook.com/valasztasi.kalauz/" target="_blank" className="font-semibold text-gray-900" rel="noopener noreferrer">
                {chunks}
              </a>
            ),
          })}
        </p>
        {(() => {
          const richBody = t.rich("body", {
            website: (chunks) => (
              <a href="https://k-monitor.hu" target="_blank" rel="noopener noreferrer">
                {chunks}
              </a>
            ),
          });
          if (typeof richBody === "string") {
            return richBody.split("\n").map((para, i) => (
              <p key={i} className="text-lg text-gray-700 leading-relaxed mb-6">
                {para}
              </p>
            ));
          }
          return richBody;
        })()}
      </div>

      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">{t("support-heading")}</h2>

      <p className="text-lg text-gray-700 leading-relaxed mb-6">{t("support-text")}</p>
      <DonateCard />
    </div>
  );
}
