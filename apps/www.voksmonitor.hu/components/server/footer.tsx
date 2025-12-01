import { mdiEmail, mdiFacebook, mdiInstagram, mdiPhone } from "@mdi/js";
import { Icon, Logo } from "@kalkulacka-one/design-system/client";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
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
                <Link href="https://www.instagram.com/kmonitorhu/" target="_blank" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center" aria-label="Instagram">
                  <Icon icon={mdiInstagram} size="medium" decorative />
                </Link>
                <Link href="https://www.facebook.com/Kmonitor/" target="_blank" className="text-gray-400 hover:text-white transition-colors flex items-center justify-center" aria-label="Facebook">
                  <Icon icon={mdiFacebook} size="medium" decorative />
                </Link>
              </div>
            </div>
            <div />
            <div className="grid grid-flow-row gap-2">
              <Link href="/rolunk" className="text-sm text-gray-400 hover:text-white">
                Rólunk
              </Link>
              <Link href="/voksmonitorrol" className="text-sm text-gray-400 hover:text-white">
                A Voksmonitorról
              </Link>
              <Link href="/modszertan" className="text-sm text-gray-400 hover:text-white">
                Módszertan
              </Link>
              <Link href="https://tamogatas.k-monitor.hu/" target="_blank" className="text-sm text-gray-400 hover:text-white">
                Támogatás
              </Link>
            </div>
            <div>
              <h3 className="mb-4">Kapcsolat</h3>
              <div className="space-y-3">
                <a href="mailto:info@k-monitor.hu" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                  <Icon icon={mdiEmail} size="medium" decorative />
                  <span>info@k-monitor.hu</span>
                </a>
                <a href="tel:+3617895005" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                  <Icon icon={mdiPhone} size="medium" decorative />
                  <span>+36 1 789 5005</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
