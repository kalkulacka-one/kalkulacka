import { Button } from "@kalkulacka-one/design-system/client";
import { Card } from "@kalkulacka-one/design-system/server";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useId } from "react";

import { Background } from "../../../components/Background";
import { SubscribeForm } from "../../../components/client";
import { BeadRow } from "./BeadRow";

export default function Page() {
  const bgGridId = useId();
  const otherCalcsHeadingId = useId();
  const t = useTranslations("homepage");

  return (
    <Background hasBlobs={true} blobsHeight="80%" blueBlobX="5%" blueBlobY="10%" redBlobX="50%" redBlobY="20%">
      <div className="relative min-h-screen z-0 flex flex-col">
        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 pt-12 md:pt-16 lg:pt-20 pb-4 md:pb-6 flex-1">
          {/* Heading */}
          <h1 className="font-display ko:font-display font-bold tracking-tighter text-gray-700 text-4xl md:text-5xl lg:text-6xl text-center">{t("title")}</h1>
          <p className="mt-3 text-center text-lg font-semibold text-gray-600">{t("date")}</p>

          {/* Post-election panel */}
          <div className="mt-10 md:mt-12 flex justify-center">
            <div className="w-full max-w-2xl">
              <Card border className="h-full !border-gray-200 bg-gray-50/50">
                <div className="p-6 h-full flex flex-col">
                  <p className="text-gray-600">{t("post-election-panel.description")}</p>
                  <p className="mt-3 font-semibold text-gray-700">{t("post-election-panel.signature")}</p>
                  <div className="grid mt-4 gap-3">
                    <Link href={`/vm/${t("2026-card.calculator-name")}/inventory/valaszok`} className="grid">
                      <Button variant="fill" color="primary">
                        {t("post-election-panel.answers-button")}
                      </Button>
                    </Link>
                    <a
                      href="https://voxpopuli.444.hu/2026/05/26/tamogattak-e-a-miniszterelnokke-valaszthatosag-8-evre-csokkenteset-a-tisza-szavazoi-a-valasztasok-elott-es-kellokeppen-nepszeru-e-az-alapitvanyi-fenntartasu-egyetemek-statuszanak-megvaltoztatasa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid"
                    >
                      <Button variant="outline" color="primary">
                        {t("post-election-panel.analysis-button")}
                      </Button>
                    </a>
                    <a
                      href="https://k.blog.hu/2026/08/06/mire_vagytak_a_2026-os_voksmonitor_kitoltoi_es_mit_kaptak_a_valasztason"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-center text-sm font-semibold text-gray-600 underline underline-offset-2 hover:text-gray-900"
                    >
                      {t("post-election-panel.analysis-link")}
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Featured cards */}
          <div className="mt-10 md:mt-12 flex justify-center">
            <div className="w-full max-w-2xl">
              {/* Right featured */}
              <Card shadow="elevated" border corner="topLeft" className="bg-white h-full !border-gray-200">
                <div className="p-6 md:p-8 h-full flex flex-col">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700">{t("2026-card.tags.questionnaire")}</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1">{t("2026-card.tags.questions")}</span>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1">{t("2026-card.tags.duration")}</span>
                  </div>
                  <h2 className="mt-4 font-display ko:font-display font-bold tracking-tight text-gray-700 text-2xl md:text-3xl">{t("2026-card.title")}</h2>
                  <p className="mt-2 text-gray-500">
                    {t.rich("2026-card.description", {
                      website: (chunks) => (
                        <a href="https://k-monitor.hu" className="font-semibold text-gray-900" target="_blank" rel="noopener noreferrer">
                          {chunks}
                        </a>
                      ),
                    })}
                  </p>
                  <div className="grid mt-auto pt-4 md:pt-6">
                    <Link href={`/vm/${t("2026-card.calculator-name")}/inventory`} className="grid">
                      <Button variant="fill" color="primary">
                        {t("2026-card.start-button")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-2xl">
              {/* Other calculators */}
              <h3 id={otherCalcsHeadingId} className="mt-16 md:mt-20 font-display ko:font-display font-bold tracking-tight text-slate-700 text-3xl">
                {t("other-calculators")}
              </h3>
              <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-2 items-stretch">
                <Card shadow="elevated" border corner="topLeft" className="bg-white h-full !border-gray-200">
                  <div className="p-6 md:p-8 h-full flex flex-col">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 font-semibold text-red-700">{t("bp-card.tags.questionnaire")}</span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1">{t("bp-card.tags.questions")}</span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1">{t("bp-card.tags.duration")}</span>
                    </div>
                    <h2 className="mt-4 font-display ko:font-display font-bold tracking-tight text-gray-700 text-2xl md:text-3xl">{t("bp-card.title")}</h2>
                    <p className="mt-2 text-gray-500">{t("bp-card.description")}</p>
                    <div className="grid mt-auto pt-4 md:pt-6">
                      <Link href="/vm/fovarosi-kozgyules/inventory" className="grid">
                        <Button variant="fill" color="primary">
                          {t("bp-card.start-button")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          {/* Archive section */}
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-2xl">
              <Card border className="h-full !border-gray-200 bg-gray-50/50">
                <div className="p-6 h-full flex flex-col">
                  <p className="text-gray-600 text-center">{t("archive-section.description")}</p>
                  <div className="grid mt-auto pt-4">
                    <a href="https://old.voksmonitor.hu" target="_blank" rel="noopener noreferrer" className="grid">
                      <Button variant="link" color="neutral">
                        {t("archive-section.archive-button")}
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Methodology section */}
          <div className="mt-12">
            <div className="w-full max-w-6xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-8 md:p-12">
                <h2 className="font-display ko:font-display font-bold tracking-tight text-gray-700 text-3xl md:text-4xl text-center mb-4">{t("methodology-section.title")}</h2>
                <p className="text-center text-gray-600 max-w-4xl mx-auto mb-12">
                  {t.rich("methodology-section.description", {
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
                  })}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                  {/* Step 1 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <Image src="/methodology/1.png" alt={t("methodology-section.step1-alt")} width={64} height={64} />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{t("methodology-section.step1-text")}</p>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <Image src="/methodology/2.png" alt={t("methodology-section.step2-alt")} width={64} height={64} />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{t("methodology-section.step2-text")}</p>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <Image src="/methodology/3.png" alt={t("methodology-section.step3-alt")} width={64} height={64} />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{t("methodology-section.step3-text")}</p>
                  </div>

                  {/* Step 4 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <Image src="/methodology/4.png" alt={t("methodology-section.step4-alt")} width={64} height={64} />
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{t("methodology-section.step4-text")}</p>
                  </div>
                </div>
                <p className="text-center text-gray-600 max-w-4xl mx-auto mt-12">
                  {t("methodology-section.footer-text")}
                  <br />
                  <a href="/rolunk" className="font-bold">
                    {t("methodology-section.learn-more")}
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter subscription */}
          <div className="mt-16 max-w-md mx-auto">
            <SubscribeForm />
          </div>

          {/* Footer */}
          <div className="mt-16 border-t border-gray-200 pt-6 text-center text-gray-500">{t("footer")}</div>
        </div>
      </div>
    </Background>
  );
}
