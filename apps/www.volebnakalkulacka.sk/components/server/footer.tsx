// TODO [TENANT-006]: Extract footer text to i18n, configure SK social links

import { Icon, Logo } from "@kalkulacka-one/design-system/client";

import { mdiEmailOutline, mdiInstagram, mdiPhoneOutline } from "@mdi/js";
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
            <div className="grid grid-flow-row auto-rows-max gap-4">
              <div className="grid grid-flow-row auto-rows-max gap-2">
                <div className="text-white">
                  <Logo title="Volebná kalkulačka" size="small" monochrome />
                </div>
                <p className="text-sm text-white">
                  <strong>Volebná kalkulačka</strong> vám pomáha rozhodnúť sa koho voliť
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-fit">
                <Link
                  href="https://www.instagram.com/volebnikalk"
                  target="_blank"
                  className="text-slate-400 hover:text-white transition-colors flex items-center justify-center"
                  aria-label="Instagram"
                >
                  <Icon icon={mdiInstagram} size="medium" decorative />
                </Link>
                <Link href="https://twitter.com/volebnikalk" target="_blank" className="text-slate-400 hover:text-white transition-colors flex items-center justify-center" aria-label="X (Twitter)">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="grid grid-flow-row auto-rows-max gap-2">
              <Link href="/o-projekte" className="text-sm text-slate-400 hover:text-white">
                O projekte
              </Link>
            </div>
            <div className="grid grid-flow-row auto-rows-max gap-2">
              {showStatus && statusUrl && (
                <Link href={statusUrl} target="_blank" className="text-sm text-slate-400 hover:text-white">
                  Status
                </Link>
              )}
              {showAnalytics && analyticsUrl && (
                <Link href={analyticsUrl} target="_blank" className="text-sm text-slate-400 hover:text-white">
                  Štatistiky
                </Link>
              )}
              <Link href="/soukromi" className="text-sm text-slate-400 hover:text-white">
                Súkromie
              </Link>
            </div>
            <div className="grid grid-flow-row auto-rows-max gap-2">
              <a href="mailto:ahoj@volebnakalkulacka.sk" className="text-sm text-slate-400 hover:text-white inline-flex items-center gap-2">
                <Icon icon={mdiEmailOutline} size="small" decorative />
                ahoj@volebnakalkulacka.sk
              </a>
              <a href="tel:+420735518529" className="text-sm text-slate-400 hover:text-white inline-flex items-center gap-2">
                <Icon icon={mdiPhoneOutline} size="small" decorative />
                +420 735 518 529
              </a>
            </div>
            <div />
          </div>
        </div>
      </div>
    </footer>
  );
}
