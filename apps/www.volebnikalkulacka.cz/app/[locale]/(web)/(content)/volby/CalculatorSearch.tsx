"use client";

import { Field, Input, Label } from "@kalkulacka-one/design-system/client";
import { SearchIcon } from "@kalkulacka-one/design-system/icons";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

import { normalizeForSearch } from "@/lib/text/normalize-for-search";

export type SearchableCalculator = {
  key: string;
  districtName: string;
  districtCode?: string;
  /** Further calculators for the same district, e.g. its Inventura hlasování. */
  variants?: { key: string; name: string }[];
};

/**
 * The city picker: one row per district, narrowed by a typed filter.
 *
 * The filter is client-side over the whole list rather than a round trip —
 * seventy-odd names are nothing to ship, and a municipal calculator is useless
 * until you have found your own town, so the narrowing has to feel instant.
 */
export function CalculatorSearch({
  calculators,
  basePath,
  placeholder,
  label,
  showCode = false,
}: {
  calculators: SearchableCalculator[];
  basePath: string;
  placeholder: string;
  label: string;
  showCode?: boolean;
}) {
  const [query, setQuery] = useState("");
  const inputId = useId();

  const matches = useMemo(() => {
    const needle = normalizeForSearch(query.trim());
    if (!needle) return calculators;
    return calculators.filter((calculator) => normalizeForSearch(calculator.districtName).includes(needle) || calculator.districtCode?.startsWith(needle));
  }, [calculators, query]);

  return (
    <div>
      <Field>
        <Label htmlFor={inputId} className="sr-only">
          {label}
        </Label>
        <Input id={inputId} type="search" autoComplete="off" value={query} placeholder={placeholder} onChange={(event) => setQuery(event.target.value)}>
          <SearchIcon className="w-4 h-4 text-slate-500" decorative />
        </Input>
      </Field>

      <p aria-live="polite" className="mt-3 text-sm text-slate-500">
        {matches.length === calculators.length ? `Celkem ${calculators.length}` : `Nalezeno ${matches.length} z ${calculators.length}`}
      </p>

      {matches.length === 0 ? (
        <p className="mt-8 text-slate-500">
          Pro „{query.trim()}“ jsme nic nenašli. Kalkulačku zatím připravujeme jen pro některá města —{" "}
          <Link href="/zapojte-se" className="text-slate-700 underline underline-offset-2">
            pomozte nám s tou pro vaše
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((calculator) => (
            <li key={calculator.key}>
              <div className="h-full rounded-lg border-2 border-slate-200 bg-white p-4 flex flex-col gap-2">
                <Link
                  href={`${basePath}/${calculator.key}`}
                  className="font-display ko:font-display font-bold tracking-tight text-slate-700 text-lg hover:text-slate-900 underline-offset-4 hover:underline"
                >
                  {showCode && calculator.districtCode ? `${calculator.districtCode}. ${calculator.districtName}` : calculator.districtName}
                </Link>
                {calculator.variants && calculator.variants.length > 0 && (
                  <ul className="flex flex-wrap gap-x-3 gap-y-1">
                    {calculator.variants.map((variant) => (
                      <li key={variant.key}>
                        <Link href={`${basePath}/${variant.key}`} className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2">
                          {variant.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
