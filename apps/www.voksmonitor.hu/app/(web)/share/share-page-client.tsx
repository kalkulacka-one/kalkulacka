"use client";

import { Button, Logo } from "@kalkulacka-one/design-system/client";
import { Avatar, ProgressBar } from "@kalkulacka-one/design-system/server";

import Link from "next/link";
import { useTranslations } from "next-intl";

import type { ImageUrls } from "../../../../../packages/schema/schemas/images.schema";

export type ShareMatch = {
  candidateId: string;
  displayName: string;
  match: number;
  avatar?: {
    type: "avatar" | "logo" | "portrait";
    urls: ImageUrls;
  };
  type?: string;
};

export type SharePageClient = {
  matches: ShareMatch[];
  calculatorKey: string;
};

export function SharePageClient({ matches, calculatorKey }: SharePageClient) {
  const t = useTranslations("share-page");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 p-2 sm:p-3 bg-white/60 backdrop-blur-md">
        <div className="grid grid-cols-[auto_1fr] items-center gap-2">
          <Link href="/">
            <Logo title="Voksmonitor" size="small" />
          </Link>
          <div className="grid text-sm text-gray-900 leading-none" style={{ fontFamily: "'Radio Canada', sans-serif" }}>
            <h1 className="font-bold uppercase">Voksmonitor</h1>
          </div>
        </div>
      </header>
      <main className="max-w-xl w-full mx-auto p-2 sm:p-4">
        <h2 className="font-display font-semibold text-2xl tracking-tight text-gray-700 mb-6">{t("heading")}</h2>
        <p className="text-gray-500 mb-6">{t("description")}</p>
        {matches.length === 0 ? (
          <p className="text-gray-500">{t("no-results")}</p>
        ) : (
          <div className="grid gap-4 mb-6">
            {matches.map((match, index) => (
              <div key={match.candidateId} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {<ProgressBar value={match.match} color={index === 0 ? "primary" : "neutral"} corner="sharp" />}
                <div className="grid gap-3 p-4 sm:gap-4 sm:p-6">
                  <div className="grid grid-cols-[auto_1fr_auto] gap-4 items-center">
                    {match.avatar ? (
                      <Avatar
                        image={match.avatar.urls}
                        backgroundColor="#e2e8f0"
                        shape={match.type === "person" ? "circle" : "square"}
                        alignment={match.avatar.type === "portrait" ? "top" : "center"}
                        fit={match.avatar.type === "logo" ? "contain" : "cover"}
                        padding={match.avatar.type === "logo" || match.avatar.type === "avatar"}
                        size="large"
                      />
                    ) : (
                      <div
                        className={`flex h-20 w-20 items-center justify-center rounded-2xl ${index === 0 ? "bg-[var(--ko-color-primary)] text-[var(--ko-color-on-bg-primary)]" : "bg-white text-gray-700"}`}
                      >
                        <span className="text-3xl font-bold">{index + 1}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-1 items-start justify-center">
                      <h3 className="text-lg font-bold leading-tight text-gray-700">{match.displayName}</h3>
                    </div>
                    <div className="flex items-center">
                      <span className="text-3xl font-bold tracking-tight text-gray-800">{Math.round(match.match)} %</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center">
          <Link href={`/vm/${calculatorKey}/bevezeto`}>
            <Button variant="fill" color="primary">
              {t("cta-button")}
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
