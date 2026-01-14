// TODO [TENANT-006]: Extract footer text to i18n, configure MK social links

import { Logo } from "@kalkulacka-one/design-system/client";

import Link from "next/link";

import { appConfig } from "@/config/app-config";

export function Footer() {
  const showStatus = appConfig.footer.showStatus;
  const statusUrl = appConfig.footer.statusUrl;
  const showAnalytics = appConfig.footer.showAnalytics;
  const analyticsUrl = appConfig.footer.analyticsUrl ?? (process.env.ANALYTICS_DOMAIN ? `https://plausible.io/${process.env.ANALYTICS_DOMAIN}` : undefined);

  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-white">
                <Logo title="Изборен калкулатор" size="small" monochrome />
              </div>
              <p className="text-sm text-white mt-3">
                <strong>Изборен калкулатор</strong> ви помага да одлучите кого да гласате
              </p>
            </div>
            <div />
            <div className="grid grid-flow-row gap-2">
              {showStatus && statusUrl && (
                <Link href={statusUrl} target="_blank" className="text-sm text-slate-400 hover:text-white">
                  Статус
                </Link>
              )}
              {showAnalytics && analyticsUrl && (
                <Link href={analyticsUrl} target="_blank" className="text-sm text-slate-400 hover:text-white">
                  Статистики
                </Link>
              )}
            </div>
            <div />
          </div>
        </div>
      </div>
    </footer>
  );
}
