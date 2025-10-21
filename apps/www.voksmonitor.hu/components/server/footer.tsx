import { mdiInstagram } from "@mdi/js";
import { Icon, Logo } from "@repo/design-system/client";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-white">
                <Logo title="Volební kalkulačka" size="small" monochrome />
              </div>
              <p className="text-sm text-white mt-3">
                A <strong>Voksmonitor</strong> összeveti a véleményedet a pártok programjaival.
              </p>
              <div className="grid grid-cols-2 gap-2 mt-4 w-fit">
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
            <div />
            <div className="grid grid-flow-row gap-2">
              <Link href="/rolunk" className="text-sm text-slate-400 hover:text-white">
                Rólunk
              </Link>
              <Link href="/modszertan" className="text-sm text-slate-400 hover:text-white">
                Módszertan
              </Link>
              <Link href="https://tamogatas.k-monitor.hu/" target="_blank" className="text-sm text-slate-400 hover:text-white">
                Támogatás
              </Link>
            </div>
            <div />
          </div>
        </div>
      </div>
    </footer>
  );
}
