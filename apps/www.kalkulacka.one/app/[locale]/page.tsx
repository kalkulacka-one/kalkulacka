import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kalkulacka.1",
  description: "Ta pravá volební kalkulačka pro miliony voličů ve 4 zemích",
};

export default async function Page() {
  const t = await getTranslations("home");
  return (
    <section className="max-w-2xl grid gap-8">
      <section className="grid gap-2">
        <h2 className="text-2xl font-medium">
          {t.rich("heroTitle", {
            bold: (chunks) => <span className="font-bold">{chunks}</span>,
          })}
        </h2>
        <p>
          {t.rich("aboutUsPart1", {
            link: (chunks) => (
              <a href="https://kohovolit.eu" className="underline hover:no-underline">
                {chunks}
              </a>
            ),
            link2: (chunks) => (
              <a href="https://www.volebnikalkulacka.cz" className="underline hover:no-underline">
                {chunks}
              </a>
            ),
          })}
        </p>
        <p>
          {t.rich("aboutUsPart2", {
            link: (chunks) => (
              <a href="https://cesko.digital" className="underline hover:no-underline">
                {chunks}
              </a>
            ),
          })}
        </p>
        <ul className="list-none pl-4">
          <li>
            🇨🇿{" "}
            <a href="https://www.volebnikalkulacka.cz">
              {t.rich("countryCz", {
                bold: (chunks) => <span className="font-bold underline hover:no-underline">{chunks}</span>,
              })}
            </a>{" "}
          </li>
          <li>
            🇸🇰{" "}
            <a href="https://www.volebnakalkulacka.sk">
              {t.rich("countrySk", {
                bold: (chunks) => <span className="font-bold underline hover:no-underline">{chunks}</span>,
              })}
            </a>{" "}
          </li>
          <li>
            🇭🇺{" "}
            <a href="https://www.voksmonitor.hu">
              {t.rich("countryHu", {
                bold: (chunks) => <span className="font-bold underline hover:no-underline">{chunks}</span>,
              })}
            </a>{" "}
          </li>
          <li>
            🇦🇹{" "}
            <a href="https://www.wahlrechner.at">
              {t.rich("countryAt", {
                bold: (chunks) => <span className="font-bold underline hover:no-underline">{chunks}</span>,
              })}
            </a>{" "}
          </li>
          <li>
            🇷🇴{" "}
            <a href="https://www.testvot.eu">
              {t.rich("countryRo", {
                bold: (chunks) => <span className="font-bold underline hover:no-underline">{chunks}</span>,
              })}
            </a>{" "}
          </li>
          <li>
            🇽🇰{" "}
            <a href="https://www.kalkulatorizgjedhor.org">
              {t.rich("countryXk", {
                bold: (chunks) => <span className="font-bold underline hover:no-underline">{chunks}</span>,
              })}
            </a>{" "}
          </li>
          <li>
            🇦🇱{" "}
            <a href="https://www.kalkulatorizgjedhor.al">
              {t.rich("countryAl", {
                bold: (chunks) => <span className="font-bold underline hover:no-underline">{chunks}</span>,
              })}
            </a>
            <span className="inline-flex items-center ml-2 px-2 py-0.25 rounded-full text-sm font-medium bg-gray-200">{t("countryAlDate")}</span>
          </li>
          <li>
            🇲🇰{" "}
            <a href="https://www.glasomer.mk">
              {t.rich("countryMk", {
                bold: (chunks) => <span className="font-bold underline hover:no-underline">{chunks}</span>,
              })}
            </a>
            <span className="inline-flex items-center ml-2 px-2 py-0.25 rounded-full text-sm font-medium bg-gray-200">{t("countryMkDate")}</span>
          </li>
        </ul>
        <p>
          {t.rich("stats", {
            bold: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </section>
      <section className="grid gap-2">
        <h2 className="text-2xl font-medium">{t("supportTitle")}</h2>
        <p>
          {t.rich("supportText", {
            link: (chunks) => (
              <Link href="/cs/podporte-kalkulacku" className="font-bold underline hover:no-underline">
                {chunks}
              </Link>
            ),
            link2: (chunks) => (
              <Link href="/cs/zapojte-se" className="font-bold underline hover:no-underline">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </section>
    </section>
  );
}
