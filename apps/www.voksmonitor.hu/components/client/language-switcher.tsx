"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useTransition } from "react";

import { setLocale } from "../../app/actions";

const LOCALES = [
  { code: "hu", label: "HU" },
  { code: "en", label: "EN" },
] as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Sync locale with ?lang=xx in URL
  useEffect(() => {
    const urlLang = searchParams.get("lang");
    if (urlLang && urlLang !== locale) {
      setLocale(urlLang).then(() => {
        router.refresh();
      });
    }
  }, [searchParams, locale, router]);

  const handleSwitch = (newLocale: string) => {
    startTransition(async () => {
      await setLocale(newLocale);
      // Update the URL with the new lang param
      const params = new URLSearchParams(searchParams.toString());
      params.set("lang", newLocale);
      router.push("?" + params.toString());
      router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-1 py-0.5 text-base font-semibold">
      {LOCALES.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => handleSwitch(code)}
          disabled={locale === code || isPending}
          className={
            locale === code
              ? "rounded-full bg-gray-900 px-3 py-1 text-white cursor-default"
              : "rounded-full px-3 py-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer disabled:opacity-50"
          }
          aria-label={`Switch to ${label}`}
          aria-current={locale === code ? "true" : undefined}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
