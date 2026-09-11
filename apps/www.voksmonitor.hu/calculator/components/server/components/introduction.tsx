"use client";

import { useTranslations } from "next-intl";

import type { CalculatorViewModel } from "../../../view-models";

export type Introduction = {
  calculator: CalculatorViewModel;
};

export function Introduction({ calculator }: Introduction) {
  const t = useTranslations("calculator.introduction");
  const calculatorKey = calculator.key ?? "voksmonitor-2026";
  const tc = useTranslations(`calculator.introduction.${calculatorKey}`);
  return (
    <div className="grid gap-2 max-w-prose text-slate-600">
      <p className="font-bold">{tc("para1")}</p>
      <p>{tc("para2")}</p>
      <p>
        {tc.rich("para3", {
          kmonitor: (chunks) => (
            <a href="https://k-monitor.hu/" className="font-bold">
              {chunks}
            </a>
          ),
          website: (chunks) => (
            <a href="https://k-monitor.hu/" className="font-semibold text-gray-900">
              {chunks}
            </a>
          ),
          kohopolit: (chunks) => (
            <a href="https://kohovolit.eu/" className="font-bold">
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
        })}
      </p>
    </div>
  );
}
