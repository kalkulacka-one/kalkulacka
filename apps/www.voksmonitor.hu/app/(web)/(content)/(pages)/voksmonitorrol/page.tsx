import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { DonateCard } from "../../../../../calculator/components/client";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.voksmonitorrol");
  return { title: t("meta-title") };
}

export default async function Page() {
  const t = await getTranslations("pages.voksmonitorrol");

  return (
    <div className="ko:max-w-4xl ko:mx-auto ko:p-6">
      <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-2xl md:text-xl mb-2 mt-8">{t("heading")}</h2>

      <h3 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-xl md:text-lg mb-2 mt-8">{t("what-heading")}</h3>

      {(() => {
        const richWhat = t.rich("what", {
          website: (chunks) => (
            <a href="https://k-monitor.hu" className="font-semibold text-gray-900" target="_blank" rel="noopener noreferrer">
              {chunks}
            </a>
          ),
        });
        if (typeof richWhat === "string") {
          return richWhat.split("\n").map((para, i) => (
            <p key={i} className="text-lg text-gray-700 leading-relaxed mb-0">
              {para}
            </p>
          ));
        }
        return richWhat ?? null;
      })()}

      <h3 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-xl md:text-lg mb-2 mt-8">{t("who-heading")}</h3>

      {(() => {
        const richWho = t.rich("who", {
          website: (chunks) => (
            <a href="https://k-monitor.hu" className="font-semibold text-gray-900" target="_blank" rel="noopener noreferrer">
              {chunks}
            </a>
          ),
          koho: (chunks) => (
            <a href="https://kohovolit.eu/" className="font-semibold text-gray-900" target="_blank" rel="noopener noreferrer">
              {chunks}
            </a>
          ),
          vox: (chunks) => (
            <a href="https://www.facebook.com/valasztasi.kalauz/" className="font-semibold text-gray-900" target="_blank" rel="noopener noreferrer">
              {chunks}
            </a>
          ),
        });
        if (typeof richWho === "string") {
          return richWho.split("\n").map((para, i) => (
            <p key={i} className="text-lg text-gray-700 leading-relaxed mb-0">
              {para}
            </p>
          ));
        }
        return richWho ?? null;
      })()}

      <h3 className="font-display ko:font-display font-bold tracking-tight text-gray-800 text-xl md:text-lg mb-2 mt-8">{t("how-heading")}</h3>

      {(() => {
        const richHow = t.rich("how", {
          website: (chunks) => (
            <a href="https://k-monitor.hu" className="font-semibold text-gray-900" target="_blank" rel="noopener noreferrer">
              {chunks}
            </a>
          ),
        });
        if (typeof richHow === "string") {
          return richHow.split("\n").map((para, i) => (
            <p key={i} className="text-lg text-gray-700 leading-relaxed mb-0">
              {para}
            </p>
          ));
        }
        return richHow ?? null;
      })()}
    </div>
  );
}
