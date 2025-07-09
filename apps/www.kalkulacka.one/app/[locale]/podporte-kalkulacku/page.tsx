"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  const t = useTranslations("SupportPage");

  useEffect(() => {
    // biome-ignore lint/security/noGlobalEval: Darujme widget is external code for donation processing
    eval(`+function(w, d, s, u, a, b) {
      w["DarujmeObject"] = u;
      w[u] = w[u] || function () { (w[u].q = w[u].q || []).push(arguments) };
      a = d.createElement(s); b = d.getElementsByTagName(s)[0];
      a.async = 1; a.src = "https://www.darujme.cz/assets/scripts/widget.js";
      b.parentNode.insertBefore(a, b);
    }(window, document, "script", "Darujme");
    Darujme(1, "w2acrk0w61fgr3so", 'render', "https://www.darujme.cz/widget?token=w2acrk0w61fgr3so", "100%");`);
  }, []);

  return (
    <section className="max-w-2xl grid gap-8">
      <section className="grid gap-2">
        <h2 className="text-3xl font-bold">{t("title")}</h2>
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p>
          {t.rich("p3", {
            link: (chunks) => (
              <Link href="/cs/zapojit-se" className="underline hover:no-underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
        <p>{t("p4")}</p>
      </section>
      <section className="grid gap-2">
        <h3 className="text-2xl font-bold">{t("clubTitle")}</h3>
        <p>
          {t.rich("clubP1", {
            link: (chunks) => (
              <a href="https://herohero.co/volebnikalkulacka" className="underline hover:no-underline">
                {chunks}
              </a>
            ),
          })}
        </p>
        <ul className="list-disc pl-6">
          <li>{t("clubLi1")}</li>
          <li>{t("clubLi2")}</li>
          <li>{t("clubLi3")}</li>
        </ul>
        <div className="flex gap-2">
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href="https://herohero.co/volebnikalkulacka">
            {t("clubButton")}
          </a>
        </div>
      </section>
      <section className="grid gap-2">
        <h3 className="text-2xl font-bold">{t("oneTimeContributionTitle")}</h3>
        <p>{t("oneTimeContributionP1")}</p>
        <div className="max-w-md" data-darujme-widget-token="w2acrk0w61fgr3so">
          {t("loading")}
        </div>
        <p>{t("thankYou")}</p>
      </section>
      <section className="grid gap-2">
        <p>
          {t.rich("contactP1", {
            link: (chunks) => (
              <a href="mailto:hey@kalkulacka.one" className="underline hover:no-underline">
                {chunks}
              </a>
            ),
            link2: (chunks) => (
              <a href="https://twitter.com/kalkulacka_one" className="underline hover:no-underline">
                <span className="line-through">Twitteru</span> {chunks}
              </a>
            ),
          })}
        </p>
      </section>
    </section>
  );
}
